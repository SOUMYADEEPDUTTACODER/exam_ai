import os
import sys
import json
import requests
from dotenv import load_dotenv

def main() -> int:
    # Load .env from current directory
    load_dotenv()

    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        print("ERROR: GROQ_API_KEY is not set (missing in environment or .env).", file=sys.stderr)
        return 2

    print(f"HAS_KEY: {bool(groq_key)}")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {groq_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "mixtral-8x7b-32768",
        "messages": [{"role": "user", "content": "ping"}],
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"STATUS: {resp.status_code}")
        if resp.ok:
            data = resp.json()
            # Print first 300 chars of the reply content
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            print("REPLY:", content[:300].replace("\n", " "))
            return 0
        else:
            # Print server error body for debugging
            print("BODY:", resp.text[:500].replace("\n", " "))
            return 1
    except Exception as e:
        print(f"REQUEST_ERROR: {e}", file=sys.stderr)
        return 3

if __name__ == "__main__":
    sys.exit(main())