"""Security utilities - password hashing and JWT operations."""
from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import jwt, JWTError
# pyrefly: ignore [missing-import]
from passlib.context import CryptContext

from app.core.config import settings

# Configure bcrypt for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password: str) -> str:
    """Hash a plain-text password using bcrypt with cost factor 10."""
    return pwd_context.hash(plain_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a stored bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(subject: str, expires_minutes: Optional[int] = None) -> str:
    """
    Create a JWT access token for the given subject (user id).
    
    The token includes:
        - sub: the user id
        - iat: issued at timestamp
        - exp: expiry timestamp
    """
    expire_minutes = expires_minutes or settings.JWT_EXPIRE_MINUTES
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=expire_minutes)
    
    payload = {
        "sub": str(subject),
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT token.
    Returns the payload if valid, None if invalid or expired.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None