from rest_framework import serializers
from .models import Anime, UserAnimeList

class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = ['id', 'title', 'synopsis', 'cover_image_url', 'total_episodes', 'status']

class UserAnimeListSerializer(serializers.ModelSerializer):
    anime = AnimeSerializer(read_only=True)
    anime_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserAnimeList
        fields = ['id', 'anime', 'anime_id', 'tracking_status', 'episodes_watched', 'last_updated']
        read_only_fields = ['user']