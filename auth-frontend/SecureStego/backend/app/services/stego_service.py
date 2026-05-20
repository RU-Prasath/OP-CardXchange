"""
LSB Steganography service for SecureStego.

Embeds and extracts arbitrary byte payloads into the least significant
bits of an RGB image's pixel values.

Embedding scheme:
  - Image must be RGB (PIL converts RGBA/L to RGB before embedding).
  - Each pixel has 3 channels (R, G, B). Each channel holds 1 bit of payload.
  - A 32-bit big-endian payload length is prepended before the payload bytes.
  - Total bits embedded = 32 + (len(payload) * 8).

Output:
  - Stego image is saved as PNG (lossless) — JPEG would destroy LSBs.
"""
from io import BytesIO

import numpy as np
from PIL import Image


# How many bits we prepend before the payload to record its length.
# 32 bits = up to 4 GB of hidden payload (we won't need that much).
LENGTH_HEADER_BITS = 32


# ===== Helpers =====

def _bytes_to_bits(data: bytes) -> np.ndarray:
    """
    Convert a bytes object into a flat numpy array of 0/1 bits (uint8).

    Example:
        bytes_to_bits(b'\\x05') -> [0, 0, 0, 0, 0, 1, 0, 1]
    """
    # np.unpackbits unpacks MSB first by default, which is what we want
    return np.unpackbits(np.frombuffer(data, dtype=np.uint8))


def _bits_to_bytes(bits: np.ndarray) -> bytes:
    """
    Convert a flat numpy array of 0/1 bits back into bytes.

    The array length must be a multiple of 8.
    """
    if len(bits) % 8 != 0:
        raise ValueError(
            f"Bit array length ({len(bits)}) is not a multiple of 8"
        )
    return np.packbits(bits.astype(np.uint8)).tobytes()


def _length_to_bits(length: int) -> np.ndarray:
    """
    Encode an integer length as a 32-bit big-endian bit array.

    This 32-bit prefix tells the extractor how many payload bits to read.
    """
    if length < 0 or length >= 2**LENGTH_HEADER_BITS:
        raise ValueError(f"Payload length {length} exceeds 32-bit limit")
    # Pack the length as 4 bytes (big-endian), then unpack to bits
    length_bytes = length.to_bytes(4, byteorder="big")
    return _bytes_to_bits(length_bytes)


def _bits_to_length(bits: np.ndarray) -> int:
    """Decode a 32-bit big-endian bit array back into an integer length."""
    if len(bits) != LENGTH_HEADER_BITS:
        raise ValueError(
            f"Expected {LENGTH_HEADER_BITS} bits, got {len(bits)}"
        )
    length_bytes = _bits_to_bytes(bits)
    return int.from_bytes(length_bytes, byteorder="big")


# ===== Public API =====

