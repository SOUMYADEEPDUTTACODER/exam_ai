from fastapi import APIRouter
from services.groq_service import ask_groq
from database import db

router = APIRouter()
questions_collection = db["questions"]

@router.get("/roadmap/{exam_name}")
def get_roadmap(exam_name: str, weeks: int = 12):
    prompt = f"Create a {weeks}-week detailed study roadmap for {exam_name}, organized week-by-week."
    roadmap = ask_groq(prompt)
    return {"exam": exam_name, "roadmap": roadmap}

@router.get("/topic/{exam_name}/{topic}")
def get_topic_details(exam_name: str, topic: str):
    prompt = f"Explain the topic '{topic}' from the {exam_name} syllabus in detail, including examples and references."
    details = ask_groq(prompt)
    return {"exam": exam_name, "topic": topic, "details": details}

# ✅ New: AI Question Generator
@router.get("/questions/{exam_name}/{topic}")
def generate_questions(exam_name: str, topic: str):
    # Check MongoDB cache first
    existing = list(questions_collection.find({"exam_name": exam_name, "topic": topic}, {"_id": 0}))
    if existing:
        return {"exam": exam_name, "topic": topic, "questions": existing}

    prompt = f"""
    Generate 5 medium-difficulty multiple-choice questions for the topic '{topic}' 
    from the {exam_name} syllabus. Format as JSON list with fields:
    question_text, options (list of 4), answer.
    """

    try:
        ai_response = ask_groq(prompt)
    except Exception as e:
        return {"error": str(e)}

    # You can try to safely parse the response
    import json
    try:
        questions = json.loads(ai_response)
    except:
        questions = [{"question_text": ai_response, "options": [], "answer": ""}]

    # Save in DB
    for q in questions:
        q_doc = {
            "exam_name": exam_name,
            "topic": topic,
            "question_text": q.get("question_text", ""),
            "options": q.get("options", []),
            "answer": q.get("answer", ""),
            "difficulty": "medium"
        }
        questions_collection.insert_one(q_doc)

    return {"exam": exam_name, "topic": topic, "questions": questions}
