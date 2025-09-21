from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AnimeViewSet, UserAnimeListViewSet

router = DefaultRouter()
router.register(r'anime', AnimeViewSet, basename='anime')
router.register(r'user-list', UserAnimeListViewSet, basename='user-list')

urlpatterns = [
    path('', include(router.urls)),
]