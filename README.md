# 🧠 Exam AI Assistant (FastAPI + React + Groq API)

An intelligent, cloud-ready exam preparation assistant that helps students prepare for competitive exams like **GATE**, **UPSC**, and **GRE** by dynamically generating **syllabus**, **study roadmaps**, **topic explanations**, and **mock tests** using **Groq’s LLMs** and a **FastAPI backend**.

---

## 🚀 Features

### 🎓 Exam Intelligence
- Get syllabus dynamically for any supported exam.
- Personalized topic-wise **study roadmap**.
- AI-generated **topic explanations** and **practice questions** using Groq API.
- **Mock test generation** and submission support.
- User progress tracking with MongoDB.

### 🖥️ Frontend (React + Vite + TailwindCSS)
- Clean and responsive UI built with Tailwind CSS.
- Fetches real-time content from backend via REST API.
- Deployed on **Vercel** for global scalability.

### ⚙️ Backend (FastAPI)
- RESTful API structure with modular routers:
  - `/exams/syllabus`
  - `/study/roadmap`
  - `/study/questions`
  - `/mock/generate`
  - `/progress/update`
- Integrated with **Groq API** for AI-generated responses.
- MongoDB for user data and progress tracking.
- Health check and OpenAPI documentation (`/docs`).

---

## 🧩 Architecture Overview

```bash
exam/
 ├── exam_backend/
 │    ├── main.py
 │    ├── routes/
 │    │    ├── exams.py
 │    │    ├── study.py
 │    │    ├── mock.py
 │    │    └── progress.py
 │    ├── groq_service.py
 │    ├── config.py
 │    ├── requirements.txt
 │    └── .env
 │
 └── exam_frontend/
      ├── src/
      │    ├── components/
      │    ├── pages/
      │    └── App.jsx
      ├── package.json
      ├── vite.config.js
      ├── tailwind.config.js
      └── .env

Create a .env file in exam_backend/
GROQ_API_KEY=your_groq_api_key_here
MONGO_URI=your_mongodb_connection_string
DB_NAME=exam_ai_db

2️⃣ Install dependencies
cd exam_backend
pip install -r requirements.txt

3️⃣ Run the backend server
uvicorn main:app --reload


🌐 Visit http://127.0.0.1:8000/docs for interactive API documentation.

🎨 Frontend Setup (React + Vite + Tailwind)
1️⃣ Navigate to frontend folder
cd exam_frontend

2️⃣ Install dependencies
npm install

3️⃣ Add a .env file
VITE_API_BASE_URL=http://127.0.0.1:8000

4️⃣ Run the frontend
npm run dev

License

This project is licensed under the MIT License — you’re free to use, modify, and distribute with attribution.