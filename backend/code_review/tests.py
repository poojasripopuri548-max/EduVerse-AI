from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status


class CodeReviewAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_review_code_missing_snippet(self):
        response = self.client.post("/api/code-review/analyze/", data={}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_review_code_success(self):
        response = self.client.post(
            "/api/code-review/analyze/",
            data={
                "code": "def hello():\n    print('Hello World')",
                "language": "python"
            },
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("review", response.data)
        self.assertEqual(response.data["language"], "python")
