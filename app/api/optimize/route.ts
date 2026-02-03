'use server';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

// Industry-specific context for prompt optimization
const industryContexts: Record<string, string> = {
  'small-business': 'a small business owner who needs practical, actionable results with limited resources',
  'real-estate': 'a real estate professional focused on property listings, client communication, and market analysis',
  'ecommerce': 'an e-commerce seller focused on product descriptions, customer service, and conversion optimization',
  'marketing-agency': 'a marketing agency professional managing multiple clients and campaigns',
  'freelancer': 'a freelancer who needs to manage clients, projects, and personal branding',
  'healthcare': 'a healthcare professional focused on patient communication and medical documentation',
  'education': 'an educator creating learning materials and student engagement strategies',
  'legal': 'a legal professional working with contracts, documentation, and client communication',
  'finance': 'a finance professional dealing with analysis, reports, and client advisory',
  'tech-startup': 'a tech startup founder focused on product development, fundraising, and growth',
};

// AI model-specific optimization tips
const aiModelTips: Record<string, string> = {
  'ChatGPT': 'Use clear role assignments, provide examples, and structure output with markdown formatting.',
  'Claude': 'Leverage thinking through complex problems, provide context, and use XML tags for structured output.',
  'Midjourney': 'Use concise visual descriptions, specify style and mood, include technical parameters like --ar, --v.',
  'DALL-E': 'Be specific about composition, lighting, and style. Mention what NOT to include.',
  'Gemini': 'Provide detailed context, use step-by-step instructions, and specify output format clearly.',
  'Copilot': 'Include language/framework context, specify coding standards, and provide example signatures.',
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Please sign in to use the AI Optimizer' },
        { status: 401 }
      );
    }

    // Check user's subscription and usage limits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        purchases: {
          where: { status: 'completed' },
          include: { pricingTier: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has access to optimizer (Pro tier or higher, or active subscription)
    const hasAccess = user.purchases.some(p =>
      p.pricingTier.aiOptimizer ||
      ['pro', 'complete'].includes(p.pricingTier.slug)
    ) || user.subscriptionStatus === 'active';

    // Check monthly usage for limited tiers
    if (hasAccess) {
      const activeTier = user.purchases[0]?.pricingTier;
      if (activeTier?.optimizerLimit && activeTier.optimizerLimit > 0) {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyUsage = await prisma.optimizerUsage.count({
          where: {
            userId: user.id,
            createdAt: { gte: startOfMonth },
          },
        });

        if (monthlyUsage >= activeTier.optimizerLimit) {
          return NextResponse.json(
            {
              error: 'Monthly optimizer limit reached',
              limit: activeTier.optimizerLimit,
              used: monthlyUsage,
            },
            { status: 429 }
          );
        }
      }
    }

    // Allow 3 free optimizations for non-premium users
    if (!hasAccess) {
      const totalUsage = await prisma.optimizerUsage.count({
        where: { userId: user.id },
      });

      if (totalUsage >= 3) {
        return NextResponse.json(
          {
            error: 'Free optimization limit reached. Upgrade to Pro for unlimited access.',
            upgradeRequired: true,
          },
          { status: 403 }
        );
      }
    }

    const { userPrompt, targetAI, industry } = await request.json();

    if (!userPrompt || !targetAI) {
      return NextResponse.json(
        { error: 'Missing required fields: userPrompt and targetAI' },
        { status: 400 }
      );
    }

    const industryContext = industry ? industryContexts[industry] || industry : '';
    const aiTips = aiModelTips[targetAI] || '';

    const systemPrompt = `You are an expert prompt engineer specializing in optimizing prompts for AI models. Your task is to take a user's rough prompt and transform it into a highly effective, well-structured prompt that will produce excellent results.

${industryContext ? `The user is ${industryContext}. Tailor the prompt to their specific context and needs.` : ''}

${aiTips ? `Optimization tips for ${targetAI}: ${aiTips}` : ''}

When optimizing, apply these principles:
1. Add clear role/persona assignment
2. Provide specific context and constraints
3. Define the expected output format
4. Include examples when helpful
5. Add guardrails to prevent unwanted outputs
6. Use the RACE framework: Role, Action, Context, Examples
7. Make the prompt specific enough to avoid generic responses

Return ONLY the optimized prompt, no explanations or meta-commentary.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Please optimize this prompt for ${targetAI}:

---
${userPrompt}
---

Provide the optimized version that will produce better, more specific results.`,
        },
      ],
      system: systemPrompt,
    });

    const optimizedPrompt = response.content[0].type === 'text'
      ? response.content[0].text
      : '';

    // Track usage
    await prisma.optimizerUsage.create({
      data: {
        userId: user.id,
        inputPrompt: userPrompt,
        outputPrompt: optimizedPrompt,
        targetAI,
        industry: industry || null,
        tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      },
    });

    return NextResponse.json({
      success: true,
      optimizedPrompt,
      targetAI,
      industry,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
    });
  } catch (error: unknown) {
    console.error('Optimizer error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to optimize prompt';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
