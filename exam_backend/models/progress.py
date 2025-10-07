from pydantic import BaseModel
from typing import Optional

class Progress(BaseModel):
    user_id: str
    exam_name: str
    topic: str
    status: str  # e.g., "completed", "pending", "weak"
