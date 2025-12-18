from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    
database = Database()

async def get_database():
    """Get database instance."""
    return database.client.ninja_builder

async def connect_to_mongo():
    """Create database connection."""
    database.client = AsyncIOMotorClient(settings.DATABASE_URL)
    print("Connected to MongoDB")

async def close_mongo_connection():
    """Close database connection."""
    if database.client:
        database.client.close()
        print("Closed MongoDB connection")
