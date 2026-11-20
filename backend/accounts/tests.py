from unittest.mock import patch, MagicMock
from bson import ObjectId
import jwt
from django.conf import settings
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.hashers import make_password

from accounts.auth import generate_access_token, decode_access_token


class AccountsAuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.dummy_student = {
            "_id": ObjectId(),
            "full_name": "Test Student",
            "email": "student@example.com",
            "password": make_password("SecurePassword123"),
            "college_name": "EduVerse Institute",
            "department": "Computer Science",
            "year_of_study": 3,
            "career_goal": "Full Stack Developer",
            "created_at": "2026-11-20T10:00:00"
        }

    def test_jwt_generation_and_decoding(self):
        token = generate_access_token(self.dummy_student)
        self.assertIsInstance(token, str)

        payload = decode_access_token(token)
        self.assertEqual(payload["email"], "student@example.com")
        self.assertEqual(payload["student_id"], str(self.dummy_student["_id"]))

    def test_profile_unauthorized_without_token(self):
        response = self.client.get("/api/accounts/profile/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("error", response.data)

    def test_profile_unauthorized_with_invalid_token(self):
        response = self.client.get(
            "/api/accounts/profile/",
            HTTP_AUTHORIZATION="Bearer invalid.token.value"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("accounts.auth.db")
    def test_profile_get_success(self, mock_db):
        mock_db.students.find_one.return_value = self.dummy_student
        token = generate_access_token(self.dummy_student)

        response = self.client.get(
            "/api/accounts/profile/",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["student"]["email"], "student@example.com")
        self.assertEqual(response.data["student"]["full_name"], "Test Student")

    @patch("accounts.views.db")
    @patch("accounts.auth.db")
    def test_profile_put_success(self, mock_auth_db, mock_views_db):
        mock_auth_db.students.find_one.return_value = self.dummy_student
        updated_student = dict(self.dummy_student)
        updated_student["career_goal"] = "AI Engineer"
        mock_views_db.students.find_one.return_value = updated_student

        token = generate_access_token(self.dummy_student)

        response = self.client.put(
            "/api/accounts/profile/",
            data={"career_goal": "AI Engineer"},
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["student"]["career_goal"], "AI Engineer")
        mock_views_db.students.update_one.assert_called_once()

    @patch("accounts.views.db")
    def test_login_returns_token(self, mock_views_db):
        mock_views_db.students.find_one.return_value = self.dummy_student

        response = self.client.post(
            "/api/accounts/login/",
            data={
                "email": "student@example.com",
                "password": "SecurePassword123"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertIn("student", response.data)
        self.assertEqual(response.data["student"]["email"], "student@example.com")

    @patch("accounts.views.db")
    def test_register_returns_token(self, mock_views_db):
        mock_views_db.students.find_one.return_value = None
        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = ObjectId()
        mock_views_db.students.insert_one.return_value = mock_insert_result

        response = self.client.post(
            "/api/accounts/register/",
            data={
                "full_name": "New Student",
                "email": "newstudent@example.com",
                "password": "SecurePassword123",
                "confirm_password": "SecurePassword123",
                "college_name": "EduVerse Institute",
                "department": "AI & Data Science",
                "year_of_study": 2,
                "career_goal": "Machine Learning Engineer"
            },
            format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertIn("student", response.data)
        self.assertEqual(response.data["student"]["email"], "newstudent@example.com")
