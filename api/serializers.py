from rest_framework import serializers
from .models import Anime, UserAnimeList

class AnimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anime
        fields = ['id', 'title', 'synopsis', 'cover_image_url', 'total_episodes', 'status']

class UserAnimeListSerializer(serializers.ModelSerializer):
    # We can nest the AnimeSerializer to show the full anime details in the list view.
    anime = AnimeSerializer(read_only=True) 
    # We need a write-only field to accept the anime_id when creating a new entry.
    anime_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = UserAnimeList
        fields = ['id', 'anime', 'anime_id', 'tracking_status', 'episodes_watched', 'last_updated']
        read_only_fields = ['user'] # The user will be set automatically from the request.

    def create(self, validated_data):
        # Set the user to the currently logged-in user.
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)