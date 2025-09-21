from django.urls import path
from .views import RegisterView, LogoutView, LoginView, ProfileView
from .views import RegisterView, LogoutView, LoginView, ProfileView, HealthCheckView 

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('healthz/', HealthCheckView.as_view(), name='health-check'),
]