# AI Prompts Marketplace

## Project Overview
Marketplace for buying and selling AI prompts. Features authentication, payments, and both Prisma and Supabase.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** Prisma + Supabase (hybrid)
- **Auth:** NextAuth v4 + @auth/prisma-adapter
- **Payments:** Stripe
- **Icons:** Lucide React

## Hybrid Database Approach
Uses BOTH Prisma and Supabase:
- **Prisma:** User data, transactions
- **Supabase:** File storage, real-time features

```typescript
// Prisma for structured data
import { db } from '@/lib/db';

// Supabase for storage/realtime
import { createClient } from '@supabase/supabase-js';
```

## Key Features
- Prompt listings marketplace
- User accounts (NextAuth)
- Stripe payments
- Prompt categories and search

## Database Commands
```bash
npm run db:seed    # Seed database
```

## Auth Pattern
Uses NextAuth (v4):
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL for Prisma
- `NEXTAUTH_SECRET` - NextAuth secret
- `NEXTAUTH_URL` - Auth callback URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase key
- `STRIPE_SECRET_KEY` - Stripe
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe frontend

## Deployment
- **Hosting:** Vercel
- **Database:** Railway PostgreSQL + Supabase

## Notes
- Hybrid Prisma + Supabase architecture
- Uses NextAuth (not iron-session)
- Full marketplace with payments
- Good reference for multi-database patterns
