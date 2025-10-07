import os
from dotenv import load_dotenv

# Force-load .env located next to this file, overriding any existing env vars
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=ENV_PATH, override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "exam_db")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
print("Loaded GROQ_API_KEY:", GROQ_API_KEY)
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found! Ensure exam_backend/.env has GROQ_API_KEY set.")