#!/bin/bash

# AI Prompts Marketplace - Railway Deployment Script
# This script will migrate and seed your Railway PostgreSQL database

echo "🚀 AI Prompts Marketplace - Railway Deployment"
echo "=============================================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set"
  echo ""
  echo "Please set it first:"
  echo "export DATABASE_URL='postgresql://...'"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Run migrations
echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi

echo "✅ Migrations completed successfully"
echo ""

# Seed database
echo "🌱 Seeding database with 1000 prompts..."
npx tsx prisma/seed.ts

if [ $? -ne 0 ]; then
  echo "❌ Seeding failed!"
  exit 1
fi

echo ""
echo "✅ Database seeded successfully!"
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your Railway database is ready with:"
echo "  - 10 categories"
echo "  - 4 pricing tiers"
echo "  - 1000 AI prompts"
echo "  - Test account (test@example.com / password123)"
echo ""
