import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  });
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { tierId, billingType } = await request.json();

    if (!tierId || !billingType) {
      return NextResponse.json(
        { error: 'Missing required fields: tierId and billingType' },
        { status: 400 }
      );
    }

    // Verify pricing tier exists
    const pricingTier = await prisma.pricingTier.findUnique({
      where: { id: tierId },
    });

    if (!pricingTier) {
      return NextResponse.json(
        { error: 'Pricing tier not found' },
        { status: 404 }
      );
    }

    const stripe = getStripe();

    // Get or create Stripe customer
    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Calculate price based on billing type
    let amount = pricingTier.price;
    let mode: 'payment' | 'subscription' = 'payment';
    let priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData;

    if (billingType === 'monthly') {
      amount = 19; // $19/month
      mode = 'subscription';
      priceData = {
        currency: 'usd',
        product_data: {
          name: `${pricingTier.name} - Monthly`,
          description: `Monthly access to ${pricingTier.promptCount}+ prompts and AI optimizer`,
        },
        unit_amount: Math.round(amount * 100),
        recurring: {
          interval: 'month',
        },
      };
    } else if (billingType === 'annual') {
      amount = 149; // $149/year (save $79)
      mode = 'subscription';
      priceData = {
        currency: 'usd',
        product_data: {
          name: `${pricingTier.name} - Annual`,
          description: `Annual access to ${pricingTier.promptCount}+ prompts and AI optimizer (save $79/year)`,
        },
        unit_amount: Math.round(amount * 100),
        recurring: {
          interval: 'year',
        },
      };
    } else {
      // One-time / lifetime
      amount = pricingTier.price;
      mode = 'payment';
      priceData = {
        currency: 'usd',
        product_data: {
          name: `${pricingTier.name} - Lifetime`,
          description: pricingTier.description,
        },
        unit_amount: Math.round(amount * 100),
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        pricingTierId: tierId,
        billingType,
      },
      subscription_data: mode === 'subscription' ? {
        metadata: {
          userId: session.user.id,
          pricingTierId: tierId,
          billingType,
        },
      } : undefined,
    });

    // Create pending purchase record
    await prisma.purchase.create({
      data: {
        userId: session.user.id,
        pricingTierId: tierId,
        amount,
        status: 'pending',
        billingType,
        stripeSessionId: checkoutSession.id,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: unknown) {
    console.error('Subscription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
