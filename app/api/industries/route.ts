import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Get all industries
export async function GET() {
  try {
    const industries = await prisma.industry.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      industries,
    });
  } catch (error: unknown) {
    console.error('Industries fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch industries';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Update user's industry preference
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please sign in to update preferences' },
        { status: 401 }
      );
    }

    const { industry } = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { industry },
      select: {
        id: true,
        industry: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    console.error('Update industry error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update industry';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
