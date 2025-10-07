from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

# ==============================
# 🧠 User Model for MongoDB
# ==============================
class User(BaseModel):
    user_id: str = Field(..., description="Unique user ID")
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password_hash: str = Field(..., description="Hashed password, never store plain text")

    exams_enrolled: Optional[List[str]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    progress_score: Optional[float] = 0.0
    role: Optional[str] = "student"  # can be 'student', 'admin', etc.

    class Config:
        schema_extra = {
            "example": {
                "user_id": "user_12345",
                "name": "Soumyadeep",
                "email": "soumyadeep@example.com",
                "password_hash": "hashed_password_here",
                "exams_enrolled": ["GATE CSE", "GRE"],
                "created_at": "2025-10-06T12:30:00Z",
                "last_login": "2025-10-06T13:00:00Z",
                "progress_score": 82.5,
                "role": "student"
            }
        }
