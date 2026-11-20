import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

_client = None


def get_groq_client():
    global _client
    if _client is not None:
        return _client

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None

    try:
        from groq import Groq
        _client = Groq(api_key=api_key)
        return _client
    except Exception:
        return None


def generate_ai_text(prompt, system_prompt=None, history=None, model="llama-3.3-70b-versatile", max_tokens=1200):
    """
    Generate text using Groq LLM with graceful fallback.
    """
    client = get_groq_client()

    if client:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        else:
            messages.append({
                "role": "system",
                "content": (
                    "You are EduVerse AI, an intelligent, friendly educational mentor. "
                    "Explain concepts step-by-step with clear examples in beginner-friendly language."
                )
            })

        if history:
            messages.extend(history)

        messages.append({"role": "user", "content": prompt})

        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as error:
            # If rate limit or model not found on Groq, try fallback model or fallback text
            try:
                fallback_response = client.chat.completions.create(
                    model="llama3-8b-8192",
                    messages=messages,
                    temperature=0.7,
                    max_tokens=max_tokens
                )
                return fallback_response.choices[0].message.content
            except Exception:
                pass

    # Educational offline fallback responses
    return get_offline_fallback(prompt)


def get_offline_fallback(prompt):
    p = prompt.lower()
    if "machine learning" in p or "ml" in p:
        return (
            "Machine Learning is a subset of Artificial Intelligence that enables computers to learn patterns from data.\n\n"
            "Key Types:\n"
            "1. Supervised Learning: Learning with labeled data (e.g. Linear Regression, Classification).\n"
            "2. Unsupervised Learning: Discovering hidden patterns in unlabeled data (e.g. Clustering, PCA).\n"
            "3. Reinforcement Learning: Learning through rewards and penalties (e.g. Game-playing agents)."
        )
    elif "neural network" in p or "deep learning" in p:
        return (
            "A Neural Network is a computational architecture inspired by the human brain.\n\n"
            "Core Layers:\n"
            "1. Input Layer: Accepts raw features.\n"
            "2. Hidden Layers: Extracts representations and patterns through weighted activations.\n"
            "3. Output Layer: Produces classification or regression predictions."
        )
    elif "python" in p or "oop" in p:
        return (
            "Object-Oriented Programming (OOP) in Python structures code into reusable classes and objects.\n\n"
            "The 4 Pillars:\n"
            "1. Encapsulation: Bundling data and methods together.\n"
            "2. Inheritance: Deriving new classes from existing ones.\n"
            "3. Polymorphism: Different classes implementing methods with the same name.\n"
            "4. Abstraction: Hiding internal complexity behind simple interfaces."
        )
    else:
        return (
            f"EduVerse AI Assistant: Here is an educational overview regarding '{prompt[:60]}...':\n\n"
            "To excel in this domain, break your study into fundamental theory, hands-on coding exercises, "
            "and real-world mini-projects. (Add your GROQ_API_KEY in .env for live multi-turn AI responses!)"
        )


def review_code_snippet(code, language="python"):
    system_prompt = (
        "You are EduVerse AI, an expert programming tutor and code reviewer. "
        "Review the student's code and provide: "
        "1. Overview & Code Quality "
        "2. Syntax & Logical Issues "
        "3. Time & Space Complexity "
        "4. Security Considerations "
        "5. Improved Clean Code "
        "Keep the explanation supportive and beginner-friendly."
    )
    prompt = f"Please review this {language} code:\n\n```{language}\n{code}\n```"
    return generate_ai_text(prompt, system_prompt=system_prompt)
