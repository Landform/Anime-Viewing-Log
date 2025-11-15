# --- Build Stage ---
# This stage builds our Python dependencies
FROM python:3.11-slim as builder

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install build dependencies
RUN pip install --upgrade pip

# Copy and install requirements
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /usr/src/app/wheels -r requirements.txt


# --- Final Stage ---
# This stage builds the final, lightweight production image
FROM python:3.11-slim

WORKDIR /home/app

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# Copy the application code and the entrypoint script
COPY . .
COPY entrypoint.sh /home/app/entrypoint.sh
RUN chmod +x /home/app/entrypoint.sh

# Create a non-root user *after* all files are copied
RUN addgroup --system app && adduser --system --group app

# Change ownership of the files to the new user
RUN chown -R app:app /home/app

# Switch to the non-root user for security
USER app

# Expose the port Gunicorn will listen on inside the container
EXPOSE 8000

# Run the entrypoint script as the startup command
CMD ["/home/app/entrypoint.sh"]