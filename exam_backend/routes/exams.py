from fastapi import APIRouter
from services.groq_service import ask_groq
from database import syllabus_collection
from models.syllabus import Syllabus

router = APIRouter()

@router.get("/syllabus/{exam_name}")
def get_syllabus(exam_name: str):
    existing = syllabus_collection.find_one({"exam_name": exam_name})
    if existing:
        return {"exam": exam_name, "syllabus": existing["syllabus_text"]}

    prompt = f"Provide the official syllabus for {exam_name} in a structured, readable format."
    syllabus = ask_groq(prompt)

    syllabus_collection.insert_one({"exam_name": exam_name, "syllabus_text": syllabus})
    return {"exam": exam_name, "syllabus": syllabus}
