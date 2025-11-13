# AI Prompts Pro - Marketplace

A full-featured AI prompts marketplace built with Next.js, featuring 1,000+ curated prompts across 10 categories.

## Features

- 🎯 **1,000+ AI Prompts** - Expertly crafted prompts for ChatGPT, Claude, Midjourney, DALL-E, and more
- 📁 **10 Categories** - Marketing, Content Writing, Business, Programming, Design, Education, Data Analytics, Customer Support, SEO, and Personal Development
- 🔐 **Authentication** - Secure user registration and login with NextAuth.js
- 💳 **Stripe Integration** - Secure payment processing for prompt packages
- 🎨 **Beautiful UI** - Modern, responsive design with dark mode support
- 🔍 **Advanced Search** - Filter by category, tier, difficulty, and AI model
- 📊 **User Dashboard** - Manage purchases and access your prompts
- 🎁 **Tiered Pricing** - Free (20 prompts), Starter ($29, 200 prompts), Pro ($79, 500 prompts), Complete ($149, 1000 prompts)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Deployment:** Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use Prisma local dev server)
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
cd ai-prompts-marketplace
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

The `.env` file already has a local database URL configured. Update it with your Stripe keys:

```bash
# Database (already configured for local Prisma Postgres)
DATABASE_URL="prisma+postgres://localhost:51213/..."

# NextAuth (already configured)
NEXTAUTH_SECRET="ai-prompts-marketplace-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Stripe - ADD YOUR KEYS HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # For production webhooks
```

**Get Stripe Keys:**
- Sign up at https://stripe.com
- Go to Developers → API keys
- Copy your Publishable key and Secret key
- For webhooks: Developers → Webhooks → Add endpoint → Use `/api/webhook/stripe`

4. **Start the database**
```bash
npx prisma dev
```

5. **Run database migrations**
```bash
npx prisma migrate dev
```

6. **Seed the database**
```bash
npm run db:seed
```

This will create:
- 10 categories
- 4 pricing tiers
- 1,000 AI prompts

7. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your marketplace!

## Project Structure

```
ai-prompts-marketplace/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth API routes
│   │   ├── checkout/       # Stripe checkout
│   │   └── webhook/        # Stripe webhooks
│   ├── checkout/           # Checkout pages
│   ├── dashboard/          # User dashboard
│   ├── login/              # Auth pages
│   ├── prompts/            # Browse prompts
│   └── page.tsx            # Landing page
├── components/             # React components
├── lib/                    # Utilities
│   ├── auth.ts            # NextAuth config
│   └── prisma.ts          # Prisma client
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
└── types/                 # TypeScript types
```

## Key Pages

- `/` - Landing page with pricing tiers
- `/prompts` - Browse all prompts with filters
- `/prompts/[id]` - Individual prompt details
- `/login` - User authentication
- `/checkout` - Purchase prompts
- `/dashboard` - User dashboard with purchases

## Database Schema

- **User** - User accounts and authentication
- **Category** - Prompt categories (Marketing, Design, etc.)
- **Prompt** - Individual AI prompts
- **PricingTier** - Pricing packages (Free, Starter, Pro, Complete)
- **Purchase** - User purchases and access control

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Database Options

- **Local Development:** Use Prisma local dev server (already configured)
- **Production:** Use Railway, Supabase, or any PostgreSQL provider
  - Update `DATABASE_URL` in Vercel environment variables

### Stripe Webhooks

For production, set up a webhook endpoint:
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select event: `checkout.session.completed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET` env variable

## Customization

### Add More Prompts

Edit `prisma/seed.ts` and run:
```bash
npm run db:seed
```

### Update Pricing

Modify pricing tiers in `prisma/seed.ts` or directly in the database.

### Change Categories

Update categories in `prisma/seed.ts` with your own icons and descriptions.

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
