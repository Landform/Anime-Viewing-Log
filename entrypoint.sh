#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Run database migrations
echo "Applying database migrations..."
python manage.py migrate --no-input

# Start the Gunicorn server
# The 'exec' command is important, it replaces the shell process with the Gunicorn process.
exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT