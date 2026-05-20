"""User-related database operations."""
from datetime import datetime, timezone
from typing import Optional

# pyrefly: ignore [missing-import]
from bson import ObjectId
# pyrefly: ignore [missing-import]
from bson.errors import InvalidId
# pyrefly: ignore [missing-import]
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import hash_password

def _user_collection(db: AsyncIOMotorDatabase):
    """Helper to access the users collection."""
    return db["users"]

async def find_user_by_email(db: AsyncIOMotorDatabase, email: str) -> Optional[dict]:
    """Find a user by email (case-insensitive)."""
    return await _user_collection(db).find_one({"email": email.lower().strip()})

async def find_user_by_id(db: AsyncIOMotorDatabase, user_id: str) -> Optional[dict]:
    """Find a user by their MongoDB ObjectId."""
    try:
        obj_id = ObjectId(user_id)
    except (InvalidId, TypeError):
        return None
    return await _user_collection(db).find_one({"_id": obj_id})

async def create_user(
    db: AsyncIOMotorDatabase,
    name: str,
    email: str,
    password: str,
) -> dict:
    """Create a new user with a bcrypt-hashed password.
    Returns the newly-created user document.
    """
    now = datetime.now(timezone.utc)

    new_user = {
        "name": name.strip(),
        "email": email.lower().strip(),
        "password": hash_password(password),
        "created_at": now,
        "updated_at": now,
    }

    result = await _user_collection(db).insert_one(new_user)
    new_user["_id"] = result.inserted_id
    return new_user

def serialize_user(user_doc: dict) -> dict:
    """
    Convert a MongoDB user document into a JSON-friendly dict.
    Strips the password hash and converts ObjectId to string.
    """
    return {
        "_id": str(user_doc["_id"]),
        "name": user_doc["name"],
        "email": user_doc["email"],
        "created_at": user_doc["created_at"],
    }