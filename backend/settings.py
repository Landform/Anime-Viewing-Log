# settings.py

from pathlib import Path
import os
import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent

# --- Production/Development Agnostic Settings ---

# SECRET_KEY is loaded from an environment variable in production (Render will generate this)
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'django-insecure-your-secret-key-here')

# DEBUG is False in production (value is '0'), True for local dev (value is '1' or not set)
DEBUG = os.environ.get('DEBUG', '1') == '1'

# --- CORRECTED ALLOWED_HOSTS LOGIC ---
# Render provides RENDER_EXTERNAL_HOSTNAME automatically. We use it for production.
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS = [RENDER_EXTERNAL_HOSTNAME]
    CSRF_TRUSTED_ORIGINS = [f"https://{RENDER_EXTERNAL_HOSTNAME}"]
    CORS_ALLOWED_ORIGINS = [f"https://{RENDER_EXTERNAL_HOSTNAME}"] # Also update CORS for production
else:
    # Fallback for local development
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '192.168.1.214', 'backend']
    CSRF_TRUSTED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://192.168.1.214']
    CORS_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://192.168.1.214']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'users',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# --- CORRECTED DATABASE LOGIC ---
# Default to SQLite for local dev if DATABASE_URL is not set
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
# Use PostgreSQL in production (Render provides DATABASE_URL)
DB_FROM_ENV = os.environ.get('DATABASE_URL')
if DB_FROM_ENV:
    DATABASES['default'] = dj_database_url.config(
        default=DB_FROM_ENV,
        conn_max_age=600,
        engine='django.db.backends.postgresql'
    )

AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = 'Lax'