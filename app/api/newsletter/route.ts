import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
  try {
    const { email, name, industry, source } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed!',
          alreadySubscribed: true,
        });
      }
      // Reactivate subscription
      await prisma.newsletter.update({
        where: { email },
        data: { isActive: true, industry, name },
      });
    } else {
      // Create new subscription
      await prisma.newsletter.create({
        data: {
          email,
          name: name || null,
          industry: industry || null,
          source: source || 'website',
        },
      });
    }

    // Send welcome email if Resend is configured
    if (resend) {
      try {
        await resend.emails.send({
          from: 'AI Prompts Marketplace <hello@yourdomain.com>',
          to: email,
          subject: 'Welcome to AI Prompts Weekly!',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a1a1a;">Welcome${name ? `, ${name}` : ''}!</h1>
              <p>Thanks for subscribing to AI Prompts Weekly. Every week, you'll receive:</p>
              <ul>
                <li>3-5 high-quality AI prompts</li>
                <li>Tips for better prompt engineering</li>
                <li>Industry-specific prompt strategies</li>
                <li>Early access to new features</li>
              </ul>
              <p>Here's a free prompt to get you started:</p>
              <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <strong>The "Expert Advisor" Framework:</strong>
                <p style="font-family: monospace; font-size: 14px;">
                  "You are an expert [ROLE] with 20+ years of experience.
                  I need help with [TASK]. My current situation is [CONTEXT].
                  Please provide actionable advice with specific examples.
                  Start by asking me 2-3 clarifying questions before giving recommendations."
                </p>
              </div>
              <p>See you in your inbox soon!</p>
              <p>- The AI Prompts Team</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the subscription if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to the newsletter!',
    });
  } catch (error: unknown) {
    console.error('Newsletter subscription error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to subscribe';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// Unsubscribe endpoint
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
