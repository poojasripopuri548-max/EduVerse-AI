from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from config.ai_client import review_code_snippet
from accounts.auth import get_authenticated_student
from config.mongodb import db


@api_view(["POST"])
def review_code(request):
    """
    AI Code Reviewer endpoint.
    Accepts source code and language, returns comprehensive review.
    """
    code = request.data.get("code", "").strip()
    language = request.data.get("language", "python").strip()

    if not code:
        return Response(
            {"error": "Code snippet cannot be empty."},
            status=status.HTTP_400_BAD_REQUEST
        )

    review = review_code_snippet(code=code, language=language)

    student, _, _ = get_authenticated_student(request)
    if student:
        try:
            db.code_reviews.insert_one({
                "student_id": student["_id"],
                "student_email": student["email"],
                "code": code,
                "language": language,
                "review": review,
                "timestamp": timezone.now().isoformat()
            })
        except Exception:
            pass

    return Response(
        {
            "review": review,
            "language": language,
            "timestamp": timezone.now().isoformat()
        },
        status=status.HTTP_200_OK
    )
