import os
from pathlib import Path
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# Secret Key
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'fallback-secret-for-local')

# Debug
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Allowed Hosts
ALLOWED_HOSTS = [host.strip() for host in os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')]

# Database
DATABASES = {
    'default': dj_database_url.config(default=os.environ.get('DATABASE_URL', f"sqlite:///{BASE_DIR / 'db.sqlite3'}"))
}

# CORS & CSRF for Render frontend
CORS_ALLOWED_ORIGINS = [f"https://{host}" for host in ALLOWED_HOSTS if host not in ['localhost', '127.0.0.1']]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [f"https://{host}" for host in ALLOWED_HOSTS if host not in ['localhost', '127.0.0.1']]
SESSION_COOKIE_SAMESITE = 'Lax'
