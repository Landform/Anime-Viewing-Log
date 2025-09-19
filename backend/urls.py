# This is the correct content for backend/urls.py

from django.contrib import admin
from django.urls import path, include # Make sure 'include' is imported

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # This line tells Django: "For any URL starting with 'api/auth/',
    # go look for more instructions inside the 'users.urls' file."
    path('api/auth/', include('users.urls')), 
]