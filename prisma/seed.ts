import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  await prisma.prompt.deleteMany()
  await prisma.category.deleteMany()
  await prisma.pricingTier.deleteMany()

  // Create categories
  console.log('📁 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Marketing & Sales',
        slug: 'marketing-sales',
        description: 'Prompts for creating marketing copy, ad campaigns, and sales materials',
        icon: '📢',
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Content Writing',
        slug: 'content-writing',
        description: 'Blog posts, articles, social media, and creative writing prompts',
        icon: '✍️',
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business & Productivity',
        slug: 'business-productivity',
        description: 'Business plans, emails, reports, and productivity tools',
        icon: '💼',
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Programming & Development',
        slug: 'programming-development',
        description: 'Code generation, debugging, documentation, and technical prompts',
        icon: '💻',
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Design & Creative',
        slug: 'design-creative',
        description: 'Graphic design, UI/UX, Midjourney, DALL-E, and creative prompts',
        icon: '🎨',
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Education & Learning',
        slug: 'education-learning',
        description: 'Teaching materials, course creation, and learning assistance',
        icon: '📚',
        order: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Data & Analytics',
        slug: 'data-analytics',
        description: 'Data analysis, visualization, SQL queries, and reporting',
        icon: '📊',
        order: 7,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Customer Support',
        slug: 'customer-support',
        description: 'Customer service responses, FAQ generation, and support scripts',
        icon: '🤝',
        order: 8,
      },
    }),
    prisma.category.create({
      data: {
        name: 'SEO & Research',
        slug: 'seo-research',
        description: 'Keyword research, SEO optimization, and competitive analysis',
        icon: '🔍',
        order: 9,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Personal Development',
        slug: 'personal-development',
        description: 'Career advice, goal setting, and self-improvement prompts',
        icon: '🌟',
        order: 10,
      },
    }),
  ])

  // Create pricing tiers
  console.log('💰 Creating pricing tiers...')
  await Promise.all([
    prisma.pricingTier.create({
      data: {
        name: 'Free Sample',
        slug: 'free',
        description: 'Get started with 20 essential AI prompts',
        price: 0,
        promptCount: 20,
        features: [
          '20 curated prompts',
          'Basic categories',
          'Instant access',
          'Regular updates',
        ],
        isPopular: false,
        order: 1,
      },
    }),
    prisma.pricingTier.create({
      data: {
        name: 'Starter Pack',
        slug: 'starter',
        description: 'Perfect for individuals getting started with AI',
        price: 29,
        promptCount: 200,
        features: [
          '200 premium prompts',
          'All categories',
          'Lifetime access',
          'Free updates',
          'Email support',
        ],
        isPopular: false,
        order: 2,
      },
    }),
    prisma.pricingTier.create({
      data: {
        name: 'Pro Pack',
        slug: 'pro',
        description: 'Most popular choice for professionals',
        price: 79,
        promptCount: 500,
        features: [
          '500 expert prompts',
          'All categories',
          'Lifetime access',
          'Priority updates',
          'Priority support',
          'Advanced techniques',
        ],
        isPopular: true,
        order: 3,
      },
    }),
    prisma.pricingTier.create({
      data: {
        name: 'Complete Library',
        slug: 'complete',
        description: 'The ultimate AI prompts collection',
        price: 149,
        promptCount: 1000,
        features: [
          '1000+ master prompts',
          'All categories',
          'Lifetime access',
          'Instant updates',
          'VIP support',
          'Advanced techniques',
          'Bonus resources',
          'Private community',
        ],
        isPopular: false,
        order: 4,
      },
    }),
  ])

  console.log('✨ Creating prompts...')

  // Marketing & Sales Prompts
  const marketingPrompts = []
  for (let i = 1; i <= 100; i++) {
    marketingPrompts.push({
      title: `Marketing Prompt ${i}`,
      description: `Professional marketing prompt for ${['ad campaigns', 'email marketing', 'social media', 'product launches', 'brand storytelling'][i % 5]}`,
      content: `Create a compelling ${['Facebook ad', 'email sequence', 'Instagram campaign', 'product launch strategy', 'brand story'][i % 5]} for [PRODUCT/SERVICE]. Focus on [TARGET AUDIENCE] and highlight [KEY BENEFITS]. Use persuasive language that drives action.`,
      categoryId: categories[0].id,
      tags: ['marketing', 'sales', 'advertising', 'copywriting'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 30 ? 'beginner' : i <= 70 ? 'intermediate' : 'advanced',
      isFree: i <= 2,
      isPopular: i <= 5,
      tier: i <= 20 ? 'free' : i <= 40 ? 'starter' : i <= 70 ? 'pro' : 'complete',
    })
  }

  // Content Writing Prompts
  const contentPrompts = []
  for (let i = 1; i <= 150; i++) {
    contentPrompts.push({
      title: `Content Writing Prompt ${i}`,
      description: `Expert content prompt for ${['blog posts', 'articles', 'social media', 'newsletters', 'video scripts'][i % 5]}`,
      content: `Write a ${['1500-word blog post', 'engaging article', 'viral social post', 'newsletter', 'YouTube script'][i % 5]} about [TOPIC]. Target audience: [AUDIENCE]. Tone: [professional/casual/humorous]. Include SEO keywords: [KEYWORDS].`,
      categoryId: categories[1].id,
      tags: ['content', 'writing', 'blog', 'social-media'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 50 ? 'beginner' : i <= 100 ? 'intermediate' : 'advanced',
      isFree: i <= 3,
      isPopular: i <= 8,
      tier: i <= 30 ? 'free' : i <= 60 ? 'starter' : i <= 100 ? 'pro' : 'complete',
    })
  }

  // Business & Productivity Prompts
  const businessPrompts = []
  for (let i = 1; i <= 100; i++) {
    businessPrompts.push({
      title: `Business Prompt ${i}`,
      description: `Professional business prompt for ${['business plans', 'presentations', 'reports', 'emails', 'strategy'][i % 5]}`,
      content: `Generate a ${['business plan', 'presentation outline', 'quarterly report', 'professional email', 'growth strategy'][i % 5]} for [COMPANY/PROJECT]. Focus on [KEY OBJECTIVES]. Include data-driven insights and actionable recommendations.`,
      categoryId: categories[2].id,
      tags: ['business', 'productivity', 'strategy', 'management'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 30 ? 'beginner' : i <= 70 ? 'intermediate' : 'advanced',
      isFree: i <= 2,
      isPopular: i <= 5,
      tier: i <= 20 ? 'free' : i <= 40 ? 'starter' : i <= 70 ? 'pro' : 'complete',
    })
  }

  // Programming & Development Prompts
  const programmingPrompts = []
  for (let i = 1; i <= 120; i++) {
    programmingPrompts.push({
      title: `Programming Prompt ${i}`,
      description: `Technical coding prompt for ${['web development', 'debugging', 'API design', 'algorithms', 'documentation'][i % 5]}`,
      content: `${['Create a function', 'Debug this code', 'Design an API', 'Implement algorithm', 'Write documentation'][i % 5]} for [PROGRAMMING TASK]. Language: [LANGUAGE]. Requirements: [SPECIFICATIONS]. Follow best practices and include error handling.`,
      categoryId: categories[3].id,
      tags: ['programming', 'coding', 'development', 'tech'],
      aiModel: ['ChatGPT', 'Claude', 'GitHub Copilot'],
      difficulty: i <= 40 ? 'beginner' : i <= 80 ? 'intermediate' : 'advanced',
      isFree: i <= 2,
      isPopular: i <= 6,
      tier: i <= 24 ? 'free' : i <= 48 ? 'starter' : i <= 84 ? 'pro' : 'complete',
    })
  }

  // Design & Creative Prompts
  const designPrompts = []
  for (let i = 1; i <= 130; i++) {
    designPrompts.push({
      title: `Design Prompt ${i}`,
      description: `Creative design prompt for ${['Midjourney', 'DALL-E', 'UI/UX', 'branding', 'illustrations'][i % 5]}`,
      content: `Generate ${['a photorealistic image', 'UI design', 'brand identity', 'illustration', 'graphic design'][i % 5]} of [SUBJECT]. Style: [STYLE]. Colors: [COLOR PALETTE]. Mood: [MOOD]. Technical details: [SPECIFICATIONS].`,
      categoryId: categories[4].id,
      tags: ['design', 'creative', 'art', 'visual'],
      aiModel: ['Midjourney', 'DALL-E', 'Stable Diffusion', 'ChatGPT'],
      difficulty: i <= 40 ? 'beginner' : i <= 90 ? 'intermediate' : 'advanced',
      isFree: i <= 3,
      isPopular: i <= 7,
      tier: i <= 26 ? 'free' : i <= 52 ? 'starter' : i <= 91 ? 'pro' : 'complete',
    })
  }

  // Education & Learning Prompts
  const educationPrompts = []
  for (let i = 1; i <= 100; i++) {
    educationPrompts.push({
      title: `Education Prompt ${i}`,
      description: `Learning prompt for ${['lesson plans', 'quizzes', 'explanations', 'courses', 'tutoring'][i % 5]}`,
      content: `Create ${['a lesson plan', 'quiz questions', 'an explanation', 'course outline', 'tutoring session'][i % 5]} for [SUBJECT]. Level: [GRADE/SKILL LEVEL]. Learning objectives: [OBJECTIVES]. Include interactive elements.`,
      categoryId: categories[5].id,
      tags: ['education', 'teaching', 'learning', 'training'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 35 ? 'beginner' : i <= 70 ? 'intermediate' : 'advanced',
      isFree: i <= 2,
      isPopular: i <= 5,
      tier: i <= 20 ? 'free' : i <= 40 ? 'starter' : i <= 70 ? 'pro' : 'complete',
    })
  }

  // Data & Analytics Prompts
  const dataPrompts = []
  for (let i = 1; i <= 80; i++) {
    dataPrompts.push({
      title: `Data Analytics Prompt ${i}`,
      description: `Data analysis prompt for ${['SQL queries', 'visualization', 'reporting', 'insights', 'forecasting'][i % 5]}`,
      content: `${['Write SQL query', 'Create visualization', 'Generate report', 'Analyze data', 'Forecast trends'][i % 5]} for [DATASET/METRIC]. Focus on [KEY METRICS]. Output format: [FORMAT]. Include actionable insights.`,
      categoryId: categories[6].id,
      tags: ['data', 'analytics', 'sql', 'reporting'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 25 ? 'beginner' : i <= 55 ? 'intermediate' : 'advanced',
      isFree: i <= 2,
      isPopular: i <= 4,
      tier: i <= 16 ? 'free' : i <= 32 ? 'starter' : i <= 56 ? 'pro' : 'complete',
    })
  }

  // Customer Support Prompts
  const supportPrompts = []
  for (let i = 1; i <= 70; i++) {
    supportPrompts.push({
      title: `Customer Support Prompt ${i}`,
      description: `Support prompt for ${['response templates', 'FAQ', 'troubleshooting', 'escalation', 'feedback'][i % 5]}`,
      content: `Create ${['response template', 'FAQ section', 'troubleshooting guide', 'escalation process', 'feedback survey'][i % 5]} for [PRODUCT/SERVICE]. Tone: [empathetic/professional]. Address [COMMON ISSUES].`,
      categoryId: categories[7].id,
      tags: ['support', 'customer-service', 'help', 'communication'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 25 ? 'beginner' : i <= 50 ? 'intermediate' : 'advanced',
      isFree: i <= 2,
      isPopular: i <= 4,
      tier: i <= 14 ? 'free' : i <= 28 ? 'starter' : i <= 49 ? 'pro' : 'complete',
    })
  }

  // SEO & Research Prompts
  const seoPrompts = []
  for (let i = 1; i <= 80; i++) {
    seoPrompts.push({
      title: `SEO & Research Prompt ${i}`,
      description: `SEO prompt for ${['keyword research', 'meta descriptions', 'content optimization', 'competitor analysis', 'link building'][i % 5]}`,
      content: `${['Research keywords', 'Write meta description', 'Optimize content', 'Analyze competitors', 'Plan link strategy'][i % 5]} for [TOPIC/NICHE]. Target: [SEARCH INTENT]. Include long-tail keywords and ranking opportunities.`,
      categoryId: categories[8].id,
      tags: ['seo', 'research', 'keywords', 'optimization'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 25 ? 'beginner' : i <= 55 ? 'intermediate' : 'advanced',
      isFree: i <= 1,
      isPopular: i <= 4,
      tier: i <= 16 ? 'free' : i <= 32 ? 'starter' : i <= 56 ? 'pro' : 'complete',
    })
  }

  // Personal Development Prompts
  const personalPrompts = []
  for (let i = 1; i <= 70; i++) {
    personalPrompts.push({
      title: `Personal Development Prompt ${i}`,
      description: `Self-improvement prompt for ${['goal setting', 'career advice', 'habit building', 'mindfulness', 'coaching'][i % 5]}`,
      content: `Help me ${['set SMART goals', 'plan career growth', 'build better habits', 'practice mindfulness', 'develop skills'][i % 5]} for [AREA OF LIFE]. Current situation: [CONTEXT]. Desired outcome: [GOAL].`,
      categoryId: categories[9].id,
      tags: ['personal-development', 'self-improvement', 'goals', 'growth'],
      aiModel: ['ChatGPT', 'Claude'],
      difficulty: i <= 25 ? 'beginner' : i <= 50 ? 'intermediate' : 'advanced',
      isFree: i <= 1,
      isPopular: i <= 3,
      tier: i <= 14 ? 'free' : i <= 28 ? 'starter' : i <= 49 ? 'pro' : 'complete',
    })
  }

  // Combine all prompts
  const allPrompts = [
    ...marketingPrompts,
    ...contentPrompts,
    ...businessPrompts,
    ...programmingPrompts,
    ...designPrompts,
    ...educationPrompts,
    ...dataPrompts,
    ...supportPrompts,
    ...seoPrompts,
    ...personalPrompts,
  ]

  console.log(`Creating ${allPrompts.length} prompts...`)

  // Insert prompts in batches
  const batchSize = 100
  for (let i = 0; i < allPrompts.length; i += batchSize) {
    const batch = allPrompts.slice(i, i + batchSize)
    await prisma.prompt.createMany({
      data: batch,
    })
    console.log(`  ✓ Created prompts ${i + 1} to ${Math.min(i + batchSize, allPrompts.length)}`)
  }

  const totalPrompts = await prisma.prompt.count()
  const totalCategories = await prisma.category.count()
  const totalTiers = await prisma.pricingTier.count()

  console.log('\n✅ Seed completed successfully!')
  console.log(`   📁 Categories: ${totalCategories}`)
  console.log(`   💰 Pricing tiers: ${totalTiers}`)
  console.log(`   ✨ Prompts: ${totalPrompts}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
