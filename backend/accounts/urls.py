from django.urls import path
from .views import register_student, login_student, student_profile

urlpatterns = [
    path("register/", register_student, name="register_student"),
    path("login/", login_student, name="login_student"),
    path("profile/", student_profile, name="student_profile"),
]
