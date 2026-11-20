import os
from pathlib import Path
from django.conf import settings
from django.http import FileResponse, Http404, HttpResponse

FRONTEND_DIR = Path(settings.BASE_DIR).parent / "frontend"


def index_view(request):
    """
    Serve the homepage (frontend/index.html).
    """
    index_file = FRONTEND_DIR / "index.html"
    if index_file.exists():
        return FileResponse(open(index_file, "rb"), content_type="text/html")
    return HttpResponse("EduVerse AI backend is running. (frontend/index.html not found)")


def favicon_view(request):
    """
    Prevent 404 logs for favicon.ico.
    """
    return HttpResponse(status=204)
