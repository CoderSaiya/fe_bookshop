#!/bin/sh
set -e

POSTGRES_HOST="${POSTGRES_HOST:-postgres}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"

echo "Starting Next.js production server..."
echo "Waiting for database to be ready..."

until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Waiting for database..."
  sleep 2
done

echo "Database is ready!"
echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Running seed data..."
npm run db:seed

echo "Starting Next.js production server..."
exec npm start
