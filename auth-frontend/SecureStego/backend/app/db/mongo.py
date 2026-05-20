# pyrefly: ignore [missing-import]
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

class MongoDB:
    """Singleton wrapper for MongoDB client and database."""

    client: AsyncIOMotorClient = None
    database: AsyncIOMotorDatabase = None

mongodb = MongoDB()

async def connect_to_mongo() -> None:
    """Open MongoDB connection on app startup."""
    mongodb.client = AsyncIOMotorClient(settings.MONGO_URI)
    mongodb.database = mongodb.client[settings.DB_NAME]

    # Verify the connection actually works
    try:
        await mongodb.client.admin.command("ping")
        print(f"MongoDB Connected: {settings.MONGO_URI}")
        print(f"Database: {settings.DB_NAME}")
    except Exception as e:
        print(f"MongoDB Connection Error: {e}")
        raise

async def close_mongo_connection() -> None:
    """Close MongoDB connection on app shutdown."""
    if mongodb.client is not None:
        mongodb.client.close()
        print("MongoDB connection closed")

def get_database() -> AsyncIOMotorDatabase:
    """Dependency injection helper to retrieve the database in routes."""
    return mongodb.database