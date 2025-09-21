from rest_framework import viewsets, permissions
from .models import Anime, UserAnimeList
from .serializers import AnimeSerializer, UserAnimeListSerializer

class AnimeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Anime.objects.all()
    serializer_class = AnimeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search', None)
        if search_term:
            queryset = queryset.filter(title__icontains=search_term)
        return queryset

class UserAnimeListViewSet(viewsets.ModelViewSet):
    queryset = UserAnimeList.objects.all()
    serializer_class = UserAnimeListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset.filter(user=self.request.user)
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(tracking_status=status)
        anime_id = self.request.query_params.get('anime_id', None)
        if anime_id is not None:
            queryset = queryset.filter(anime__id=anime_id)
        return queryset.order_by('-last_updated')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)