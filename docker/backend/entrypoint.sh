#!/bin/sh
set -e

echo "=== RISTCON Backend Startup ==="

# ===========================================
# Wait for database to be ready
# ===========================================
echo "Waiting for database connection..."
max_tries=30
counter=0

while ! mysql -h"${DB_HOST:-db}" -u"${DB_USERNAME}" -p"${DB_PASSWORD}" --skip-ssl -e "SELECT 1" > /dev/null 2>&1; do
    counter=$((counter+1))
    if [ $counter -ge $max_tries ]; then
        echo "ERROR: Database connection failed after $max_tries attempts"
        exit 1
    fi
    echo "Waiting for database... ($counter/$max_tries)"
    sleep 2
done

echo "Database is ready!"

# ===========================================
# Generate application key if not set
# ===========================================
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
    echo "Generating application key..."
    php artisan key:generate --force
fi

# ===========================================
# Run migrations
# ===========================================
echo "Running database migrations..."
php artisan migrate --force

# ===========================================
# Optimize for production
# ===========================================
echo "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# ===========================================
# Fix storage permissions
# ===========================================
echo "Setting storage permissions..."
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# ===========================================
# Create storage link
# ===========================================
echo "Creating storage link..."
php artisan storage:link --force 2>/dev/null || true

echo "=== Starting services ==="

# Start supervisord (manages PHP-FPM and Nginx)
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
