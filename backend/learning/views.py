from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from config.ai_client import generate_ai_text
from accounts.auth import get_authenticated_student
from config.mongodb import db


@api_view(["POST"])
def learning_chat(request):
    """
    Learning Companion AI Chat endpoint.
    Accepts question and optional conversation history.
    """
    question = request.data.get("question", "").strip()
    history = request.data.get("history", [])

    if not question:
        return Response(
            {"error": "Question field is required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    answer = generate_ai_text(prompt=question, history=history)

    # If student is logged in, record the chat session into MongoDB
    student, _, _ = get_authenticated_student(request)
    if student:
        try:
            db.learning_history.insert_one({
                "student_id": student["_id"],
                "student_email": student["email"],
                "question": question,
                "answer": answer,
                "timestamp": timezone.now().isoformat()
            })
        except Exception:
            pass

    return Response(
        {
            "answer": answer,
            "timestamp": timezone.now().isoformat()
        },
        status=status.HTTP_200_OK
    )
