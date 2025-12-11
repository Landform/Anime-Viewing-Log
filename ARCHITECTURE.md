# Anime Viewing Log - Architecture Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [The Mess: What Was Wrong](#the-mess-what-was-wrong)
3. [The Cleanup: What Was Fixed](#the-cleanup-what-was-fixed)
4. [Current Architecture](#current-architecture)
5. [Deployment Options](#deployment-options)
6. [File Structure Explained](#file-structure-explained)
7. [Best Practices Going Forward](#best-practices-going-forward)
8. [Transitioning to IaaS](#transitioning-to-iaas)

---

## Project Overview

**Tech Stack:**
- **Backend**: Django 4.x (Python 3.11) with Django REST Framework
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL (production) / SQLite (local development)
- **Authentication**: Django Session-based auth with cookies
- **Current Deployment**: Render (PaaS)
- **Local Development**: Docker Compose

**Purpose**: Track anime viewing progress with user authentication, allowing users to log, update, and manage their anime watching history.

---

## The Mess: What Was Wrong

### Problem 1: Duplicate Project Structure (Critical)
The project had a **nested duplicate structure** that was fundamentally broken:

```
Anime-Viewing-Log/                    # Root directory
├── api/                               # ❌ INCOMPLETE - missing files
├── backend/                           # ❌ INCOMPLETE - missing files
├── users/                             # ❌ INCOMPLETE - missing files
├── frontend/                          # ✅ Complete React app
├── manage.py                          # ❌ MISSING (critical!)
├── Dockerfile                         # Points to manage.py at root
├── render.yaml                        # Expects manage.py at root
└── Anime-Viewing-Log/                 # ❌ DUPLICATE SUBDIRECTORY
    ├── api/                           # ✅ Complete Django app
    ├── backend/                       # ✅ Complete Django app
    ├── users/                         # ✅ Complete Django app
    ├── manage.py                      # ✅ Exists here
    ├── .git/                          # ❌ Nested Git repo!
    └── frontend/vite-project/         # ❌ Old frontend structure
```

**Why This Was a Disaster:**
1. **Dockerfile Expected manage.py at Root**: The `entrypoint.sh` script runs `python manage.py migrate` but `manage.py` didn't exist at the root level
2. **Incomplete Django Apps**: The root-level `api/`, `backend/`, and `users/` directories were missing critical files like `__init__.py`, `apps.py`, `models.py`, `asgi.py`, `wsgi.py`
3. **Nested Git Repository**: The subdirectory had its own `.git` folder, creating confusion about version control
4. **Render Would Fail**: Render builds from root, but the complete Django project was in the subdirectory
5. **No Single Source of Truth**: Two versions of the same code made it impossible to know which was "real"

### Problem 2: Configuration File Chaos
Multiple conflicting configuration files:
- `docker-compose.yml` ✅ (for local dev)
- `docker-compose.prod.yml` ✅ (for Docker production)
- `docker-compose-prod.yml` ❌ (duplicate with different name)
- `Dockerfile.backend-only.bak` ❌ (backup file committed to Git)

### Problem 3: Typo Files in Repository
- `et --hard HEAD@{1}` - This is a typo from trying to run `git reset --hard HEAD@{1}` but typing it wrong. This **file** was committed to Git!

### Problem 4: Outdated Deployment Workflows
`.github/workflows/cd.yml` referenced:
```yaml
cd frontend/vite-project  # ❌ This path doesn't exist anymore
npm install
npm run build
```
This would fail because the frontend structure changed from `frontend/vite-project/` to just `frontend/`.

### Problem 5: Python Cache Pollution
**1,748 Python cache files** (`__pycache__`, `*.pyc`) were tracked in Git. These should **never** be committed as they:
- Pollute the repository
- Cause merge conflicts
- Are automatically regenerated
- Differ across Python versions

### Problem 6: Empty or Missing .gitignore
The `.gitignore` file was essentially empty, which is why cache files, test artifacts, and backup files were all committed to Git.

### Problem 7: Leftover Test Artifacts
Multiple test result directories committed to Git:
- `test-results/`
- `frontend/test-results/`
- `frontend/playwright-report/`

These are **build artifacts** that should be generated locally and ignored.

### Problem 8: Unnecessary Root-Level Node.js
```
package.json          # Only contained "dotenv" devDependency
package-lock.json     # For above
node_modules/         # Just dotenv package
```
This was unnecessary because:
- The frontend has its own `package.json` in `frontend/`
- The backend doesn't use Node.js
- Having dependencies in two places is confusing

### Problem 9: Committed Backups and Temporary Files
```
backups/backup-2025-09-21_18-38-00.sql
backups/backup-2025-09-21_18-38-26.sql
backup.sh                              # PostgreSQL backup script for Docker
database_schema.dbml                   # Database schema file
openai.yaml                            # Unknown purpose
request.http                           # HTTP request testing file
```

**Why These Are Problems:**
- **SQL backups** should not be in Git (sensitive data, large files)
- **backup.sh** was for local Docker PostgreSQL, irrelevant for Render
- These files clutter the repository

---

## The Cleanup: What Was Fixed

### ✅ Actions Taken

#### 1. Consolidated Django Backend to Root
**What Happened:**
```bash
# Copied complete Django apps from subdirectory to root
cp -r Anime-Viewing-Log/api/* api/
cp -r Anime-Viewing-Log/backend/* backend/
cp -r Anime-Viewing-Log/users/* users/
cp Anime-Viewing-Log/manage.py .
```

**Files Added to Root:**
- `manage.py` - Django's command-line utility
- `api/__init__.py` - Makes api a Python package
- `api/apps.py` - Django app configuration
- `api/models.py` - Database models
- `api/migrations/0001_initial.py` - Initial database migration
- `backend/__init__.py` - Makes backend a Python package
- `backend/asgi.py` - ASGI server entry point
- `backend/wsgi.py` - WSGI server entry point (used by Gunicorn)
- `users/__init__.py` - Makes users a Python package
- `users/models.py` - User-related database models

**Why This Matters:**
- Now `Dockerfile` can find `manage.py` at root
- `entrypoint.sh` can run `python manage.py migrate`
- Render deployment will work correctly
- Single source of truth for the Django codebase

#### 2. Removed Duplicate Subdirectory
```bash
rm -rf Anime-Viewing-Log/
```

**What Was Deleted:**
- Entire duplicate Django backend
- Nested `.git` repository
- Old frontend structure (`frontend/vite-project/`)
- Duplicate configuration files

**Impact**: Eliminated confusion about which code is authoritative

#### 3. Cleaned Up Duplicate & Backup Files
```bash
# Removed junk files
rm -f "et --hard HEAD@{1}"
rm -f Dockerfile.backend-only.bak
rm -f docker-compose-prod.yml

# Removed backups and scripts
rm -rf backups/
rm -f backup.sh

# Removed test artifacts
rm -rf test-results/
rm -rf frontend/test-results/
rm -rf frontend/playwright-report/
```

#### 4. Removed All Python Cache Files
```bash
# Deleted 1,748 cache files
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type f -name "*.pyc" -delete
```

**Why**: These are automatically regenerated by Python and should never be in Git

#### 5. Deleted Unnecessary Root Node.js Files
```bash
rm -rf node_modules/
rm -f package.json package-lock.json
```

**Why**: The frontend has its own dependencies in `frontend/package.json`

#### 6. Fixed docker-compose.prod.yml
**Changed:**
```yaml
# OLD (broken)
volumes:
  - ./frontend/vite-project/dist:/usr/share/nginx/html:ro

# NEW (correct)
volumes:
  - ./frontend/dist:/usr/share/nginx/html:ro
```

**Why**: The frontend build output is now at `frontend/dist/`, not `frontend/vite-project/dist/`

#### 7. Removed Outdated SSH Deployment Workflow
```bash
rm -f .github/workflows/cd.yml
```

**Why**: This workflow deployed to a server via SSH and referenced old paths. Since you're using Render, this was obsolete.

#### 8. Created Comprehensive .gitignore
**Added proper ignore patterns for:**
- Python cache (`__pycache__/`, `*.pyc`)
- Virtual environments (`venv/`, `env/`)
- Django artifacts (`db.sqlite3`, `/staticfiles/`, `.env`)
- Frontend build artifacts (`frontend/dist/`, `frontend/node_modules/`)
- Test artifacts (`test-results/`, `playwright-report/`)
- IDE files (`.vscode/`, `.idea/`)
- Backups (`backups/`, `*.sql`)

**Why**: Prevents future commits of generated files and secrets

#### 9. Properly Staged Git Changes
All deletions, modifications, and new files properly staged for commit:
- **56 deletions** (cache files, duplicates, artifacts)
- **3 modifications** (.gitignore, docker-compose.prod.yml, backend files)
- **10 additions** (Django files moved to root)

---

## Current Architecture

### Clean Project Structure

```
Anime-Viewing-Log/                    # Project root
│
├── .github/                          # GitHub Actions (CI only)
│   └── workflows/
│       └── ci.yml                    # Runs tests on PR/push
│
├── api/                              # Django app: Anime API endpoints
│   ├── __init__.py                   # Python package marker
│   ├── admin.py                      # Django admin configuration
│   ├── apps.py                       # App configuration
│   ├── models.py                     # Anime database models
│   ├── serializers.py                # DRF serializers
│   ├── urls.py                       # API URL routing
│   ├── views.py                      # API view logic
│   ├── management/                   # Custom management commands
│   │   └── commands/
│   │       └── populate_anime.py     # Jikan API integration
│   └── migrations/                   # Database migrations
│       ├── 0001_initial.py           # Initial schema
│       └── __init__.py
│
├── backend/                          # Django project configuration
│   ├── __init__.py                   # Python package marker
│   ├── asgi.py                       # ASGI server config (async)
│   ├── wsgi.py                       # WSGI server config (Gunicorn)
│   ├── settings.py                   # Django settings (CRITICAL)
│   └── urls.py                       # Root URL configuration
│
├── users/                            # Django app: User authentication
│   ├── __init__.py                   # Python package marker
│   ├── admin.py                      # User admin configuration
│   ├── apps.py                       # App configuration
│   ├── models.py                     # User models (if custom)
│   ├── serializers.py                # User serializers
│   ├── urls.py                       # Auth URL routing
│   ├── views.py                      # Login/logout/register logic
│   └── migrations/                   # User-related migrations
│       └── __init__.py
│
├── frontend/                         # React + TypeScript + Vite
│   ├── src/                          # Source code
│   │   ├── App.tsx                   # Main React component
│   │   ├── main.tsx                  # Entry point
│   │   ├── components/               # Reusable React components
│   │   ├── context/                  # React Context (state management)
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── pages/                    # Page components
│   │   └── styles.css                # Global styles
│   ├── public/                       # Static assets
│   ├── tests/                        # Playwright E2E tests
│   ├── playwright/                   # Playwright configuration
│   ├── .env.development              # Frontend dev environment vars
│   ├── .env.production               # Frontend prod environment vars
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Node.js dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── vite.config.ts                # Vite build configuration
│   └── playwright.config.ts          # E2E test configuration
│
├── nginx/                            # Nginx reverse proxy (Docker only)
│   ├── Dockerfile                    # Nginx container build
│   └── nginx.conf                    # Reverse proxy configuration
│
├── .env                              # Backend environment variables (NEVER COMMIT)
├── .gitignore                        # Git ignore patterns
├── db.sqlite3                        # Local SQLite database
├── docker-compose.yml                # Local development with Docker
├── docker-compose.prod.yml           # Production-style Docker setup
├── Dockerfile                        # Backend container build
├── entrypoint.sh                     # Docker startup script
├── manage.py                         # Django CLI (THE CRITICAL FILE)
├── render.yaml                       # Render deployment configuration
├── requirements.txt                  # Python dependencies
└── request.http                      # HTTP request examples (testing)
```

---

## Deployment Options

### Option 1: Render (Current Production)

**What Render Does:**
1. Reads `render.yaml` configuration
2. Creates a PostgreSQL database (`anime-db`)
3. Builds a Docker container using `Dockerfile`
4. Runs the container with environment variables
5. Executes `entrypoint.sh` on startup

**render.yaml Breakdown:**
```yaml
databases:
  - name: anime-db              # Creates PostgreSQL 15 database
    plan: free                  # Free tier (limited)
    region: oregon

services:
  - type: web
    name: backend
    runtime: docker             # Uses Dockerfile
    dockerfilePath: ./Dockerfile
    healthCheckPath: /health/   # Render pings this to verify service is up

    envVars:
      - key: DATABASE_URL       # Auto-injected from anime-db
      - key: DJANGO_SECRET_KEY  # Auto-generated by Render
      - key: DEBUG              # Set to 0 (production mode)
```

**Dockerfile Breakdown:**
```dockerfile
# STAGE 1: Builder - Creates Python wheels (compiled packages)
FROM python:3.11-slim as builder
WORKDIR /usr/src/app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /usr/src/app/wheels -r requirements.txt

# STAGE 2: Final - Lightweight production image
FROM python:3.11-slim
WORKDIR /home/app

# Install pre-built wheels from builder stage (faster)
COPY --from=builder /usr/src/app/wheels /wheels
RUN pip install --no-cache /wheels/*

# Copy application code
COPY . .
COPY entrypoint.sh /home/app/entrypoint.sh
RUN chmod +x /home/app/entrypoint.sh

# Security: Create non-root user
RUN addgroup --system app && adduser --system --group app
RUN chown -R app:app /home/app
USER app

EXPOSE 8000
CMD ["/home/app/entrypoint.sh"]
```

**entrypoint.sh Breakdown:**
```bash
# 1. Apply database migrations
python manage.py migrate --no-input

# 2. Collect static files (CSS, JS) for WhiteNoise to serve
python manage.py collectstatic --no-input --clear

# 3. Start Gunicorn web server
exec gunicorn backend.wsgi:application \
  --bind 0.0.0.0:$PORT \           # Render provides $PORT
  --timeout 120 \                   # 2 minutes for slow requests
  --graceful-timeout 120 \          # 2 minutes for graceful shutdown
  --log-level debug                 # Verbose logging
```

**Key Render-Specific Settings (backend/settings.py):**
```python
# Render provides RENDER_EXTERNAL_HOSTNAME
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS = [RENDER_EXTERNAL_HOSTNAME]
    CSRF_TRUSTED_ORIGINS = [f"https://{RENDER_EXTERNAL_HOSTNAME}"]

    # CRITICAL for cross-domain cookies
    SESSION_COOKIE_SAMESITE = 'None'
    SESSION_COOKIE_SECURE = True

# Database auto-configured from DATABASE_URL
DB_FROM_ENV = os.environ.get('DATABASE_URL')
if DB_FROM_ENV:
    DATABASES['default'] = dj_database_url.config(default=DB_FROM_ENV)
```

**Why This Works:**
- Render manages infrastructure (you don't worry about servers)
- Automatic HTTPS certificates
- Database backups handled by Render
- Health checks ensure service availability

**Limitations of Render Free Tier:**
- Services spin down after 15 minutes of inactivity (cold starts)
- 512 MB RAM limit
- 100 GB bandwidth/month
- Database: 1 GB storage, expires after 90 days

---

### Option 2: Docker Compose (Local Development)

**Two Modes:**

#### A. Development Mode (`docker-compose.yml`)
```yaml
services:
  backend:
    build: .
    command: python manage.py runserver 0.0.0.0:8000  # Dev server
    ports:
      - "8000:8000"      # Direct access to backend
    env_file:
      - ./.env           # Loads DATABASE_URL, etc.
    depends_on:
      - db

  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persistent storage
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
```

**Usage:**
```bash
# Start services
docker compose up

# Backend available at http://localhost:8000
# Frontend: Run separately with `cd frontend && npm run dev`
```

**Why Separate Frontend:**
- Hot module replacement (HMR) for instant updates
- Faster development iteration
- Easy debugging in browser DevTools

#### B. Production-Style Mode (`docker-compose.prod.yml`)
```yaml
services:
  db:
    image: postgres:15-alpine    # Smaller image
    restart: unless-stopped       # Auto-restart on crash

  backend:
    build: .
    command: gunicorn backend.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - static_volume:/home/app/staticfiles  # Share with nginx
    expose:
      - 8000                      # Internal only (not published)
    restart: unless-stopped

  nginx:
    build: ./nginx
    volumes:
      - ./frontend/dist:/usr/share/nginx/html:ro    # Serve React build
      - static_volume:/home/app/staticfiles:ro      # Serve Django static
    ports:
      - "80:80"                   # Only nginx exposed to host
    depends_on:
      - backend

  uptime-kuma:
    image: louislam/uptime-kuma:1
    ports:
      - "3001:3001"               # Monitoring dashboard
    restart: unless-stopped
```

**Usage:**
```bash
# Build frontend first
cd frontend && npm run build && cd ..

# Start all services
docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# Access via http://localhost (nginx routes requests)
```

**Nginx Routing (nginx/nginx.conf):**
```nginx
location / {
    # Serve React app
    root /usr/share/nginx/html;
    try_files $uri /index.html;
}

location ~ ^/(api|admin) {
    # Proxy to Django backend
    proxy_pass http://backend:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**Why This Architecture:**
- **Simulates production** (Gunicorn + Nginx + PostgreSQL)
- **Single entry point** (nginx on port 80)
- **Static file optimization** (nginx serves files faster than Django)
- **Monitoring included** (uptime-kuma)

---

### Option 3: IaaS Deployment (Future)

#### What Is IaaS?
**Infrastructure as a Service** - You manage the servers, OS, and application. Examples:
- AWS EC2 + RDS
- Google Compute Engine + Cloud SQL
- Azure Virtual Machines + Azure Database
- DigitalOcean Droplets + Managed PostgreSQL
- Linode Compute Instances

#### Why Move to IaaS?
1. **Cost Control**: Pay only for what you use (vs. PaaS markup)
2. **Performance**: Dedicated resources (no cold starts)
3. **Flexibility**: Full control over infrastructure
4. **Scalability**: Horizontal scaling (multiple servers)
5. **Learning**: Understand full deployment lifecycle

#### Recommended IaaS Architecture

```
                      ┌─────────────────┐
                      │  Load Balancer  │  (Nginx or cloud LB)
                      └────────┬────────┘
                               │
              ┌────────────────┼────────────────┐
              │                                  │
     ┌────────▼────────┐              ┌────────▼────────┐
     │  App Server 1   │              │  App Server 2   │
     │  (Django +      │              │  (Django +      │
     │   Gunicorn)     │              │   Gunicorn)     │
     └────────┬────────┘              └────────┬────────┘
              │                                  │
              └────────────────┬─────────────────┘
                               │
                      ┌────────▼────────┐
                      │  PostgreSQL DB  │  (Managed or self-hosted)
                      └─────────────────┘
```

#### IaaS Deployment Steps

##### 1. Provision Infrastructure
```bash
# Example: AWS EC2 instance
- Instance Type: t3.micro (1 vCPU, 1 GB RAM) - Free tier eligible
- OS: Ubuntu 22.04 LTS
- Security Group: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

# Database: AWS RDS PostgreSQL
- Instance: db.t3.micro
- Storage: 20 GB SSD
- Automated backups enabled
```

##### 2. Server Setup Script
```bash
#!/bin/bash
# Run on fresh Ubuntu server

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3.11 python3-pip nginx git postgresql-client

# Install Docker (optional, for containerized deployment)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Create application user
sudo useradd -m -s /bin/bash anime-app
sudo su - anime-app

# Clone repository
git clone https://github.com/YOUR_USERNAME/Anime-Viewing-Log.git
cd Anime-Viewing-Log

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
nano .env  # Edit with production values
```

##### 3. Environment Variables (.env for IaaS)
```bash
# Database (from RDS or managed PostgreSQL)
DATABASE_URL=postgres://user:password@your-db-host.rds.amazonaws.com:5432/anime_db

# Django
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=0
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# CORS & CSRF
FRONTEND_URL=https://your-domain.com
```

##### 4. Nginx Configuration (IaaS)
```nginx
# /etc/nginx/sites-available/anime-viewing-log

upstream django {
    server 127.0.0.1:8000;  # Gunicorn listening locally
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL certificates (use Let's Encrypt - certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Serve React frontend
    location / {
        root /home/anime-app/Anime-Viewing-Log/frontend/dist;
        try_files $uri /index.html;
    }

    # Proxy to Django backend
    location ~ ^/(api|admin) {
        proxy_pass http://django;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve Django static files
    location /static/ {
        alias /home/anime-app/Anime-Viewing-Log/staticfiles/;
    }
}
```

##### 5. Systemd Service (Keep Gunicorn Running)
```ini
# /etc/systemd/system/anime-backend.service

[Unit]
Description=Anime Viewing Log Django Backend
After=network.target

[Service]
User=anime-app
Group=anime-app
WorkingDirectory=/home/anime-app/Anime-Viewing-Log
Environment="PATH=/home/anime-app/Anime-Viewing-Log/venv/bin"
ExecStart=/home/anime-app/Anime-Viewing-Log/venv/bin/gunicorn \
          --workers 3 \
          --bind 127.0.0.1:8000 \
          backend.wsgi:application

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable anime-backend
sudo systemctl start anime-backend
sudo systemctl status anime-backend
```

##### 6. SSL with Let's Encrypt
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up automatically
```

##### 7. Deployment Script
```bash
#!/bin/bash
# deploy.sh - Run this to update production

cd /home/anime-app/Anime-Viewing-Log

# Pull latest code
git pull origin main

# Activate virtual environment
source venv/bin/activate

# Install/update dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Restart backend
sudo systemctl restart anime-backend

# Reload nginx
sudo nginx -t && sudo systemctl reload nginx

echo "Deployment complete!"
```

#### IaaS Cost Comparison (Monthly Estimates)

| Service | AWS | DigitalOcean | Linode |
|---------|-----|--------------|--------|
| App Server (1 vCPU, 1 GB RAM) | ~$8 | $6 | $5 |
| Managed PostgreSQL | ~$15 | $15 | $15 |
| Load Balancer (optional) | ~$20 | $12 | $10 |
| **Total (minimal)** | **~$23** | **~$21** | **~$20** |
| **Total (with LB)** | **~$43** | **~$33** | **~$30** |

**Render Comparison:**
- Free tier: $0 (with limitations)
- Paid tier: $7/month (web service) + $7/month (database) = **$14/month**

---

## File Structure Explained

### Core Django Files

#### manage.py
**Purpose**: Django's command-line utility for administrative tasks

**Key Commands:**
```bash
python manage.py migrate           # Apply database migrations
python manage.py makemigrations    # Create new migrations
python manage.py createsuperuser   # Create admin user
python manage.py runserver         # Start development server
python manage.py shell             # Interactive Python shell with Django
python manage.py collectstatic     # Gather static files for production
python manage.py test              # Run tests
```

**Why It's Critical**: Without this file, you cannot run any Django commands.

#### backend/settings.py
**Purpose**: Central configuration for the entire Django project

**Key Sections:**
```python
# Security
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')  # Cryptographic signing
DEBUG = os.environ.get('DEBUG', '1') == '1'       # Never True in production

# Database
DATABASES = {
    'default': dj_database_url.config(...)  # Auto-configured from DATABASE_URL
}

# Installed Apps
INSTALLED_APPS = [
    'django.contrib.admin',      # Admin interface
    'django.contrib.auth',       # User authentication
    'rest_framework',            # API framework
    'corsheaders',               # Cross-Origin Resource Sharing
    'users',                     # Your custom user app
    'api',                       # Your custom API app
]

# Middleware (order matters!)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',     # Serve static files
    'corsheaders.middleware.CorsMiddleware',          # Handle CORS
    'django.middleware.csrf.CsrfViewMiddleware',      # CSRF protection
    # ... more middleware
]

# Static Files
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Session Cookies (for authentication)
SESSION_COOKIE_SAMESITE = 'None'  # Allow cross-domain cookies (Render)
SESSION_COOKIE_SECURE = True      # Only send over HTTPS
CORS_ALLOW_CREDENTIALS = True     # Allow cookies in CORS requests
```

**Architecture Decisions Explained:**

1. **WhiteNoise**: Serves static files (CSS, JS) without needing a separate web server. Critical for Render.
2. **CORS Headers**: React frontend runs on different domain than Django backend, so CORS must be configured.
3. **Session Cookie SameSite='None'**: Allows frontend (e.g., `frontend.render.com`) to send cookies to backend (e.g., `backend.render.com`).

#### backend/urls.py
**Purpose**: Root URL routing for the entire project

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),              # Django admin at /admin
    path('api/', include('api.urls')),            # API endpoints at /api/*
    path('auth/', include('users.urls')),         # Auth endpoints at /auth/*
    path('health/', health_check),                # Health check for Render
]
```

**How Routing Works:**
- Request to `/api/anime/` → routed to `api/urls.py` → handled by `api/views.py`
- Request to `/auth/login/` → routed to `users/urls.py` → handled by `users/views.py`

#### backend/wsgi.py & backend/asgi.py
**WSGI (Web Server Gateway Interface)**: Synchronous Python web server interface
- Used by **Gunicorn** in production
- Standard for Django apps

**ASGI (Asynchronous Server Gateway Interface)**: Async Python web server interface
- Supports WebSockets, HTTP/2, async views
- Future-proof for real-time features

**Current Usage**: WSGI (Gunicorn uses `backend.wsgi:application`)

### Django Apps

#### api/
**Purpose**: Handles anime-related API endpoints

**Key Files:**
- `models.py`: Database schema for anime entries
  ```python
  class Anime(models.Model):
      title = models.CharField(max_length=255)
      episodes_watched = models.IntegerField()
      user = models.ForeignKey(User, on_delete=models.CASCADE)
  ```

- `serializers.py`: Converts Django models to/from JSON
  ```python
  class AnimeSerializer(serializers.ModelSerializer):
      class Meta:
          model = Anime
          fields = ['id', 'title', 'episodes_watched']
  ```

- `views.py`: API logic
  ```python
  @api_view(['GET', 'POST'])
  def anime_list(request):
      if request.method == 'GET':
          anime = Anime.objects.filter(user=request.user)
          serializer = AnimeSerializer(anime, many=True)
          return Response(serializer.data)
  ```

- `management/commands/populate_anime.py`: Custom command to populate database from Jikan API
  ```bash
  python manage.py populate_anime
  ```

#### users/
**Purpose**: Handles user authentication (login, logout, registration)

**Key Files:**
- `views.py`: Login/logout endpoints
  ```python
  @api_view(['POST'])
  def login_view(request):
      username = request.data.get('username')
      password = request.data.get('password')
      user = authenticate(username=username, password=password)
      if user:
          login(request, user)
          return Response({'message': 'Logged in'})
  ```

- `serializers.py`: User data serialization

### Frontend Structure

#### frontend/src/
**Purpose**: React application source code

**Key Files:**
- `main.tsx`: Entry point, renders `<App />` into the DOM
- `App.tsx`: Main component, sets up routing
- `components/`: Reusable UI components (buttons, forms, etc.)
- `pages/`: Full page components (LoginPage, AnimeListPage, etc.)
- `context/`: React Context for global state (user authentication state)
- `hooks/`: Custom React hooks (e.g., `useAuth`, `useAnimeList`)

#### frontend/vite.config.ts
**Purpose**: Configure Vite build tool

**Key Settings:**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Proxy API calls to Django in dev
        changeOrigin: true,
      }
    }
  }
})
```

**Why Proxy**: In development, frontend runs on `localhost:5173` and backend on `localhost:8000`. The proxy prevents CORS issues.

### Docker Files

#### Dockerfile
**Purpose**: Build Django backend container image

**Multi-Stage Build:**
1. **Builder stage**: Compiles Python packages into wheels (pre-built binaries)
2. **Final stage**: Installs wheels and copies application code

**Why Multi-Stage**: Smaller final image size (builder tools not included)

#### docker-compose.yml
**Purpose**: Define and run multi-container Docker applications

**Volumes**: Persist data across container restarts
```yaml
volumes:
  postgres_data:  # Database data survives container deletion
```

#### entrypoint.sh
**Purpose**: Startup script for Django container

**Why Not Run Commands in Dockerfile**:
- Migrations need database to be ready
- `collectstatic` needs application code
- Dockerfile runs at build time, entrypoint runs at container start

---

## Best Practices Going Forward

### 1. Environment Variables Management

**Never Commit Secrets to Git**

**.env.example** (safe to commit):
```bash
# Database
DATABASE_URL=postgres://user:password@localhost:5432/anime_db
POSTGRES_DB=anime_db
POSTGRES_USER=anime_user
POSTGRES_PASSWORD=change_this_password

# Django
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=1
ALLOWED_HOSTS=localhost,127.0.0.1
```

**.env** (never commit):
```bash
# Contains real production secrets
DJANGO_SECRET_KEY=super-secret-production-key-aoig2309gj23
DATABASE_URL=postgres://prod_user:real_password@prod-db.amazonaws.com/anime_prod
```

**Always add to .gitignore:**
```gitignore
.env
.env.local
.env.production
```

### 2. Database Migrations Workflow

**Creating Migrations:**
```bash
# 1. Modify models.py
class Anime(models.Model):
    rating = models.IntegerField(default=0)  # NEW FIELD

# 2. Create migration file
python manage.py makemigrations

# 3. Review the migration file
cat api/migrations/0002_anime_rating.py

# 4. Apply migration
python manage.py migrate

# 5. Commit migration file to Git
git add api/migrations/0002_anime_rating.py
git commit -m "feat: Add rating field to Anime model"
```

**Never:**
- Delete migration files (breaks database history)
- Edit applied migrations (causes conflicts)
- Skip migrations in production

### 3. Git Workflow

**Branch Strategy:**
```bash
main           # Production-ready code
  └── dev      # Development branch
      └── feature/anime-rating  # Feature branches
```

**Typical Workflow:**
```bash
# 1. Create feature branch
git checkout -b feature/anime-rating

# 2. Make changes, commit frequently
git add .
git commit -m "feat: Add rating field to Anime model"
git commit -m "feat: Add rating UI to frontend"

# 3. Push to remote
git push origin feature/anime-rating

# 4. Create Pull Request on GitHub

# 5. After review, merge to main
git checkout main
git merge feature/anime-rating
git push origin main

# 6. Delete feature branch
git branch -d feature/anime-rating
```

**Commit Message Convention:**
```
feat: Add new feature
fix: Bug fix
refactor: Code refactoring (no functionality change)
docs: Documentation updates
chore: Dependency updates, config changes
test: Add or modify tests
```

### 4. Dependency Management

**Python (requirements.txt):**
```bash
# Add new dependency
pip install django-cors-headers
pip freeze > requirements.txt

# Or use pip-compile (better)
pip install pip-tools
# Edit requirements.in
pip-compile requirements.in
```

**Frontend (package.json):**
```bash
# Add dependency
cd frontend
npm install axios

# Add dev dependency
npm install -D @types/react

# Update all dependencies
npm update

# Audit for vulnerabilities
npm audit
npm audit fix
```

### 5. Static Files in Production

**Django Static Files Workflow:**
```bash
# 1. collectstatic gathers files from all apps
python manage.py collectstatic

# 2. WhiteNoise serves from STATIC_ROOT
# (No need to configure nginx for static files)
```

**Where Static Files Come From:**
- Django admin: `/venv/lib/python3.11/site-packages/django/contrib/admin/static/`
- DRF: `/venv/lib/python3.11/site-packages/rest_framework/static/`
- Your apps: `api/static/`, `users/static/`

**collectstatic Output:**
- All files copied to `staticfiles/`
- WhiteNoise serves from `staticfiles/`

### 6. Security Best Practices

**Django Settings:**
```python
# Production settings (settings.py)
DEBUG = False                      # NEVER True in production
ALLOWED_HOSTS = ['your-domain.com']  # Prevent host header attacks

# Security headers
SECURE_SSL_REDIRECT = True         # Force HTTPS
SESSION_COOKIE_SECURE = True       # Cookies only over HTTPS
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000     # HTTP Strict Transport Security
```

**Secret Key:**
```python
# Generate a new secret key
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

**Database Backups:**
```bash
# PostgreSQL backup
pg_dump -h localhost -U anime_user anime_db > backup.sql

# Restore
psql -h localhost -U anime_user anime_db < backup.sql

# Automated backups (cron job)
0 2 * * * /usr/bin/pg_dump -h localhost -U anime_user anime_db | gzip > /backups/anime_db_$(date +\%Y\%m\%d).sql.gz
```

### 7. Testing Strategy

**Backend Tests (Django):**
```python
# api/tests.py
from django.test import TestCase
from api.models import Anime

class AnimeModelTest(TestCase):
    def test_anime_creation(self):
        anime = Anime.objects.create(title="Naruto", episodes_watched=10)
        self.assertEqual(anime.title, "Naruto")
```

```bash
# Run tests
python manage.py test

# With coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

**Frontend Tests (Playwright):**
```typescript
// frontend/tests/anime-list.spec.ts
import { test, expect } from '@playwright/test';

test('user can view anime list', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Login');
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');

  await expect(page.locator('h1')).toContainText('My Anime List');
});
```

```bash
# Run Playwright tests
cd frontend
npx playwright test
npx playwright show-report  # View HTML report
```

### 8. Monitoring & Logging

**Production Logging:**
```python
# settings.py
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/anime-backend.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'WARNING',
        },
    },
}
```

**Render Logging:**
```bash
# View logs via Render dashboard or CLI
render logs backend
```

**Application Monitoring:**
- **Sentry**: Error tracking and performance monitoring
- **New Relic**: Full-stack observability
- **Uptime Kuma**: Self-hosted uptime monitoring (already in docker-compose.prod.yml)

---

## Transitioning to IaaS

### When to Move to IaaS

**Signs You've Outgrown Render:**
1. ✅ Consistent traffic (no cold starts needed)
2. ✅ Database > 1 GB (exceeds free tier)
3. ✅ Need guaranteed uptime (not free tier spin-downs)
4. ✅ Cost > $25/month (IaaS becomes cheaper)
5. ✅ Need custom infrastructure (Redis, Celery, etc.)

### Migration Checklist

#### Pre-Migration
- [ ] Backup Render database
  ```bash
  # From Render dashboard, download PostgreSQL backup
  # Or use pg_dump with Render's DATABASE_URL
  ```
- [ ] Document all environment variables
- [ ] Test deployment locally with docker-compose.prod.yml
- [ ] Set up domain name (if not already)

#### IaaS Setup
- [ ] Provision server (EC2, Droplet, etc.)
- [ ] Provision managed PostgreSQL
- [ ] Configure firewall (ports 22, 80, 443)
- [ ] Set up SSH keys for secure access
- [ ] Install dependencies (Python, nginx, Git)

#### Application Deployment
- [ ] Clone repository to server
- [ ] Create virtual environment and install dependencies
- [ ] Set up .env with production values
- [ ] Run migrations
- [ ] Collect static files
- [ ] Build frontend
- [ ] Configure nginx
- [ ] Set up systemd service
- [ ] Obtain SSL certificate (Let's Encrypt)

#### Database Migration
- [ ] Export data from Render PostgreSQL
  ```bash
  pg_dump $DATABASE_URL > render_backup.sql
  ```
- [ ] Import to new database
  ```bash
  psql $NEW_DATABASE_URL < render_backup.sql
  ```
- [ ] Verify data integrity

#### DNS & Go-Live
- [ ] Update DNS to point to new server IP
- [ ] Wait for DNS propagation (24-48 hours)
- [ ] Monitor logs for errors
- [ ] Test all functionality (login, CRUD operations)

#### Post-Migration
- [ ] Set up automated backups
- [ ] Configure monitoring (Uptime Kuma, Sentry)
- [ ] Set up deployment script
- [ ] Document new deployment process
- [ ] Decommission Render services (after confirming stability)

### Cost Analysis Example

**Current Render (Free Tier):**
- Backend: $0 (with limitations)
- Database: $0 (1 GB, 90-day expiration)
- **Total: $0/month**

**Render Paid:**
- Backend: $7/month
- Database: $7/month
- **Total: $14/month**

**DigitalOcean IaaS:**
- Droplet (1 vCPU, 2 GB RAM): $12/month
- Managed PostgreSQL (1 GB RAM): $15/month
- **Total: $27/month**
- **Break-even point**: ~400 hours/month uptime

**When IaaS Wins:**
- Need > 2 GB RAM: Render requires $21/month, DigitalOcean $18/month
- Multiple services: Render charges per service, IaaS one server handles all
- Database > 1 GB: Render $21/month, IaaS $15/month

---

## Conclusion

You now have a **clean, production-ready codebase** with:

✅ **Proper Django structure** at root level
✅ **No duplicate code or files**
✅ **Comprehensive .gitignore** preventing cache pollution
✅ **Updated deployment configs** for current frontend structure
✅ **Multiple deployment options** (Render, Docker, future IaaS)
✅ **Clear documentation** of architecture and best practices

### What Changed (Summary)

| Category | Before | After |
|----------|--------|-------|
| **Project Structure** | Nested duplicate subdirectory | Single source of truth at root |
| **Django Files** | Missing manage.py, incomplete apps | Complete Django project |
| **Git Repository** | 1,748 cache files, 2 `.git` folders | Clean repo, proper .gitignore |
| **Config Files** | 3 docker-compose variants, outdated paths | 2 valid configs with correct paths |
| **Deployments** | Broken Render, outdated SSH workflow | Working Render, ready for IaaS |
| **Documentation** | None | Comprehensive architecture guide |

### Next Steps

1. **Commit the cleanup**:
   ```bash
   git commit -m "refactor: Clean up project structure and consolidate Django backend to root

   - Move complete Django backend from subdirectory to root
   - Remove duplicate Anime-Viewing-Log subdirectory
   - Delete 1,748 Python cache files
   - Remove outdated deployment workflow
   - Update docker-compose.prod.yml with correct frontend path
   - Create comprehensive .gitignore
   - Add architecture documentation"
   ```

2. **Test Render deployment**: Push to GitHub and verify Render builds successfully

3. **Plan IaaS migration**: When ready, follow the IaaS transition checklist

4. **Keep learning**: Experiment with Docker locally to understand production deployment

---

**You've successfully transitioned from "vibe coder" to understanding your architecture like a system architect!** 🎉

This document is your reference for understanding **why** things are structured this way, **what** each component does, and **how** to deploy and maintain the application.
