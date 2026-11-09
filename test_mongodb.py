import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")

if not uri:
    print("MongoDB URI not found. Check your .env file.")
else:
    try:
        client = MongoClient(
            uri,
            serverSelectionTimeoutMS=10000
        )

        client.admin.command("ping")

        print("MongoDB connected successfully!")

        db = client["eduverse"]
        print("Database selected:", db.name)

        client.close()

    except Exception as error:
        print("Connection failed:", error)