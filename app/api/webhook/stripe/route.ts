import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
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
    // Validate webhook secret is configured
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      const stripe = getStripe()
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Webhook signature verification failed:', errorMessage)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle checkout.session.completed (both one-time and subscription initial payment)
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, pricingTierId, billingType } = session.metadata || {}

      if (!userId || !pricingTierId) {
        console.error('Missing metadata in checkout session')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      // Update purchase record
      await prisma.purchase.updateMany({
        where: {
          stripeSessionId: session.id,
          userId: userId,
        },
        data: {
          status: 'completed',
          stripePaymentId: session.payment_intent as string || null,
          stripeSubscriptionId: session.subscription as string || null,
        },
      })

      // If this is a subscription, update user's subscription status
      if (billingType === 'monthly' || billingType === 'annual') {
        const subscriptionEndDate = billingType === 'monthly'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)  // 30 days
          : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 365 days

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'active',
            subscriptionTier: billingType,
            subscriptionEndDate,
          },
        })
      }

      console.log('Purchase completed for user:', userId, 'billing:', billingType)
    }

    // Handle subscription updates
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (userId) {
        const status = subscription.status === 'active' ? 'active'
          : subscription.status === 'past_due' ? 'past_due'
          : 'canceled'

        // Get the current period end from the subscription
        const currentPeriodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: status,
            subscriptionEndDate: currentPeriodEnd ? new Date(currentPeriodEnd * 1000) : null,
          },
        })

        console.log('Subscription updated for user:', userId, 'status:', status)
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.userId

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'canceled',
          },
        })

        // Update purchase record
        await prisma.purchase.updateMany({
          where: {
            stripeSubscriptionId: subscription.id,
            userId: userId,
          },
          data: {
            status: 'canceled',
          },
        })

        console.log('Subscription canceled for user:', userId)
      }
    }

    // Handle failed payments
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      })

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: 'past_due',
          },
        })

        console.log('Payment failed for user:', user.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
