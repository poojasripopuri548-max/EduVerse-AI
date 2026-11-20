from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status


class LearningAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_learning_chat_missing_question(self):
        response = self.client.post("/api/learning/chat/", data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_learning_chat_success(self):
        response = self.client.post(
            "/api/learning/chat/",
            data={"question": "What is Python OOP?"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("answer", response.data)
        self.assertIn("timestamp", response.data)
