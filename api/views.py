from rest_framework import viewsets, permissions
from .models import Anime, UserAnimeList
from .serializers import AnimeSerializer, UserAnimeListSerializer

# A ViewSet is a powerful DRF class that can automatically handle
# List (GET), Retrieve (GET /id), Create (POST), Update (PUT), and Delete (DELETE) actions.
class AnimeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset provides `list` and `retrieve` actions for Anime.
    It allows searching by title.
    """
    queryset = Anime.objects.all()
    serializer_class = AnimeSerializer
    permission_classes = [permissions.IsAuthenticated] # Only logged-in users can search

    def get_queryset(self):
        queryset = super().get_queryset()
        search_term = self.request.query_params.get('search')
        if search_term:
            queryset = queryset.filter(title__icontains=search_term)
        return queryset

class UserAnimeListViewSet(viewsets.ModelViewSet):
    """
    This viewset allows users to manage their own anime list.
    """
    serializer_class = UserAnimeListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # This is the key to security: only return list items for the currently logged-in user.
        return UserAnimeList.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        # Pass the request context to the serializer so it knows who the user is.
        return {'request': self.request}