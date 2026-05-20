"""
AES encryption service for SecureStego.

Uses AES-256-CBC with PKCS7 padding, and PBKDF2-HMAC-SHA256 for
key derivation from a user passphrase.

Why AES-256-CBC instead of AES-GCM?
- Steganography embeds raw ciphertext into image bits.
- GCM produces a separate authentication tag that complicates embedding.
- CBC is simpler for stego, and integrity is achieved separately:
    * a magic header proves correct decryption
    * a SHA-256 hash verifies the recovered image
"""
from dataclasses import dataclass

# pyrefly: ignore [missing-import]
from Crypto.Cipher import AES
# pyrefly: ignore [missing-import]
from Crypto.Protocol.KDF import PBKDF2
# pyrefly: ignore [missing-import]
from Crypto.Random import get_random_bytes
# pyrefly: ignore [missing-import]
from Crypto.Util.Padding import pad, unpad
# pyrefly: ignore [missing-import]
from Crypto.Hash import SHA256

from app.core.config import settings


# Constants
AES_KEY_SIZE = 32          # 256 bits
AES_BLOCK_SIZE = 16        # CBC block size in bytes
SALT_SIZE = 16             # 128-bit salt for PBKDF2
IV_SIZE = 16               # 128-bit IV for CBC


# Magic header — proves the data was decrypted with the right key.
# If decryption with wrong passphrase produces garbage, this header
# will not match, allowing us to fail cleanly.
MAGIC_HEADER = b"SSTG"     # SecureStego
MAGIC_VERSION = b"\x01"    # Version 1


@dataclass
class EncryptedPayload:
    """Structured result of an encryption operation."""
    salt: bytes
    iv: bytes
    ciphertext: bytes

    def to_bytes(self) -> bytes:
        """
        Serialize into a single byte stream for embedding.

        Layout (header is prepended to ciphertext before encryption,
        but the framing for storage is):

          [MAGIC_HEADER : 4 bytes]
          [VERSION       : 1 byte]
          [SALT          : 16 bytes]
          [IV            : 16 bytes]
          [CT_LENGTH     : 4 bytes (big-endian uint32)]
          [CIPHERTEXT    : CT_LENGTH bytes]
        """
        ct_length = len(self.ciphertext).to_bytes(4, byteorder="big")
        return (
            MAGIC_HEADER
            + MAGIC_VERSION
            + self.salt
            + self.iv
            + ct_length
            + self.ciphertext
        )

    @classmethod
    def from_bytes(cls, blob: bytes) -> "EncryptedPayload":
        """Deserialize back into an EncryptedPayload. Raises ValueError if invalid."""
        if len(blob) < 4 + 1 + SALT_SIZE + IV_SIZE + 4:
            raise ValueError("Payload too small — not a valid SecureStego blob")

        offset = 0

        # Magic header
        magic = blob[offset : offset + 4]
        offset += 4
        if magic != MAGIC_HEADER:
            raise ValueError(
                "Invalid magic header — this image does not contain SecureStego data"
            )

        # Version
        version = blob[offset : offset + 1]
        offset += 1
        if version != MAGIC_VERSION:
            raise ValueError(f"Unsupported SecureStego version: {version.hex()}")

        # Salt
        salt = blob[offset : offset + SALT_SIZE]
        offset += SALT_SIZE

        # IV
        iv = blob[offset : offset + IV_SIZE]
        offset += IV_SIZE

        # Ciphertext length
        ct_length = int.from_bytes(blob[offset : offset + 4], byteorder="big")
        offset += 4

        # Ciphertext
        if len(blob) < offset + ct_length:
            raise ValueError("Truncated ciphertext")
        ciphertext = blob[offset : offset + ct_length]

        return cls(salt=salt, iv=iv, ciphertext=ciphertext)


# ===== Core crypto functions =====

def derive_key(passphrase: str, salt: bytes) -> bytes:
    """
    Derive a 256-bit AES key from a user passphrase using PBKDF2-HMAC-SHA256.

    Why PBKDF2:
      - Human passwords have low entropy.
      - PBKDF2 with 100,000 iterations slows down brute-force attacks.
      - The same passphrase + salt always produces the same key (deterministic),
        so we don't need to store the derived key.

    Args:
        passphrase: User-supplied secret string.
        salt: Random salt unique to this encryption operation.

    Returns:
        A 32-byte (256-bit) AES key.
    """
    if not passphrase:
        raise ValueError("Passphrase cannot be empty")

    return PBKDF2(
        password=passphrase.encode("utf-8"),
        salt=salt,
        dkLen=AES_KEY_SIZE,
        count=settings.PBKDF2_ITERATIONS,
        hmac_hash_module=SHA256,
    )


def encrypt_bytes(plaintext: bytes, passphrase: str) -> EncryptedPayload:
    """
    Encrypt arbitrary bytes using AES-256-CBC with a passphrase.

    Generates a fresh random salt and IV every call — never reuses them.

    Args:
        plaintext: The data to encrypt (e.g., a serialized secret image).
        passphrase: The user's secret passphrase.

    Returns:
        EncryptedPayload containing salt, IV, and ciphertext.
    """
    if not plaintext:
        raise ValueError("Plaintext cannot be empty")

    salt = get_random_bytes(SALT_SIZE)
    iv = get_random_bytes(IV_SIZE)
    key = derive_key(passphrase, salt)

    cipher = AES.new(key, AES.MODE_CBC, iv)

    # PKCS7 padding so the data is a multiple of AES_BLOCK_SIZE
    padded = pad(plaintext, AES_BLOCK_SIZE)
    ciphertext = cipher.encrypt(padded)

    return EncryptedPayload(salt=salt, iv=iv, ciphertext=ciphertext)


def decrypt_bytes(payload: EncryptedPayload, passphrase: str) -> bytes:
    """
    Decrypt an EncryptedPayload back to its original bytes.

    Args:
        payload: The EncryptedPayload produced by encrypt_bytes.
        passphrase: The same passphrase used during encryption.

    Returns:
        The original plaintext bytes.

    Raises:
        ValueError: if the passphrase is wrong or the data is corrupted.
    """
    if not passphrase:
        raise ValueError("Passphrase cannot be empty")

    key = derive_key(passphrase, payload.salt)
    cipher = AES.new(key, AES.MODE_CBC, payload.iv)

    try:
        padded = cipher.decrypt(payload.ciphertext)
        plaintext = unpad(padded, AES_BLOCK_SIZE)
    except ValueError as e:
        # PKCS7 unpadding will fail if the passphrase is wrong
        raise ValueError(
            "Decryption failed — incorrect passphrase or corrupted data"
        ) from e

    return plaintext


def compute_sha256(data: bytes) -> str:
    """
    Compute the SHA-256 hash of arbitrary bytes.

    Used to verify the integrity of the recovered secret image
    after the full stego + decrypt round-trip.

    Returns:
        Hex-encoded SHA-256 digest (64 characters).
    """
    h = SHA256.new()
    h.update(data)
    return h.hexdigest()