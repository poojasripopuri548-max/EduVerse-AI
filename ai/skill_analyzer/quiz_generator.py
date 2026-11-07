
import json
import re
from ai.common.llm_client import generate_response


def generate_quiz(topic, number_of_questions=5):

    prompt = f"""
    Create {number_of_questions} multiple-choice questions
    about {topic} for beginner students.

    Return ONLY valid JSON in this format:
    {{
        "questions": [
            {{
                "question": "What is Python?",
                "options": {{
                    "A": "Programming language",
                    "B": "Operating system",
                    "C": "Database",
                    "D": "Browser"
                }},
                "answer": "A",
                "explanation": "Python is a programming language."
            }}
        ]
    }}
    """

    response = generate_response(prompt)

    match = re.search(r"\{.*\}", response, re.DOTALL)

    if not match:
        raise ValueError("Invalid JSON response from AI")

    data = json.loads(match.group())

    return data["questions"]


def start_quiz():

    topic = input("Enter quiz topic: ")

    questions = generate_quiz(topic)

    score = 0

    for i, q in enumerate(questions, 1):

        print(f"\nQuestion {i}: {q['question']}")

        for key, value in q["options"].items():
            print(f"{key}. {value}")

        answer = input("Your answer (A/B/C/D): ").strip().upper()

        if answer == q["answer"]:
            print("Correct!")
            score += 1
        else:
            print("Wrong! Correct answer:", q["answer"])

        print("Explanation:", q["explanation"])

    print(f"\nFinal Score: {score}/{len(questions)}")


if __name__ == "__main__":
    start_quiz()
