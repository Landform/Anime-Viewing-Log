from django.db import models
from django.conf import settings # We need this to link to Django's built-in User model

# This class defines the 'anime' table in our database.
# Django automatically creates an 'id' primary key for us.
class Anime(models.Model):
    # Corresponds to: title varchar [not null]
    title = models.CharField(max_length=255, null=False)
    
    # Corresponds to: synopsis text
    synopsis = models.TextField(blank=True) # blank=True means this field is not required
    
    # Corresponds to: cover_image_url varchar
    cover_image_url = models.URLField(max_length=500, blank=True)
    
    # Corresponds to: total_episodes int
    total_episodes = models.IntegerField(null=True, blank=True) # null=True allows the database to store no value
    
    # Corresponds to: status varchar
    status = models.CharField(max_length=100, blank=True)

    # This is a helper method that tells Django what to print when we look at an Anime object.
    # It's very useful for debugging in the admin panel.
    def __str__(self):
        return self.title

# This class defines the 'user_anime_list' table, which connects a User to an Anime.
class UserAnimeList(models.Model):
    # This is a clean way to define the exact choices allowed for the tracking_status field.
    # It prevents typos and bad data.
    class TrackingStatus(models.TextChoices):
        WATCHING = 'Watching'
        COMPLETED = 'Completed'
        PLAN_TO_WATCH = 'Plan to Watch', 'Plan to Watch' # You can provide a different db value vs display value
        ON_HOLD = 'On-Hold'
        DROPPED = 'Dropped'

    # This creates the relationship to Django's built-in User model.
    # Corresponds to: Ref: users.id < user_anime_list.user_id
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, # This is the standard way to refer to the User model
        on_delete=models.CASCADE  # If a user is deleted, delete their list entries too
    )
    
    # This creates the relationship to our Anime model defined above.
    # Corresponds to: Ref: anime.id < user_anime_list.anime_id
    anime = models.ForeignKey(Anime, on_delete=models.CASCADE)
    
    # Corresponds to: tracking_status varchar [not null]
    tracking_status = models.CharField(
        max_length=20,
        choices=TrackingStatus.choices, # This enforces the use of our choices
        null=False
    )
    
    # Corresponds to: episodes_watched int [default: 0]
    episodes_watched = models.IntegerField(default=0)
    
    # Corresponds to: last_updated timestamp [not null]
    # auto_now=True tells Django to automatically update this field every time the entry is saved.
    last_updated = models.DateTimeField(auto_now=True)

    # This is a database constraint.
    # It ensures that a user cannot have the same anime on their list more than once.
    class Meta:
        unique_together = ('user', 'anime')

    # Another helper method for display purposes.
    def __str__(self):
        return f"{self.user.username}'s list for {self.anime.title}"