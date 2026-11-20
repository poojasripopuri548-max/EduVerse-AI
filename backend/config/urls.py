from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/learning/", include("learning.urls")),
    path("api/code-review/", include("code_review.urls")),
]
