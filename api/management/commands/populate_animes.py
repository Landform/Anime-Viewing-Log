# api/management/commands/populate_animes.py

import requests
from django.core.management.base import BaseCommand
from api.models import Anime  # This import path is correct based on your structure

class Command(BaseCommand):
    help = 'Populates the database with anime data from the Jikan API'

    def handle(self, *args, **options):
        self.stdout.write("Starting to populate anime database from Jikan API...")

        # Jikan API v4 endpoint for the top-rated anime series.
        # This will give us a good variety of popular shows.
        api_url = 'https://api.jikan.moe/v4/top/anime'
        
        try:
            # Make the GET request to the Jikan API
            response = requests.get(api_url)
            # This will raise an HTTPError if the HTTP request returned an unsuccessful status code
            response.raise_for_status()
            
            # Parse the JSON response
            data = response.json()
            
            # The list of anime is inside the 'data' key
            anime_list = data.get('data', [])

            if not anime_list:
                self.stdout.write(self.style.WARNING("No anime data found in the API response."))
                return

            for anime_data in anime_list:
                # The 'defaults' dictionary contains all the fields for the Anime model
                # EXCEPT the one we are using for the lookup (which is 'title').
                # We use .get() to safely access keys that might be missing from the API response.
                defaults = {
                    'synopsis': anime_data.get('synopsis', 'No synopsis available.'),
                    'cover_image_url': anime_data.get('images', {}).get('jpg', {}).get('large_image_url', ''),
                    'total_episodes': anime_data.get('episodes'),
                    'status': anime_data.get('status', 'Unknown'),
                    # Note: We are not populating score as it's not in your model
                }
                
                # Use get_or_create to prevent creating duplicate anime entries.
                # It looks for an Anime with the given 'title'.
                # - If it exists, it does nothing and returns the existing object.
                # - If it doesn't exist, it creates a new Anime object using the 'title'
                #   and the values in the 'defaults' dictionary.
                anime_obj, created = Anime.objects.get_or_create(
                    title=anime_data['title'],
                    defaults=defaults
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f"Successfully created anime: {anime_obj.title}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Anime already exists, skipping: {anime_obj.title}"))

            self.stdout.write(self.style.SUCCESS("\nFinished populating the database."))

        except requests.exceptions.RequestException as e:
            # Handle potential network errors, timeouts, etc.
            self.stdout.write(self.style.ERROR(f"Failed to fetch data from Jikan API: {e}"))
        except Exception as e:
            # Handle other potential errors (e.g., JSON parsing)
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred: {e}"))