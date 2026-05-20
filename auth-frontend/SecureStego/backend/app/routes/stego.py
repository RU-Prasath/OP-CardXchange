"""Steganography API endpoints — hide and reveal."""
from datetime import datetime, timezone
from io import BytesIO

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse

from app.core.config import settings
from app.core.dependencies import CurrentUser, DatabaseDep
from app.models.stego_models import (
    HideResponse,
    ImageDimensions,
    QualityMetrics,
    RevealResponse,
)
from app.services.history_service import record_operation
from app.services.pipeline_service import (
    hide_image_in_cover,
    reveal_image_from_stego,
)
from app.services.stego_service import load_image_from_bytes


router = APIRouter()


# ===== Helpers =====

def _validate_upload(file: UploadFile, label: str) -> None:
    """Reject non-image uploads and oversize files."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{label} must be an image (received {file.content_type})",
        )


async def _read_image_upload(file: UploadFile, label: str):
    """Read an UploadFile and return a PIL Image, raising HTTPException on failure."""
    _validate_upload(file, label)

    contents = await file.read()
    size_mb = len(contents) / (1024 * 1024)

    if size_mb > settings.MAX_UPLOAD_MB:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"{label} is too large ({size_mb:.1f} MB). Max {settings.MAX_UPLOAD_MB} MB.",
        )

    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{label} is empty",
        )

    try:
        image = load_image_from_bytes(contents)
        image.load()  # Force decode now so we surface errors here, not later
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{label} could not be opened as an image: {e}",
        )

    return image


def _image_to_png_stream(image) -> BytesIO:
    """Convert a PIL Image to a PNG byte stream ready for StreamingResponse."""
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


# ===== Endpoints =====

@router.post(
    "/hide",
    summary="Hide a secret image inside a cover image",
    response_description="The resulting stego image as a PNG file. Metadata is returned in response headers.",
)
async def hide(
    db: DatabaseDep,
    current_user: CurrentUser,
    cover: UploadFile = File(..., description="The visible carrier image"),
    secret: UploadFile = File(..., description="The image to hide inside the cover"),
    passphrase: str = Form(..., min_length=1, description="Secret passphrase for encryption"),
):
    """
    Hide an encrypted secret image inside a cover image using LSB steganography.

    The response body is the stego image (PNG). Metadata about the operation
    (size, quality metrics, payload bytes, secret hash) is returned in the
    `X-SecureStego-Metadata` response header as JSON.

    Steps:
    1. Encrypt secret bytes with AES-256-CBC (key derived via PBKDF2)
    2. Embed encrypted bytes into cover image's LSBs
    3. Compute PSNR/MSE between cover and stego
    4. Record the operation in history
    5. Return stego image as PNG
    """
    if not passphrase.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passphrase cannot be empty",
        )

    # Load both images
    cover_image = await _read_image_upload(cover, "Cover image")
    secret_image = await _read_image_upload(secret, "Secret image")

    # Run the pipeline
    try:
        hide_result = hide_image_in_cover(
            cover_image=cover_image,
            secret_image=secret_image,
            passphrase=passphrase,
        )
    except ValueError as e:
        # Record the failure too
        await record_operation(
            db=db,
            user_id=str(current_user["_id"]),
            operation="HIDE",
            success=False,
            metadata={
                "error": str(e),
                "cover_size": {
                    "width": cover_image.size[0],
                    "height": cover_image.size[1],
                },
                "secret_size": {
                    "width": secret_image.size[0],
                    "height": secret_image.size[1],
                },
            },
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    # Record the success
    payload_bytes = hide_result.payload_bytes
    capacity_bytes = hide_result.capacity_bytes
    utilization = round((payload_bytes / capacity_bytes) * 100, 2) if capacity_bytes else 0.0

    cover_dims = ImageDimensions(width=hide_result.cover_size[0], height=hide_result.cover_size[1])
    secret_dims = ImageDimensions(width=hide_result.secret_size[0], height=hide_result.secret_size[1])
    quality = QualityMetrics(**hide_result.quality)

    operation_id = await record_operation(
        db=db,
        user_id=str(current_user["_id"]),
        operation="HIDE",
        success=True,
        metadata={
            "cover_size": cover_dims.model_dump(),
            "secret_size": secret_dims.model_dump(),
            "payload_bytes": payload_bytes,
            "capacity_bytes": capacity_bytes,
            "capacity_utilization_pct": utilization,
            "quality": quality.model_dump(),
            "secret_hash": hide_result.secret_hash,
        },
    )

    # Build the metadata payload (JSON-serialized in a header)
    metadata = HideResponse(
        message="Secret successfully hidden inside cover image",
        operation_id=operation_id,
        cover_size=cover_dims,
        secret_size=secret_dims,
        payload_bytes=payload_bytes,
        capacity_bytes=capacity_bytes,
        capacity_utilization_pct=utilization,
        quality=quality,
        secret_hash=hide_result.secret_hash,
        created_at=datetime.now(timezone.utc),
    )

    print(f"✅ Hide success — user={current_user['email']} payload={payload_bytes}B PSNR={quality.psnr_label}")

    # Return stego PNG as the file body, metadata as JSON header
    png_stream = _image_to_png_stream(hide_result.stego_image)

    return StreamingResponse(
        png_stream,
        media_type="image/png",
        headers={
            "X-SecureStego-Metadata": metadata.model_dump_json(),
            "Access-Control-Expose-Headers": "X-SecureStego-Metadata, Content-Disposition",
            "Content-Disposition": 'attachment; filename="stego.png"',
        },
    )


@router.post(
    "/reveal",
    summary="Reveal the secret image hidden inside a stego image",
    response_description="The recovered secret image as a PNG file. Metadata is returned in response headers.",
)
async def reveal(
    db: DatabaseDep,
    current_user: CurrentUser,
    stego: UploadFile = File(..., description="The stego image carrying the hidden secret"),
    passphrase: str = Form(..., min_length=1, description="The same passphrase used during hide"),
):
    """
    Extract and decrypt the secret image from a stego image.

    The response body is the recovered secret image (PNG). Metadata about the
    operation is returned in the `X-SecureStego-Metadata` response header.

    Steps:
    1. Extract embedded bytes from stego LSBs
    2. Validate magic header (proves this is a SecureStego image)
    3. Decrypt with AES-256-CBC using passphrase-derived key
    4. Reconstruct the original image
    5. Record the operation in history
    6. Return secret image as PNG
    """
    if not passphrase.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passphrase cannot be empty",
        )

    stego_image = await _read_image_upload(stego, "Stego image")

    try:
        reveal_result = reveal_image_from_stego(stego_image, passphrase)
    except ValueError as e:
        await record_operation(
            db=db,
            user_id=str(current_user["_id"]),
            operation="REVEAL",
            success=False,
            metadata={"error": str(e)},
        )
        # Distinguish between "wrong passphrase" and "not a stego image"
        msg = str(e).lower()
        if "magic header" in msg or "version" in msg or "payload" in msg:
            status_code = status.HTTP_400_BAD_REQUEST  # Not a stego image
        else:
            status_code = status.HTTP_401_UNAUTHORIZED  # Likely wrong passphrase

        raise HTTPException(status_code=status_code, detail=str(e))

    secret_dims = ImageDimensions(
        width=reveal_result.secret_size[0],
        height=reveal_result.secret_size[1],
    )

    operation_id = await record_operation(
        db=db,
        user_id=str(current_user["_id"]),
        operation="REVEAL",
        success=True,
        metadata={
            "secret_size": secret_dims.model_dump(),
            "secret_hash": reveal_result.secret_hash,
        },
    )

    metadata = RevealResponse(
        message="Secret image successfully recovered",
        operation_id=operation_id,
        secret_size=secret_dims,
        secret_hash=reveal_result.secret_hash,
        integrity_ok=reveal_result.integrity_ok,
        created_at=datetime.now(timezone.utc),
    )

    print(f"✅ Reveal success — user={current_user['email']} secret={secret_dims.width}x{secret_dims.height}")

    png_stream = _image_to_png_stream(reveal_result.secret_image)

    return StreamingResponse(
        png_stream,
        media_type="image/png",
        headers={
            "X-SecureStego-Metadata": metadata.model_dump_json(),
            "Access-Control-Expose-Headers": "X-SecureStego-Metadata, Content-Disposition",
            "Content-Disposition": 'attachment; filename="secret.png"',
        },
    )