
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing from .env file")

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=10000
)

db = client["eduverse"]


def check_mongodb_connection():
    try:
        client.admin.command("ping")
        print("MongoDB is connected to Django backend!")
        return True

    except Exception as error:
        print("MongoDB connection error:", error)
        return False
