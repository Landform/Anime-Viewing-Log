# Use official Python image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . .

COPY entrypoint.sh /home/app/entrypoint.sh
# Make the script executable
RUN chmod +x /home/app/entrypoint.sh
# --- NEW LINES END HERE ---

RUN chown -R app:app /home/app
USER app
EXPOSE 8000

# --- CHANGE THIS LINE ---
# Change the CMD to run our new entrypoint script
CMD ["/home/app/entrypoint.sh"]