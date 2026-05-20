"""Operation history storage — tracks every hide/reveal action per user."""
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


def _history_collection(db: AsyncIOMotorDatabase):
    return db["history"]


async def record_operation(
    db: AsyncIOMotorDatabase,
    user_id: str,
    operation: str,
    success: bool,
    metadata: Optional[dict] = None,
) -> str:
    """
    Record a hide or reveal operation in the user's history.

    Args:
        operation: "HIDE" or "REVEAL"
        success: Whether the operation completed without error
        metadata: Optional dict of extra fields (sizes, quality, etc.)

    Returns:
        The ObjectId of the new history record as a string.
    """
    doc = {
        "user_id": user_id,
        "operation": operation,
        "success": success,
        "created_at": datetime.now(timezone.utc),
        **(metadata or {}),
    }

    result = await _history_collection(db).insert_one(doc)
    return str(result.inserted_id)


async def list_history(
    db: AsyncIOMotorDatabase,
    user_id: str,
    limit: int = 50,
) -> list[dict]:
    """Fetch the user's recent operations, newest first."""
    cursor = (
        _history_collection(db)
        .find({"user_id": user_id})
        .sort("created_at", -1)
        .limit(limit)
    )
    return await cursor.to_list(length=limit)


def serialize_history_entry(doc: dict) -> dict:
    """Convert a MongoDB history document into a JSON-friendly dict."""
    return {
        "_id": str(doc["_id"]),
        "user_id": doc["user_id"],
        "operation": doc["operation"],
        "cover_size": doc.get("cover_size"),
        "secret_size": doc.get("secret_size"),
        "payload_bytes": doc.get("payload_bytes"),
        "quality": doc.get("quality"),
        "secret_hash": doc.get("secret_hash"),
        "success": doc.get("success", False),
        "created_at": doc.get("created_at"),
    }