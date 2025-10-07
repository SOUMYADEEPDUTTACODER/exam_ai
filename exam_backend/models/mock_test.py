from pydantic import BaseModel
from typing import List, Dict, Optional

class MockTestResult(BaseModel):
    user_id: str
    exam_name: str
    score: int
    total: int
    weak_topics: List[str]
