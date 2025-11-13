import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { tierSlug, tierId, amount } = await request.json()

    if (!tierSlug || !tierId || amount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify pricing tier exists
    const pricingTier = await prisma.pricingTier.findUnique({
      where: { id: tierId },
    })

    if (!pricingTier) {
      return NextResponse.json(
        { error: 'Pricing tier not found' },
        { status: 404 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add your Stripe keys to .env file.' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
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
            unit_amount: Math.round(amount * 100), // Convert to cents
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

    // Create pending purchase record
    await prisma.purchase.create({
      data: {
        userId: session.user.id,
        pricingTierId: tierId,
        amount: amount,
        status: 'pending',
        stripeSessionId: checkoutSession.id,
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
