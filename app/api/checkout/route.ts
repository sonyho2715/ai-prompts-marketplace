import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}

// Zod schema for checkout request validation
const checkoutSchema = z.object({
  tierSlug: z.string().min(1, 'Tier slug is required'),
  tierId: z.string().min(1, 'Tier ID is required'),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse and validate request body with Zod
    const body = await request.json()
    const validationResult = checkoutSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { tierSlug, tierId } = validationResult.data

    // Verify pricing tier exists and get the ACTUAL price from database
    // SECURITY: Never trust price from client - always fetch from database
    const pricingTier = await prisma.pricingTier.findUnique({
      where: { id: tierId },
    })

    if (!pricingTier) {
      return NextResponse.json(
        { error: 'Pricing tier not found' },
        { status: 404 }
      )
    }

    // Verify the slug matches (extra security check)
    if (pricingTier.slug !== tierSlug) {
      return NextResponse.json(
        { error: 'Tier mismatch' },
        { status: 400 }
      )
    }

    // Use the price from database, not from client request
    const amount = pricingTier.price

    // Skip Stripe for free tiers
    if (amount === 0) {
      // Create completed purchase directly for free tier
      await prisma.purchase.create({
        data: {
          userId: session.user.id,
          pricingTierId: tierId,
          amount: 0,
          status: 'completed',
        },
      })

      return NextResponse.json({
        success: true,
        free: true,
        redirectUrl: '/checkout/success?free=true'
      })
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add your Stripe keys to .env file.' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session with price from database
    const stripe = getStripe()
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: pricingTier.name,
              description: pricingTier.description,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents - using DB price
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?tier=${tierSlug}`,
      customer_email: session.user.email || undefined,
      metadata: {
        userId: session.user.id,
        pricingTierId: tierId,
        tierSlug: tierSlug,
      },
    })

    // Create pending purchase record with database price
    await prisma.purchase.create({
      data: {
        userId: session.user.id,
        pricingTierId: tierId,
        amount: amount, // Using verified price from database
        status: 'pending',
        stripeSessionId: checkoutSession.id,
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    })
  } catch (error: unknown) {
    console.error('Checkout error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
