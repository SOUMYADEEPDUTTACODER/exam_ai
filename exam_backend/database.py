from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
syllabus_collection = db["syllabus"]
progress_collection = db["progress"]
users_collection = db["users"]

# ✅ New collections for extended features
questions_collection = db["questions"]        # Stores AI-generated practice questions
mock_results_collection = db["mock_results"]  # Stores mock test submissions and feedback
conversation_collection = db["conversations"] # (Optional) for storing agent chat history
