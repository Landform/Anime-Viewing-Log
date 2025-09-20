from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnimeViewSet, UserAnimeListViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'anime', AnimeViewSet, basename='anime')
router.register(r'user-list', UserAnimeListViewSet, basename='user-list')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('', include(router.urls)),
]