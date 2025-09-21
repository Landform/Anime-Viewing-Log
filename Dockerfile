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

# Create a non-root user for security
RUN addgroup --system app && adduser --system --group app

# Set the working directory
WORKDIR /home/app

# Copy the installed dependencies from the builder stage
COPY --from=builder /usr/src/app/wheels /wheels
COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install --no-cache /wheels/*

# Copy the application code
COPY . .

# Change ownership of the files to the non-root user
RUN chown -R app:app /home/app

# Switch to the non-root user
USER app

# Expose the port
EXPOSE 8000

# Run the application with Gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]