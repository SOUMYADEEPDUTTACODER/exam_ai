from fastapi import APIRouter, Body
from services.groq_service import ask_groq
from database import db
from models.mock_test import MockTestResult
from pydantic import BaseModel

router = APIRouter()
mock_results_collection = db["mock_results"]
questions_collection = db["questions"]

class GenerateRequest(BaseModel):
    topics: list[str]
    count: int = 3

@router.post("/generate/{exam_name}")
def generate_mock_test(exam_name: str, req: GenerateRequest):
    """
    Create a mock test by combining questions from given topics.
    If not enough stored, AI will generate new ones.
    """
    questions = []
    
    # Calculate questions per topic
    count_per_topic = max(1, req.count // len(req.topics))
    
    for topic in req.topics:
        # Check if we have enough stored questions
        stored = list(questions_collection.find({"exam_name": exam_name, "topic": topic}, {"_id": 0}).limit(count_per_topic))
        
        # If we have some stored, use them
        if stored:
            questions.extend(stored)
            
        # If we need more, generate them
        needed = count_per_topic - len(stored)
        if needed > 0:
            questions_to_generate = max(2, needed) # generate at least 2 to ensure we have enough
            prompt = f"""
            Generate {questions_to_generate} medium-difficulty multiple-choice questions for '{topic}' from {exam_name}.
            Return STRICTLY a valid JSON array of objects. No markdown, no intro text.
            Each object must have these keys: "question_text", "options" (list of 4 strings), "answer" (string, must be one of the options).
            """
            
            try:
                ai_response = ask_groq(prompt)
                
                import json
                
                # Clean up response if it contains markdown code blocks
                params_json = ai_response
                if "```json" in params_json:
                    params_json = params_json.split("```json")[1].split("```")[0].strip()
                elif "```" in params_json:
                    params_json = params_json.split("```")[1].split("```")[0].strip()
                
                new_qs = json.loads(params_json)
                
                if isinstance(new_qs, list):
                    for q in new_qs:
                        # Ensure options is a list
                        options = q.get("options", [])
                        if isinstance(options, str):
                            try:
                                # Try to parse if it's a stringified list
                                options = json.loads(options.replace("'", '"'))
                            except:
                                options = []
                        
                        if not isinstance(options, list):
                            options = []

                        q_doc = {
                            "exam_name": exam_name,
                            "topic": topic,
                            "question_text": q.get("question_text", "Unknown Question"),
                            "options": [str(o) for o in options], # Ensure all options are strings
                            "answer": q.get("answer", ""),
                            "difficulty": "medium"
                        }
                        # Save to DB for future caching
                        questions_collection.insert_one(q_doc)
                        # Remove _id for response
                        q_doc.pop("_id", None)
                        questions.append(q_doc)
            except Exception as e:
                print(f"Error parsing AI response for {topic}: {e}")
                continue

    # Limit to requested total count just in case
    return {"exam": exam_name, "questions": questions[:req.count]}

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
