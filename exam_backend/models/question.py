from pydantic import BaseModel
from typing import List, Dict, Optional

class Question(BaseModel):
    exam_name: str
    topic: str
    question_text: str
    options: List[str]
    answer: str
    difficulty: str = "medium"
