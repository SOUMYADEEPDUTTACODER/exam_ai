# Deployment Guide

Follow these steps to deploy your application.

## 1. Preparation

Ensure your project is pushed to a GitHub repository.

## 2. Deploy Backend (Render)

1.  Go to [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** -> **Web Service**.
3.  Connect your GitHub repository.
4.  Select the repository and authorize.
5.  **Configure Service:**
    *   **Name:** `exam-backend` (or similar)
    *   **Root Directory:** `exam_backend` (Important: Set this to the backend folder)
    *   **Runtime:** `Python 3`
    *   **Build Command:** `pip install -r requirements.txt`
    *   **Start Command:** `uvicorn main:app --host 0.0.0.0 --port 10000`
6.  **Environment Variables:**
    *   Scroll down to "Environment Variables" and add:
        *   `MONGO_URI`: (Your MongoDB connection string)
        *   `GROQ_API_KEY`: (Your Groq API Key)
        *   `DB_NAME`: (Your Database Name, e.g., `exam_db`)
7.  Click **Create Web Service**.
8.  Wait for the deployment to finish. Copy the **Service URL** (e.g., `https://exam-backend.onrender.com`).

## 3. Deploy Frontend (Vercel)

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project:**
    *   **Framework Preset:** Vite (should be auto-detected).
    *   **Root Directory:** Click "Edit" and select `exam_frontend`.
5.  **Environment Variables:**
    *   Expand "Environment Variables".
    *   Add:
        *   `VITE_API_BASE_URL`: Paste the **Backend Service URL** you got from Render (remove any trailing slash).
        *   Example: `https://exam-backend.onrender.com`
6.  Click **Deploy**.
7.  Wait for the build to complete.

## 4. Final Check

1.  Open your Vercel deployment URL.
2.  Try generating a Mock Test or Questions.
3.  If it fails, check the "Console" in browser DevTools (F12) for CORS errors.
    *   *Note:* The backend allows all origins (`*`) by default, so it should work smoothly.

---
**Troubleshooting:**
*   **CORS Error:** If you see CORS errors, ensure `VITE_API_BASE_URL` matches your backend URL exactly (https vs http).
*   **404 on Refresh:** If refreshing a page gives a 404 error on Vercel, ensure `vercel.json` is present in `exam_frontend` with the rewrite rules (I have added this file for you).
