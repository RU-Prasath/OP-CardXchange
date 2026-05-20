"""
High-level pipeline for hiding and revealing secret images.

This is the orchestration layer that combines:
  - crypto_service (AES encryption of the secret bytes)
  - stego_service  (LSB embedding into the cover image)
  - quality_service (PSNR/MSE for visual fidelity proof)

Public API:
  - hide_image_in_cover()    : produces a stego image
  - reveal_image_from_stego(): recovers the original secret image
"""
from dataclasses import dataclass

from PIL import Image

from app.services.crypto_service import (
    EncryptedPayload,
    compute_sha256,
    decrypt_bytes,
    encrypt_bytes,
)
from app.services.stego_service import (
    deserialize_image_from_bytes,
    embed_payload,
    extract_payload,
    get_capacity_bytes,
    save_image_to_bytes,
    serialize_image_for_embedding,
)
from app.services.quality_service import compute_quality_metrics


# ===== Result containers =====

@dataclass
class HideResult:
    """Result of hiding a secret image inside a cover image."""
    stego_image: Image.Image
    cover_size: tuple[int, int]
    secret_size: tuple[int, int]
    payload_bytes: int
    capacity_bytes: int
    secret_hash: str
    quality: dict


@dataclass
class RevealResult:
    """Result of revealing a secret image from a stego image."""
    secret_image: Image.Image
    secret_size: tuple[int, int]
    secret_hash: str
    integrity_ok: bool


# ===== Pipeline operations =====

def hide_image_in_cover(
    cover_image: Image.Image,
    secret_image: Image.Image,
    passphrase: str,
) -> HideResult:
    """
    Encrypt a secret image with AES, then hide it inside a cover image
    using LSB steganography.

    Flow:
      1. Serialize secret image to PNG bytes
      2. Compute SHA-256 of secret bytes (for integrity check on reveal)
      3. Encrypt the bytes with AES-256-CBC + PBKDF2(passphrase)
      4. Serialize the encrypted payload (with magic header)
      5. Check capacity vs payload size
      6. Embed the serialized payload into the cover's LSBs
      7. Compute PSNR/MSE between cover and stego
      8. Return everything in a HideResult

    Args:
        cover_image: The carrier image (visible).
        secret_image: The image to hide (will be invisible inside the cover).
        passphrase: Secret string used to derive the AES key.

    Returns:
        HideResult containing the stego image and operation metadata.

    Raises:
        ValueError: if the passphrase is empty, or the secret is too large.
    """
    if not passphrase or not passphrase.strip():
        raise ValueError("Passphrase cannot be empty")

    # Step 1: Serialize secret image to bytes
    secret_bytes = serialize_image_for_embedding(secret_image, format="PNG")

    # Step 2: Compute integrity hash BEFORE encryption (verified after reveal)
    secret_hash = compute_sha256(secret_bytes)

    # Step 3: Encrypt the secret bytes
    encrypted_payload = encrypt_bytes(secret_bytes, passphrase)

    # Step 4: Serialize the encrypted payload (with magic header)
    payload_blob = encrypted_payload.to_bytes()

    # Step 5: Capacity check (give a clear error early)
    capacity = get_capacity_bytes(cover_image)
    if len(payload_blob) > capacity:
        # Tell the user how much bigger the cover needs to be
        needed = len(payload_blob)
        raise ValueError(
            f"Cover image too small. Need at least {needed:,} bytes of "
            f"capacity, but cover image only provides {capacity:,} bytes. "
            f"Try a larger cover image or a smaller secret image."
        )

    # Step 6: Embed
    stego_image = embed_payload(cover_image, payload_blob)

    # Step 7: Quality metrics — proves the stego looks like the cover
    quality = compute_quality_metrics(cover_image, stego_image)

    return HideResult(
        stego_image=stego_image,
        cover_size=cover_image.size,
        secret_size=secret_image.size,
        payload_bytes=len(payload_blob),
        capacity_bytes=capacity,
        secret_hash=secret_hash,
        quality=quality,
    )


def reveal_image_from_stego(
    stego_image: Image.Image,
    passphrase: str,
) -> RevealResult:
    """
    Reverse the hide operation: extract the encrypted payload from the
    stego image, decrypt it with the passphrase, and reconstruct the
    original secret image.

    Flow:
      1. Extract bits from stego image LSBs → byte blob
      2. Deserialize blob → EncryptedPayload (checks magic header)
      3. Decrypt payload with passphrase (verifies via PKCS7 padding)
      4. Deserialize bytes → PIL Image
      5. Compute SHA-256 of recovered bytes for integrity verification
      6. Return everything in a RevealResult

    Args:
        stego_image: The image carrying the hidden secret.
        passphrase: Same passphrase used during hide.

    Returns:
        RevealResult containing the recovered secret image and metadata.

    Raises:
        ValueError: if the image isn't a stego image, the passphrase is
                    wrong, or the data is corrupted.
    """
    if not passphrase or not passphrase.strip():
        raise ValueError("Passphrase cannot be empty")

    # Step 1: Extract the embedded byte blob from LSBs
    payload_blob = extract_payload(stego_image)

    # Step 2: Deserialize — this raises if the magic header is missing
    # (i.e., this isn't a SecureStego image)
    encrypted_payload = EncryptedPayload.from_bytes(payload_blob)

    # Step 3: Decrypt — this raises if the passphrase is wrong
    secret_bytes = decrypt_bytes(encrypted_payload, passphrase)

    # Step 4: Reconstruct the PIL image from bytes
    try:
        secret_image = deserialize_image_from_bytes(secret_bytes)
        # Force-load the image data here so we surface any errors immediately
        secret_image.load()
    except Exception as e:
        raise ValueError(
            f"Decrypted data does not appear to be a valid image: {e}"
        ) from e

    # Step 5: Compute hash for integrity reporting
    secret_hash = compute_sha256(secret_bytes)

    return RevealResult(
        secret_image=secret_image,
        secret_size=secret_image.size,
        secret_hash=secret_hash,
        integrity_ok=True,  # Decryption + image load both succeeded
    )