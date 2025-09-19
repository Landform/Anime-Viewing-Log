# This is the correct content for users/serializers.py

from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # These are the fields that will be used for registration
        fields = ['id', 'username', 'email', 'password']
        # This ensures the password is not sent back in the response (write-only)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # This method is called when a new user is created.
        # It uses Django's create_user helper to ensure the password is HASHED.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user