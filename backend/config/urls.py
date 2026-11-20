from pathlib import Path
from django.conf import settings
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, re_path, include
from django.views.static import serve

from .views import index_view, favicon_view

FRONTEND_DIR = Path(settings.BASE_DIR).parent / "frontend"

urlpatterns = [
    # Homepage & favicon
    path("", index_view, name="index"),
    path("index.html", index_view, name="index_html"),
    path("favicon.ico", favicon_view, name="favicon"),

    # Convenient navigation shortcuts
    path("login/", lambda request: redirect("/pages/login.html")),
    path("register/", lambda request: redirect("/pages/register.html")),
    path("dashboard/", lambda request: redirect("/pages/dashboard.html")),
    path("learning/", lambda request: redirect("/pages/learning.html")),
    path("code-review/", lambda request: redirect("/pages/code-review.html")),
    path("skills/", lambda request: redirect("/pages/skill-analyzer.html")),
    path("roadmap/", lambda request: redirect("/pages/roadmap.html")),

    # Backend APIs
    path("admin/", admin.site.urls),
    path("api/accounts/", include("accounts.urls")),
    path("api/learning/", include("learning.urls")),
    path("api/code-review/", include("code_review.urls")),

    # Frontend assets (css, js, pages)
    re_path(
        r"^(?P<path>(css|js|pages)/.*)$",
        serve,
        {"document_root": str(FRONTEND_DIR)},
    ),
]
