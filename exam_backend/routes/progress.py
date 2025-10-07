from fastapi import APIRouter, Body
from database import progress_collection
from models.progress import Progress

router = APIRouter()

@router.post("/update")
def update_progress(progress: Progress):
    progress_collection.update_one(
        {"user_id": progress.user_id, "topic": progress.topic},
        {"$set": progress.dict()},
        upsert=True
    )
    return {"message": "Progress updated successfully", "data": progress.dict()}

@router.get("/user/{user_id}")
def get_user_progress(user_id: str):
    data = list(progress_collection.find({"user_id": user_id}, {"_id": 0}))
    return {"user_id": user_id, "progress": data}
