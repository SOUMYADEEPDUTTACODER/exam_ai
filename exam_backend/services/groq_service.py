import os
import requests
from config import GROQ_API_KEY
from fastapi import HTTPException

BASE_URL = "https://api.groq.com/openai/v1"
DEFAULT_GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-8b-8192")

def ask_groq(prompt: str, model: str | None = None, temperature: float = 0.7):
    """
    Sends a prompt to Groq API and returns the generated content.
    """
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    selected_model = model or DEFAULT_GROQ_MODEL
    data = {
        "model": selected_model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature
    }

    try:
        response = requests.post(f"{BASE_URL}/chat/completions", headers=headers, json=data)
        response.raise_for_status()
        result = response.json()

        # Safely get generated content
        choices = result.get("choices")
        if not choices or not isinstance(choices, list):
            raise HTTPException(status_code=500, detail="Invalid response from Groq API")

        message_content = choices[0].get("message", {}).get("content")
        if message_content is None:
            raise HTTPException(status_code=500, detail="No content returned from Groq API")

        return message_content

    except requests.exceptions.HTTPError as e:
        # For example: 401 Unauthorized or other HTTP errors
        raise HTTPException(status_code=e.response.status_code, detail=f"Groq API error: {e.response.text}")
    except requests.exceptions.RequestException as e:
        # Network / connection errors
        raise HTTPException(status_code=500, detail=f"Groq request failed: {str(e)}")
