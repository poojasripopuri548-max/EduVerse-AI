from django.urls import path
from .views import learning_chat

urlpatterns = [
    path("chat/", learning_chat, name="learning_chat"),
]
