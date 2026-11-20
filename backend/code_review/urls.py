from django.urls import path
from .views import review_code

urlpatterns = [
    path("analyze/", review_code, name="review_code"),
]
