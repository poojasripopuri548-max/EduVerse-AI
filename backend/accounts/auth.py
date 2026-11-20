import datetime
from functools import wraps
import jwt
from bson import ObjectId
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response

from config.mongodb import db


def generate_access_token(student, expiry_days=7):
    """
    Generate a signed JWT token for an authenticated student.
    """
    student_id = str(student.get("_id", ""))
    payload = {
        "student_id": student_id,
        "email": student.get("email", ""),
        "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=expiry_days),
        "iat": datetime.datetime.now(datetime.timezone.utc),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


def decode_access_token(token):
    """
    Decode and validate a JWT access token.
    Returns the payload dictionary or raises an exception.
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])


def get_authenticated_student(request):
    """
    Extract and verify student from Authorization header.
    Returns (student, error_message, status_code).
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header:
        return None, "Authorization header is missing.", status.HTTP_401_UNAUTHORIZED

    parts = auth_header.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None, "Invalid Authorization header format. Expected 'Bearer <token>'.", status.HTTP_401_UNAUTHORIZED

    token = parts[1]

    try:
        payload = decode_access_token(token)
    except jwt.ExpiredSignatureError:
        return None, "Token has expired. Please log in again.", status.HTTP_401_UNAUTHORIZED
    except jwt.InvalidTokenError:
        return None, "Invalid token provided.", status.HTTP_401_UNAUTHORIZED

    email = payload.get("email")
    student_id = payload.get("student_id")

    student = None
    if student_id and ObjectId.is_valid(student_id):
        student = db.students.find_one({"_id": ObjectId(student_id)})
    if not student and email:
        student = db.students.find_one({"email": email.lower()})

    if not student:
        return None, "Student account not found.", status.HTTP_401_UNAUTHORIZED

    return student, None, None


def jwt_authenticated(view_func):
    """
    Decorator for API views requiring JWT authentication.
    Injects request.student into the view.
    """
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        student, error, status_code = get_authenticated_student(request)
        if error:
            return Response({"error": error}, status=status_code)
        request.student = student
        return view_func(request, *args, **kwargs)

    return wrapped_view
