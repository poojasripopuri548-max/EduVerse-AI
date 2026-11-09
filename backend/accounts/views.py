
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from pymongo.errors import DuplicateKeyError
from django.contrib.auth.hashers import check_password

from .serializers import StudentRegistrationSerializer, StudentLoginSerializer
from config.mongodb import db


@api_view(["POST"])
def register_student(request):

    serializer = StudentRegistrationSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    data = serializer.validated_data

    # Check whether the email already exists
    existing_student = db.students.find_one({
        "email": data["email"].lower()
    })

    if existing_student:
        return Response(
            {"error": "Email already registered."},
            status=status.HTTP_409_CONFLICT
        )

    # Prepare student record
    student = {
        "full_name": data["full_name"],
        "email": data["email"].lower(),
        "password": make_password(data["password"]),
        "college_name": data["college_name"],
        "department": data["department"],
        "year_of_study": data["year_of_study"],
        "career_goal": data["career_goal"],
        "created_at": timezone.now().isoformat()
    }

    # Save student in MongoDB
    try:
        db.students.insert_one(student)

    except DuplicateKeyError:
        return Response(
            {"error": "Email already registered."},
            status=status.HTTP_409_CONFLICT
        )

    return Response(
        {"message": "Student registered successfully!"},
        status=status.HTTP_201_CREATED
    )
@api_view(["POST"])
def login_student(request):

    serializer = StudentLoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    email = serializer.validated_data["email"].lower()
    password = serializer.validated_data["password"]

    # Find student in MongoDB
    student = db.students.find_one({"email": email})

    if not student:
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Verify password
    if not check_password(password, student["password"]):
        return Response(
            {"error": "Invalid email or password."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(
        {
            "message": "Login successful!",
            "student": {
                "full_name": student["full_name"],
                "email": student["email"],
                "college_name": student["college_name"],
                "department": student["department"],
                "year_of_study": student["year_of_study"],
                "career_goal": student["career_goal"]
            }
        },
        status=status.HTTP_200_OK
    )
