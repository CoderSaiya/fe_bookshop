#!/bin/sh
set -e

echo "Starting Next.js production server..."
echo "Waiting for database to be ready..."

# Wait for DB ready
until pg_isready -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U ${POSTGRES_USER}; do
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
