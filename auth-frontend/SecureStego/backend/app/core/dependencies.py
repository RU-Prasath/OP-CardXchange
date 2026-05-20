"""Reusable FastAPI dependencies for routes."""
from typing import Annotated

# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, Header, status
# pyrefly: ignore [missing-import]
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import decode_access_token
from app.db.mongo import get_database
from app.services.user_service import find_user_by_id


# Type alias — every route that needs the database uses this
DatabaseDep = Annotated[AsyncIOMotorDatabase, Depends(get_database)]


async def get_current_user(
    db: DatabaseDep,
    authorization: str | None = Header(default=None),
) -> dict:
    """
    Extract the JWT from the Authorization header, validate it,
    and load the user from the database.

    Raises 401 if anything fails.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized — no token provided",
        )

    token = authorization.split(" ", 1)[1].strip()
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized — token invalid or expired",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized — invalid token payload",
        )

    user = await find_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authorized — user no longer exists",
        )

    return user


# Type alias for protected routes
CurrentUser = Annotated[dict, Depends(get_current_user)]