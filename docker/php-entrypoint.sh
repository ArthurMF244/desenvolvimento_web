#!/bin/sh
set -eu

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Executando migrations..."
    php /var/www/html/database/migrate.php
fi

exec "$@"
