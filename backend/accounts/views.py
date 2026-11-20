from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from pymongo.errors import DuplicateKeyError

from .serializers import (
    StudentRegistrationSerializer,
    StudentLoginSerializer,
    StudentProfileUpdateSerializer,
)
from .auth import generate_access_token, jwt_authenticated
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
        result = db.students.insert_one(student)
        student["_id"] = result.inserted_id
    except DuplicateKeyError:
        return Response(
            {"error": "Email already registered."},
            status=status.HTTP_409_CONFLICT
        )

    token = generate_access_token(student)

    return Response(
        {
            "message": "Student registered successfully!",
            "token": token,
            "student": {
                "id": str(student["_id"]),
                "full_name": student["full_name"],
                "email": student["email"],
                "college_name": student["college_name"],
                "department": student["department"],
                "year_of_study": student["year_of_study"],
                "career_goal": student["career_goal"]
            }
        },
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

    token = generate_access_token(student)

    return Response(
        {
            "message": "Login successful!",
            "token": token,
            "student": {
                "id": str(student.get("_id", "")),
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


@api_view(["GET", "PUT"])
@jwt_authenticated
def student_profile(request):
    """
    GET: Retrieve profile information for the authenticated student.
    PUT: Update profile information for the authenticated student.
    """
    student = request.student

    if request.method == "GET":
        return Response(
            {
                "student": {
                    "id": str(student.get("_id", "")),
                    "full_name": student.get("full_name", ""),
                    "email": student.get("email", ""),
                    "college_name": student.get("college_name", ""),
                    "department": student.get("department", ""),
                    "year_of_study": student.get("year_of_study", 1),
                    "career_goal": student.get("career_goal", ""),
                    "created_at": student.get("created_at", "")
                }
            },
            status=status.HTTP_200_OK
        )

    if request.method == "PUT":
        serializer = StudentProfileUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        update_data = serializer.validated_data
        if not update_data:
            return Response(
                {"error": "No update fields provided."},
                status=status.HTTP_400_BAD_REQUEST
            )

        db.students.update_one(
            {"_id": student["_id"]},
            {"$set": update_data}
        )

        updated_student = db.students.find_one({"_id": student["_id"]})

        return Response(
            {
                "message": "Profile updated successfully!",
                "student": {
                    "id": str(updated_student.get("_id", "")),
                    "full_name": updated_student.get("full_name", ""),
                    "email": updated_student.get("email", ""),
                    "college_name": updated_student.get("college_name", ""),
                    "department": updated_student.get("department", ""),
                    "year_of_study": updated_student.get("year_of_study", 1),
                    "career_goal": updated_student.get("career_goal", "")
                }
            },
            status=status.HTTP_200_OK
        )
