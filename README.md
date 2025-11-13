# 🤖 AI Prompts Marketplace

A premium marketplace for 1,000+ high-quality AI prompts built with Next.js 16, Prisma, NextAuth, and Stripe.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192)

## ✨ Features

- **1000+ AI Prompts** across 10 categories (Marketing, Sales, Content Writing, Business Strategy, Programming, Design, Productivity, Customer Support, Career, Personal Growth)
- **Modern UI/UX** with gradient design (blue → purple → pink) and glassmorphism effects
- **Authentication** with NextAuth.js (Credentials + JWT)
- **Payment Processing** with Stripe (4 pricing tiers)
- **Advanced Filtering** by category, tier, AI model, difficulty
- **Responsive Design** mobile-first approach
- **Premium Features** locked content, purchase history, dashboard

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Railway)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/sonyho2715/ai-prompts-marketplace.git
cd ai-prompts-marketplace

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run migrations
npx prisma migrate dev

# Seed database
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

## 🌐 Deployment

### Railway Database

1. Create a new PostgreSQL database on [Railway](https://railway.app)
2. Copy the `DATABASE_URL`
3. Run deployment script:

```bash
export DATABASE_URL='your-railway-database-url'
./deploy-to-railway.sh
```

### Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="generate-a-random-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## 📝 Test Account

- **Email**: test@example.com
- **Password**: password123
- **Access**: Complete tier (all 1000 prompts)

## 🎨 Design Features

- Gradient-based color scheme
- Glassmorphism effects with backdrop blur
- Premium card layouts with hover animations
- Split-screen authentication
- Activity feed dashboard
- Review and rating system (UI ready)

## 📊 Database Schema

- **Users** - Authentication and profiles
- **Categories** - 10 prompt categories
- **Prompts** - 1000 AI prompts with metadata
- **PricingTiers** - Free, Starter, Pro, Complete
- **Purchases** - User purchase history

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open Prisma Studio
- `npx prisma migrate dev` - Run migrations

## 📄 License

MIT

## 🤖 Generated with

[Claude Code](https://claude.com/claude-code)
