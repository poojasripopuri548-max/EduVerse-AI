import os
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

PROJECT_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(PROJECT_ROOT / "ai" / ".env")

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("Groq API key missing. Check ai/.env")

client = Groq(api_key=api_key)


def generate_response(prompt, history=None):

    messages = [
        {
            "role": "system",
            "content": (
                "You are EduVerse AI, a friendly educational assistant. "
                "Explain concepts simply with examples. "
                "Help students learn step by step."
            )
        }
    ]

    if history:
        messages.extend(history)

    messages.append({
        "role": "user",
        "content": prompt
    })

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=messages,
        temperature=0.7,
        max_tokens=1000
    )

    return response.choices[0].message.content