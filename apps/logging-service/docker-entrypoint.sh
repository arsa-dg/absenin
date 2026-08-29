#!/bin/sh
set -e

echo "Running migrations for logging-service..."
npm run migration:run:prod

echo "Starting logging-service server..."
exec "$@"