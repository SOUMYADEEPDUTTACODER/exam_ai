from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.exams import router as exams_router
from routes.study import router as study_router
from routes.mock import router as mock_router
from routes.progress import router as progress_router


app = FastAPI(title="Exam Backend", version="0.1.0")

# Basic CORS (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Exam backend is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


# Mount API routers with prefixes
app.include_router(exams_router, prefix="/exams", tags=["exams"])  # syllabus endpoints
app.include_router(study_router, prefix="/study", tags=["study"])  # roadmap, topic, questions
app.include_router(mock_router, prefix="/mock", tags=["mock"])    # generate/submit mock tests
app.include_router(progress_router, prefix="/progress", tags=["progress"])  # progress updates


