import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all prompt chains (with filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const industry = searchParams.get('industry');
    const tier = searchParams.get('tier');

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Determine user's access tier
    let accessTiers = ['free'];
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          purchases: {
            where: { status: 'completed' },
            include: { pricingTier: true },
          },
        },
      });

      if (user?.purchases.length) {
        const highestTier = user.purchases.reduce((highest, p) => {
          const tierOrder = { free: 0, starter: 1, pro: 2, complete: 3 };
          const currentOrder = tierOrder[p.pricingTier.slug as keyof typeof tierOrder] || 0;
          const highestOrder = tierOrder[highest as keyof typeof tierOrder] || 0;
          return currentOrder > highestOrder ? p.pricingTier.slug : highest;
        }, 'free');

        if (highestTier === 'complete') accessTiers = ['free', 'starter', 'pro', 'complete'];
        else if (highestTier === 'pro') accessTiers = ['free', 'starter', 'pro'];
        else if (highestTier === 'starter') accessTiers = ['free', 'starter'];
      }

      // Active subscription gives full access
      if (user?.subscriptionStatus === 'active') {
        accessTiers = ['free', 'starter', 'pro', 'complete'];
      }
    }

    const chains = await prisma.promptChain.findMany({
      where: {
        ...(category && { category }),
        ...(industry && { industry }),
        ...(tier ? { tier } : { tier: { in: accessTiers } }),
      },
      include: {
        steps: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { savedBy: true },
        },
      },
      orderBy: [
        { isPopular: 'desc' },
        { views: 'desc' },
      ],
    });

    return NextResponse.json({
      success: true,
      chains,
      accessTiers,
    });
  } catch (error: unknown) {
    console.error('Chains fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chains';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Save a chain to user's collection
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please sign in to save chains' },
        { status: 401 }
      );
    }

    const { chainId, customVariables } = await request.json();

    if (!chainId) {
      return NextResponse.json(
        { error: 'Chain ID is required' },
        { status: 400 }
      );
    }

    // Check if chain exists
    const chain = await prisma.promptChain.findUnique({
      where: { id: chainId },
    });

    if (!chain) {
      return NextResponse.json(
        { error: 'Chain not found' },
        { status: 404 }
      );
    }

    // Upsert saved chain
    const savedChain = await prisma.savedChain.upsert({
      where: {
        userId_chainId: {
          userId: session.user.id,
          chainId,
        },
      },
      update: {
        customVariables: customVariables || null,
      },
      create: {
        userId: session.user.id,
        chainId,
        customVariables: customVariables || null,
      },
    });

    return NextResponse.json({
      success: true,
      savedChain,
    });
  } catch (error: unknown) {
    console.error('Save chain error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save chain';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
