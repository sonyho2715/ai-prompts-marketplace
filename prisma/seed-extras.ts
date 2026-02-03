import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedExtras() {
  console.log('🌱 Seeding industries and prompt chains...')

  // Seed Industries
  console.log('🏢 Creating industries...')
  const industries = await Promise.all([
    prisma.industry.upsert({
      where: { slug: 'small-business' },
      update: {},
      create: {
        name: 'Small Business Owner',
        slug: 'small-business',
        description: 'Retail, services, local business operations',
        icon: '🏪',
        order: 1,
        promptModifiers: {
          context: 'for a small business owner with limited resources and time',
          tone: 'practical, actionable, budget-conscious',
          focus: ['operations', 'customer service', 'local marketing', 'efficiency'],
        },
      },
    }),
    prisma.industry.upsert({
      where: { slug: 'real-estate' },
      update: {},
      create: {
        name: 'Real Estate',
        slug: 'real-estate',
        description: 'Agents, brokers, property managers',
        icon: '🏠',
        order: 2,
        promptModifiers: {
          context: 'for a real estate professional',
          tone: 'professional, persuasive, detail-oriented',
          focus: ['listings', 'lead generation', 'client communication', 'market analysis'],
        },
      },
    }),
    prisma.industry.upsert({
      where: { slug: 'ecommerce' },
      update: {},
      create: {
        name: 'E-commerce',
        slug: 'ecommerce',
        description: 'Online stores, dropshipping, DTC brands',
        icon: '🛒',
        order: 3,
        promptModifiers: {
          context: 'for an e-commerce business',
          tone: 'conversion-focused, customer-centric',
          focus: ['product descriptions', 'email marketing', 'customer retention', 'ad copy'],
        },
      },
    }),
    prisma.industry.upsert({
      where: { slug: 'marketing-agency' },
      update: {},
      create: {
        name: 'Marketing Agency',
        slug: 'marketing-agency',
        description: 'Digital marketing, content, social media',
        icon: '📢',
        order: 4,
        promptModifiers: {
          context: 'for a marketing agency managing multiple clients',
          tone: 'strategic, creative, data-driven',
          focus: ['campaigns', 'content strategy', 'analytics', 'client reporting'],
        },
      },
    }),
    prisma.industry.upsert({
      where: { slug: 'freelancer' },
      update: {},
      create: {
        name: 'Freelancer / Consultant',
        slug: 'freelancer',
        description: 'Independent professionals',
        icon: '💼',
        order: 5,
        promptModifiers: {
          context: 'for an independent freelancer or consultant',
          tone: 'professional, personal brand focused',
          focus: ['proposals', 'client management', 'personal branding', 'productivity'],
        },
      },
    }),
    prisma.industry.upsert({
      where: { slug: 'healthcare' },
      update: {},
      create: {
        name: 'Healthcare',
        slug: 'healthcare',
        description: 'Medical practices, wellness, health tech',
        icon: '🏥',
        order: 6,
        promptModifiers: {
          context: 'for a healthcare professional',
          tone: 'compassionate, clear, educational',
          focus: ['patient communication', 'health content', 'documentation', 'education'],
        },
      },
    }),
    prisma.industry.upsert({
      where: { slug: 'education' },
      update: {},
      create: {
        name: 'Education',
        slug: 'education',
        description: 'Teachers, trainers, course creators',
        icon: '📚',
        order: 7,
        promptModifiers: {
          context: 'for an educator or course creator',
          tone: 'engaging, clear, encouraging',
          focus: ['lesson plans', 'student engagement', 'course content', 'assessments'],
        },
      },
    }),
    prisma.industry.upsert({
      where: { slug: 'tech-startup' },
      update: {},
      create: {
        name: 'Tech Startup',
        slug: 'tech-startup',
        description: 'SaaS, apps, tech products',
        icon: '🚀',
        order: 8,
        promptModifiers: {
          context: 'for a tech startup',
          tone: 'innovative, clear, growth-focused',
          focus: ['product copy', 'investor decks', 'technical docs', 'user onboarding'],
        },
      },
    }),
  ])

  console.log(`  ✓ Created ${industries.length} industries`)

  // Seed Prompt Chains
  console.log('🔗 Creating prompt chains...')

  // Sales Outreach Chain
  const salesChain = await prisma.promptChain.upsert({
    where: { id: 'chain-sales-outreach' },
    update: {},
    create: {
      id: 'chain-sales-outreach',
      title: 'Complete B2B Sales Outreach Sequence',
      description: 'A 5-email cold outreach sequence that gets 25%+ open rates and 8%+ response rates.',
      category: 'sales',
      industry: 'b2b',
      difficulty: 'intermediate',
      isFree: false,
      isPopular: true,
      tier: 'pro',
    },
  })

  // Create steps for sales chain
  await prisma.chainStep.deleteMany({ where: { chainId: salesChain.id } })
  await prisma.chainStep.createMany({
    data: [
      {
        chainId: salesChain.id,
        order: 1,
        title: 'Research & Personalization',
        description: 'Gather information about your prospect',
        prompt: `You are a B2B sales researcher. I need to send a cold email to [PROSPECT_NAME] at [COMPANY_NAME].

Research and provide:
1. 3 recent news items about the company
2. 2-3 potential pain points based on their industry ([INDUSTRY])
3. A personalization hook I can use in my email opening

Company website: [COMPANY_WEBSITE]
Their role: [PROSPECT_ROLE]`,
        expectedOutput: 'Personalized research brief with specific hooks',
        variables: ['PROSPECT_NAME', 'COMPANY_NAME', 'INDUSTRY', 'COMPANY_WEBSITE', 'PROSPECT_ROLE'],
      },
      {
        chainId: salesChain.id,
        order: 2,
        title: 'Email 1: Problem Awareness',
        description: 'First touch - establish relevance without pitching',
        prompt: `Write a cold email using this research:
[PASTE_RESEARCH]

My product/service: [YOUR_PRODUCT]
Key benefit: [MAIN_BENEFIT]

Rules:
- Under 75 words
- No pitch in first email
- Ask a thought-provoking question about their pain point
- End with soft CTA (reply with thoughts)
- Subject line under 5 words, curiosity-driven`,
        expectedOutput: 'Short, personalized first-touch email',
        variables: ['PASTE_RESEARCH', 'YOUR_PRODUCT', 'MAIN_BENEFIT'],
      },
      {
        chainId: salesChain.id,
        order: 3,
        title: 'Email 2: Social Proof',
        description: 'Follow-up with credibility',
        prompt: `Write follow-up email #2.

Context: [CONTEXT_FROM_EMAIL_1]
Case study: [CASE_STUDY]

Include:
- Reference to first email
- Specific result or metric
- Keep under 100 words
- CTA: "Would this be worth a 15-min chat?"`,
        expectedOutput: 'Credibility-building follow-up email',
        variables: ['CONTEXT_FROM_EMAIL_1', 'CASE_STUDY'],
      },
      {
        chainId: salesChain.id,
        order: 4,
        title: 'Email 3: Value Offer',
        description: 'Provide immediate value',
        prompt: `Write email #3 offering immediate value.

Free resource or offer: [FREE_RESOURCE]

Rules:
- Lead with value, not ask
- No strings attached tone
- Under 80 words
- CTA: Download/access the resource`,
        expectedOutput: 'Value-first email with free resource',
        variables: ['FREE_RESOURCE'],
      },
      {
        chainId: salesChain.id,
        order: 5,
        title: 'Email 4: Break-Up',
        description: 'Final attempt with graceful exit',
        prompt: `Write the final "break-up" email.

Rules:
- Acknowledge they're busy
- Summarize value briefly (1 sentence)
- Give them an easy out
- Leave door open for future
- Under 60 words
- Subject: "Should I close your file?"`,
        expectedOutput: 'Respectful final follow-up email',
        variables: [],
      },
    ],
  })

  // Blog Content Chain
  const blogChain = await prisma.promptChain.upsert({
    where: { id: 'chain-blog-content' },
    update: {},
    create: {
      id: 'chain-blog-content',
      title: 'SEO Blog Post Creation Workflow',
      description: 'Create SEO-optimized, engaging blog posts from idea to final draft.',
      category: 'content',
      difficulty: 'beginner',
      isFree: true,
      isPopular: true,
      tier: 'free',
    },
  })

  await prisma.chainStep.deleteMany({ where: { chainId: blogChain.id } })
  await prisma.chainStep.createMany({
    data: [
      {
        chainId: blogChain.id,
        order: 1,
        title: 'Topic Research & Outline',
        prompt: `Create a blog post outline for: [TOPIC]

Target audience: [AUDIENCE]
Word count goal: [WORD_COUNT]

Provide:
1. 5 headline options (curiosity + benefit driven)
2. H2 subheadings (5-7 sections)
3. Key points for each section
4. 3 unique angles`,
        expectedOutput: 'Comprehensive blog outline',
        variables: ['TOPIC', 'AUDIENCE', 'WORD_COUNT'],
      },
      {
        chainId: blogChain.id,
        order: 2,
        title: 'Introduction Hook',
        prompt: `Write 3 opening paragraphs for [TOPIC].

Use these hook styles:
1. Surprising statistic or fact
2. Relatable problem/pain point
3. Provocative question

Each intro: 2-3 sentences, make readers want to continue.`,
        expectedOutput: '3 compelling introduction options',
        variables: ['TOPIC'],
      },
      {
        chainId: blogChain.id,
        order: 3,
        title: 'Full Draft',
        prompt: `Write the complete blog post using:
Outline: [OUTLINE]
Chosen intro: [INTRO_CHOICE]

Guidelines:
- Conversational but authoritative tone
- Include specific examples and data
- Short paragraphs (2-3 sentences)
- Practical tip in each section
- Clear CTA at the end`,
        expectedOutput: 'Complete first draft of blog post',
        variables: ['OUTLINE', 'INTRO_CHOICE'],
      },
    ],
  })

  // Business Strategy Chain
  const strategyChain = await prisma.promptChain.upsert({
    where: { id: 'chain-business-strategy' },
    update: {},
    create: {
      id: 'chain-business-strategy',
      title: 'Business Strategy Sprint',
      description: 'Develop a complete business strategy in one focused session.',
      category: 'business',
      difficulty: 'advanced',
      isFree: false,
      isPopular: false,
      tier: 'complete',
    },
  })

  await prisma.chainStep.deleteMany({ where: { chainId: strategyChain.id } })
  await prisma.chainStep.createMany({
    data: [
      {
        chainId: strategyChain.id,
        order: 1,
        title: 'Market Analysis',
        prompt: `Act as a business strategist. Analyze the market for [BUSINESS_IDEA].

Provide:
1. Market size estimate (TAM, SAM, SOM)
2. Top 5 competitors and positioning
3. Market trends (growing, declining, stable)
4. Entry barriers
5. Customer segments`,
        variables: ['BUSINESS_IDEA'],
      },
      {
        chainId: strategyChain.id,
        order: 2,
        title: 'Value Proposition',
        prompt: `Based on this market analysis:
[MARKET_ANALYSIS]

Create a value proposition using the Value Proposition Canvas:
- Customer jobs to be done
- Pains they experience
- Gains they desire
- How our product addresses each`,
        variables: ['MARKET_ANALYSIS'],
      },
      {
        chainId: strategyChain.id,
        order: 3,
        title: 'Go-to-Market Strategy',
        prompt: `Create a go-to-market strategy for [BUSINESS_IDEA].

Value proposition: [VALUE_PROP]

Include:
1. Launch channels (ranked by priority)
2. Pricing strategy with reasoning
3. First 90-day milestones
4. Key metrics to track
5. Budget allocation`,
        variables: ['BUSINESS_IDEA', 'VALUE_PROP'],
      },
    ],
  })

  console.log('  ✓ Created 3 prompt chains with steps')

  console.log('\n✅ Extras seeding completed!')
}

seedExtras()
  .catch((e) => {
    console.error('❌ Error seeding extras:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
