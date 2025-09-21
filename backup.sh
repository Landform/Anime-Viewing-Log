#!/bin/bash

# --- Configuration ---
# The name of your database container, as defined in docker-compose.yml
CONTAINER_NAME="anime-viewing-log-db-1" 

# The database credentials from your .env file
DB_NAME="anime_db"
DB_USER="anime_user"

# The directory on your HOST machine where you want to save backups
BACKUP_DIR="./backups"

# The filename for the backup, with a timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="$BACKUP_DIR/backup-$TIMESTAMP.sql"

# --- Script Logic ---

# 1. Create the backup directory if it doesn't exist
echo "Creating backup directory if it doesn't exist..."
mkdir -p $BACKUP_DIR

# 2. Execute the pg_dump command INSIDE the container
echo "Creating database backup..."
docker exec -t $CONTAINER_NAME pg_dumpall -c -U $DB_USER > $FILENAME

# 3. Check if the backup was successful
if [ $? -eq 0 ]; then
  echo "Database backup successful!"
  echo "File saved to: $FILENAME"
else
  echo "ERROR: Database backup failed."
  # Optional: remove the failed (and likely empty) backup file
  rm $FILENAME
  exit 1
fi

# 4. (Optional) Prune old backups, keeping the last 7
echo "Pruning old backups, keeping the last 7..."
ls -tp $BACKUP_DIR | grep -v '/$' | tail -n +8 | xargs -I {} rm -- $BACKUP_DIR/{}

echo "Backup process complete."
exit 0