def get_capacity_bytes(image: Image.Image) -> int:
    """
    Calculate how many bytes can be hidden in this cover image,
    after accounting for the 32-bit length header.

    Each RGB pixel carries 3 bits (one per channel).
    """
    rgb_image = image.convert("RGB")
    width, height = rgb_image.size
    total_bits = width * height * 3
    payload_bits = total_bits - LENGTH_HEADER_BITS
    return max(0, payload_bits // 8)


def embed_payload(cover_image: Image.Image, payload: bytes) -> Image.Image:
    """
    Embed a byte payload into the LSBs of a cover image.

    Args:
        cover_image: A PIL Image (any mode — will be converted to RGB).
        payload: The bytes to hide (e.g., serialized EncryptedPayload).

    Returns:
        A new PIL Image with the same dimensions as the cover, carrying
        the hidden payload in its LSBs. Always returned as RGB.

    Raises:
        ValueError: if the payload is too large for this cover image.
    """
    if not payload:
        raise ValueError("Payload cannot be empty")

    # Always work in RGB
    rgb_image = cover_image.convert("RGB")
    width, height = rgb_image.size

    # Capacity check
    capacity = get_capacity_bytes(rgb_image)
    if len(payload) > capacity:
        raise ValueError(
            f"Payload too large: {len(payload)} bytes, but cover image can "
            f"only hold {capacity} bytes. Use a larger cover image."
        )

    # Build the bit stream: [32-bit length][payload bits]
    length_bits = _length_to_bits(len(payload))
    payload_bits = _bytes_to_bits(payload)
    bit_stream = np.concatenate([length_bits, payload_bits])

    # Load pixels as a flat array
    # Shape goes from (height, width, 3) -> (height*width*3,)
    pixels = np.array(rgb_image, dtype=np.uint8)
    flat = pixels.reshape(-1)

    # Pad the bit stream with zeros to match the flat array length
    # (so we can vectorize the LSB modification)
    if len(bit_stream) > len(flat):
        # Should be caught by capacity check above
        raise ValueError("Bit stream longer than image — internal error")

    # Modify LSBs: clear the last bit (& 0xFE), then OR with the bit
    # We only modify the channels covered by our bit_stream — the rest
    # of the image is left untouched.
    n = len(bit_stream)
    flat[:n] = (flat[:n] & 0xFE) | bit_stream

    # Reshape back to the original image
    modified_pixels = flat.reshape((height, width, 3))
    stego_image = Image.fromarray(modified_pixels, mode="RGB")

    return stego_image


def extract_payload(stego_image: Image.Image) -> bytes:
    """
    Extract a hidden byte payload from the LSBs of a stego image.

    Args:
        stego_image: A PIL Image previously produced by embed_payload.

    Returns:
        The hidden bytes — typically a serialized EncryptedPayload to
        feed back into the crypto service for decryption.

    Raises:
        ValueError: if the image is too small or the embedded length is invalid.
    """
    rgb_image = stego_image.convert("RGB")

    # Get pixels as a flat array
    pixels = np.array(rgb_image, dtype=np.uint8)
    flat = pixels.reshape(-1)

    if len(flat) < LENGTH_HEADER_BITS:
        raise ValueError("Image too small to contain a SecureStego payload")

    # Extract every LSB into a flat bit array (vectorized: just AND with 1)
    all_bits = flat & 1

    # First 32 bits = payload length in bytes
    length_bits = all_bits[:LENGTH_HEADER_BITS]
    payload_length = _bits_to_length(length_bits)

    # Sanity check the length
    if payload_length <= 0:
        raise ValueError(
            "No hidden payload detected — this image may not be a stego image"
        )

    max_possible = (len(flat) - LENGTH_HEADER_BITS) // 8
    if payload_length > max_possible:
        raise ValueError(
            f"Declared payload length ({payload_length} bytes) exceeds "
            f"image capacity ({max_possible} bytes) — likely not a stego image"
        )

    # Read exactly payload_length * 8 bits after the header
    payload_bit_count = payload_length * 8
    payload_bits = all_bits[
        LENGTH_HEADER_BITS : LENGTH_HEADER_BITS + payload_bit_count
    ]

    return _bits_to_bytes(payload_bits)


# ===== Image I/O helpers =====

def load_image_from_bytes(image_bytes: bytes) -> Image.Image:
    """Load a PIL Image from raw bytes (uploaded file content)."""
    return Image.open(BytesIO(image_bytes))


def save_image_to_bytes(image: Image.Image, format: str = "PNG") -> bytes:
    """
    Serialize a PIL Image to bytes in the given format.

    For stego images, always use PNG (lossless). JPEG would destroy
    the LSB modifications and the hidden data would be lost.
    """
    if format.upper() in ("JPG", "JPEG"):
        raise ValueError(
            "Cannot save stego images as JPEG — lossy compression would "
            "destroy the hidden data. Use PNG instead."
        )

    buffer = BytesIO()
    image.save(buffer, format=format)
    return buffer.getvalue()


def serialize_image_for_embedding(
    secret_image: Image.Image, format: str = "PNG"
) -> bytes:
    """
    Convert the secret image into a byte stream ready for encryption + embedding.

    PNG is used to preserve the image exactly when we recover it.
    """
    buffer = BytesIO()
    secret_image.save(buffer, format=format)
    return buffer.getvalue()


def deserialize_image_from_bytes(image_bytes: bytes) -> Image.Image:
    """
    Reconstruct a PIL Image from bytes produced by serialize_image_for_embedding.
    """
    return Image.open(BytesIO(image_bytes))