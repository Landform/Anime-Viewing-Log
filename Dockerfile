# =========================================================================
# STAGE 1: Build the React/Vite Frontend
# We use a Node.js image just for this stage. It will be discarded later.
# The "AS frontend_builder" gives this stage a name we can reference later.
# =========================================================================
FROM node:20-alpine AS frontend_builder

# Set the working directory inside the container for the frontend build
WORKDIR /app/frontend

# Copy package.json and package-lock.json first to leverage Docker's caching.
# This step only re-runs if these files change.
COPY frontend/package*.json ./
RUN npm ci

# Copy the rest of the frontend source code
COPY frontend/ .

# Run the build script defined in your frontend/package.json
# This creates the optimized static files in the /app/frontend/dist/ folder.
RUN npm run build


# =========================================================================
# STAGE 2: Build the Python Dependencies
# We use a Python image to pre-compile dependencies into "wheels".
# This makes the final installation faster and more reliable.
# The "AS backend_builder" gives this stage a name.
# =========================================================================
FROM python:3.11-slim as backend_builder

WORKDIR /usr/src/app

# Set Python environment variables for best practices
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN pip install --upgrade pip

# Copy and install requirements into a "wheels" directory
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /usr/src/app/wheels -r requirements.txt


# =========================================================================
# STAGE 3: Final Production Image
# This is the actual container that will be deployed. It's built from a
# clean, lightweight Python image.
# =========================================================================
FROM python:3.11-slim

# Install system dependencies (like the PostgreSQL client) and create a non-root user for security
RUN apt-get update && apt-get install -y postgresql-client && \
    addgroup --system app && adduser --system --group app

WORKDIR /home/app

# --- Assemble the Application ---

# 1. Copy the pre-built Python wheels from the 'backend_builder' stage
COPY --from=backend_builder /usr/src/app/wheels /wheels
COPY --from=backend_builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# 2. Copy the built React/Vite static files from the 'frontend_builder' stage
# This is the most critical step. It takes the '/dist' folder from the first stage
# and places it where your Django settings expect to find it.
COPY --from=frontend_builder /app/frontend/dist /home/app/frontend/dist

# 3. Copy your backend application code into the final image
COPY . .

# --- Final Configuration ---

# Set permissions for the staticfiles directory that 'collectstatic' will use
RUN mkdir -p /home/app/staticfiles && chown -R app:app /home/app/staticfiles

# Set ownership of all files to the non-root user
RUN chown -R app:app /home/app

# Switch to the non-root user
USER app

# Expose the port your Gunicorn server will run on
EXPOSE 8000

# The command to run your application
# Note: Free services like Render or Fly.io can run 'collectstatic' for you
# as a separate "build command" before starting the server.
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]