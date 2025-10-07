from fastapi import APIRouter, Body
from services.groq_service import ask_groq
from database import db
from models.mock_test import MockTestResult

router = APIRouter()
mock_results_collection = db["mock_results"]
questions_collection = db["questions"]

@router.post("/generate/{exam_name}")
def generate_mock_test(exam_name: str, topics: list[str] = Body(...)):
    """
    Create a mock test by combining questions from given topics.
    If not enough stored, AI will generate new ones.
    """
    questions = []
    for topic in topics:
        stored = list(questions_collection.find({"exam_name": exam_name, "topic": topic}, {"_id": 0}).limit(3))
        if stored:
            questions.extend(stored)
        else:
            prompt = f"Generate 3 medium-difficulty multiple-choice questions for '{topic}' from {exam_name}. Include answers."
            ai_response = ask_groq(prompt)
            import json
            try:
                new_qs = json.loads(ai_response)
                for q in new_qs:
                    q_doc = {
                        "exam_name": exam_name,
                        "topic": topic,
                        "question_text": q.get("question_text", ""),
                        "options": q.get("options", []),
                        "answer": q.get("answer", ""),
                        "difficulty": "medium"
                    }
                    questions_collection.insert_one(q_doc)
                    questions.append(q_doc)
            except:
                continue

    return {"exam": exam_name, "questions": questions}

@router.post("/submit")
def submit_mock_test(result: MockTestResult):
    """
    Submit a mock test result, calculate feedback, and store it.
    """
    percentage = round((result.score / result.total) * 100, 2)
    feedback_prompt = f"""
    The student took a mock test for {result.exam_name}.
    Score: {result.score}/{result.total} ({percentage}%)
    Weak topics: {', '.join(result.weak_topics)}.
    Write a short motivational feedback and suggest next 3 focus areas.
    """
    feedback = ask_groq(feedback_prompt)
    result_doc = result.dict()
    result_doc["feedback"] = feedback
    mock_results_collection.insert_one(result_doc)
    return {"message": "Result saved successfully", "feedback": feedback}
