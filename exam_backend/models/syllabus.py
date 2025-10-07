from pydantic import BaseModel
from typing import Optional

class Syllabus(BaseModel):
    exam_name: str
    syllabus_text: str
