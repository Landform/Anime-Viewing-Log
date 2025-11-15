#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
# This ensures that if migrations fail, the script stops.
set -e

# --- Database Migrations ---
# Run Django's migrate command to apply any pending database changes.
echo "Applying database migrations..."
python manage.py migrate --no-input


# --- Static Files ---
# Collect all static files (CSS, JS, images) into a single directory
# that WhiteNoise can serve efficiently.
# The --no-input flag prevents any interactive prompts.
# The --clear flag removes old files before collecting new ones.
echo "Collecting static files..."
python manage.py collectstatic --no-input --clear


# --- Start Gunicorn ---
# Start the Gunicorn web server to handle incoming HTTP requests.
# 'exec' is important because it replaces the shell process with the Gunicorn process,
# allowing Render to correctly manage the container's lifecycle.
#
# --bind 0.0.0.0:$PORT: Listen on all network interfaces on the port provided by Render.
# --timeout 120: Give workers up to 120 seconds to handle a request (helps with slow DB).
# --graceful-timeout 120: Give workers up to 120 seconds to finish requests before being killed.
# --log-level debug: Provide the most verbose logging possible to help diagnose any startup issues.
echo "Starting Gunicorn server..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --timeout 120 --graceful-timeout 120 --log-level debug