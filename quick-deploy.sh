#!/bin/bash

echo "🚀 AI Prompts Marketplace - Quick Deploy"
echo "========================================"
echo ""

# Check for DATABASE_URL argument
if [ -z "$1" ]; then
  echo "❌ Usage: ./quick-deploy.sh 'postgresql://...'"
  echo ""
  echo "Get your database URL from:"
  echo "  Railway: https://railway.app/project/5663a803-ed8e-4949-9dd8-5772a9e7606f"
  echo "  OR"
  echo "  Neon: https://neon.tech (Create new project → Copy connection string)"
  exit 1
fi

DATABASE_URL="$1"
NEXTAUTH_SECRET="***REMOVED***"

echo "📦 Step 1/4: Running database migrations..."
DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi
echo "✅ Migrations complete"
echo ""

echo "🌱 Step 2/4: Seeding database with 1000 prompts..."
DATABASE_URL="$DATABASE_URL" npx tsx prisma/seed.ts
if [ $? -ne 0 ]; then
  echo "❌ Seeding failed!"
  exit 1
fi
echo "✅ Database seeded"
echo ""

echo "🚀 Step 3/4: Deploying to Vercel..."
vercel --prod --yes \
  -e DATABASE_URL="$DATABASE_URL" \
  -e NEXTAUTH_SECRET="$NEXTAUTH_SECRET" \
  -e NEXTAUTH_URL="https://ai-prompts-marketplace.vercel.app"

if [ $? -ne 0 ]; then
  echo "❌ Vercel deployment failed!"
  exit 1
fi
echo "✅ Deployed to Vercel"
echo ""

echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "🔗 Your site is live at:"
echo "   https://ai-prompts-marketplace.vercel.app"
echo ""
echo "🔑 Test Account:"
echo "   Email: test@example.com"
echo "   Password: password123"
echo ""
