#!/bin/sh
set -e

echo "Running migrations..."
npm run migration:run:prod || true

echo "Running seed..."
npm run seed:prod || true

echo "Starting server..."
exec "$@"