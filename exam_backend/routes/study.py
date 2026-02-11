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
def generate_questions(exam_name: str, topic: str, count: int = 5):
    # Check MongoDB cache first (limit to count)
    existing = list(questions_collection.find({"exam_name": exam_name, "topic": topic}, {"_id": 0}).limit(count))
    if len(existing) >= count:
        return {"exam": exam_name, "topic": topic, "questions": existing}

    needed = count - len(existing)
    
    prompt = f"""
    Generate {needed} medium-difficulty multiple-choice questions for the topic '{topic}' 
    from the {exam_name} syllabus. 
    Return STRICTLY a valid JSON array of objects. No markdown, no intro text.
    Each object must have these keys: "question_text", "options" (list of 4 strings), "answer" (string).
    """

    try:
        ai_response = ask_groq(prompt)
        
        # Robust parsing logic
        import json
        params_json = ai_response
        if "```json" in params_json:
            params_json = params_json.split("```json")[1].split("```")[0].strip()
        elif "```" in params_json:
            params_json = params_json.split("```")[1].split("```")[0].strip()
            
        new_qs = json.loads(params_json)
        
        entered_questions = []
        if isinstance(new_qs, list):
            for q in new_qs:
                # Ensure options is a list
                options = q.get("options", [])
                if isinstance(options, str):
                    try:
                        options = json.loads(options.replace("'", '"'))
                    except:
                        options = []
                
                if not isinstance(options, list):
                    options = []

                q_doc = {
                    "exam_name": exam_name,
                    "topic": topic,
                    "question_text": q.get("question_text", "Unknown Question"),
                    "options": [str(o) for o in options], 
                    "answer": q.get("answer", ""),
                    "difficulty": "medium"
                }
                questions_collection.insert_one(q_doc)
                q_doc.pop("_id", None)
                entered_questions.append(q_doc)
        
        # Combine existing and new
        final_questions = existing + entered_questions
        return {"exam": exam_name, "topic": topic, "questions": final_questions}

    except Exception as e:
        print(f"Error generating questions: {e}")
        # Fallback to existing if any
        return {"exam": exam_name, "topic": topic, "questions": existing}
