# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse # <-- IMPORT THIS

# --- 1. DEFINE THE HEALTH CHECK VIEW ---
# This is a simple function that Render will call to ensure your app is alive.
# It must return a successful response (HTTP 200 OK).
def health_check(request):
    """A simple view that returns a 200 OK response."""
    return HttpResponse("OK")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('api.urls')),
    
    # --- 2. ADD THE URL PATTERN FOR THE HEALTH CHECK ---
    # This path matches the 'healthCheckPath' in your render.yaml.
    path("health/", health_check, name="health_check"),
]