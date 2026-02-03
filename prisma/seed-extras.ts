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

  // Seed Blog Posts
  console.log('📝 Creating blog posts...')

  const blogPosts = await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'mastering-ai-prompts-complete-guide' },
      update: {},
      create: {
        title: 'Mastering AI Prompts: The Complete Guide for 2025',
        slug: 'mastering-ai-prompts-complete-guide',
        excerpt: 'Learn the art and science of crafting effective AI prompts. This comprehensive guide covers everything from basic principles to advanced techniques used by professionals.',
        content: `
# Mastering AI Prompts: The Complete Guide for 2025

Artificial Intelligence has transformed how we work, create, and solve problems. But the difference between mediocre AI outputs and exceptional results often comes down to one thing: **the quality of your prompts**.

## Why Prompt Engineering Matters

Think of AI as a brilliant assistant who can do almost anything—but needs clear instructions. A vague request like "write me an email" will get you generic results. A specific prompt like "Write a follow-up email to a prospect who attended our webinar on marketing automation, acknowledging their question about integration with Salesforce" will get you something you can actually use.

## The Anatomy of a Perfect Prompt

Every effective prompt contains these elements:

### 1. Context
Tell the AI who it is and what situation it's in.

**Example:** "You are a senior content strategist at a B2B SaaS company specializing in project management tools."

### 2. Task
Be specific about what you want accomplished.

**Example:** "Write a LinkedIn post announcing our new AI-powered task prioritization feature."

### 3. Format
Specify the desired output structure.

**Example:** "Use a hook, 3 bullet points of benefits, and a call-to-action. Keep it under 200 words."

### 4. Constraints
Add any limitations or requirements.

**Example:** "Avoid jargon. Don't use emojis. Include a question to drive engagement."

## Common Mistakes to Avoid

1. **Being too vague** - "Write something about marketing" vs. "Write a 500-word blog intro about email marketing ROI for e-commerce businesses"

2. **Forgetting context** - AI doesn't know your business, audience, or goals unless you tell it

3. **Skipping the format** - Without structure guidance, you'll get inconsistent results

4. **Not iterating** - Your first prompt rarely gives perfect results. Refine and improve.

## Pro Tips for Better Results

- **Use examples** - Show the AI what good looks like
- **Chain your prompts** - Break complex tasks into steps
- **Specify tone** - "Conversational but professional" vs. "Academic and formal"
- **Request alternatives** - "Give me 3 different approaches"

## Conclusion

Mastering AI prompts is a skill that compounds. The better you get, the more time you save and the better your outputs become. Start with the basics, practice regularly, and you'll be amazed at what's possible.

Ready to level up? Browse our library of 1,000+ expert-crafted prompts and see the difference professional prompts make.
        `.trim(),
        coverImage: '/blog/mastering-prompts.jpg',
        category: 'guides',
        tags: ['prompt engineering', 'ai tips', 'beginners', 'chatgpt', 'claude'],
        author: 'AI Prompts Team',
        isPublished: true,
        publishedAt: new Date('2025-01-15'),
        views: 1250,
      },
    }),

    prisma.blogPost.upsert({
      where: { slug: '10-chatgpt-prompts-for-marketing' },
      update: {},
      create: {
        title: '10 ChatGPT Prompts That Will Transform Your Marketing',
        slug: '10-chatgpt-prompts-for-marketing',
        excerpt: 'Discover the exact prompts top marketers use to create compelling copy, generate content ideas, and automate their marketing workflows.',
        content: `
# 10 ChatGPT Prompts That Will Transform Your Marketing

Marketing teams are under constant pressure to produce more content, faster. Here are 10 battle-tested prompts that will supercharge your marketing output.

## 1. The Content Idea Generator

\`\`\`
Act as a senior content strategist. Generate 20 blog post ideas for [YOUR INDUSTRY] that:
- Address common customer pain points
- Have high search potential
- Can be written in under 2,000 words
- Include a mix of how-to, listicles, and thought leadership

Format: Title | Target Keyword | Search Intent
\`\`\`

## 2. The Email Subject Line Creator

\`\`\`
Write 10 email subject lines for [CAMPAIGN TYPE] that:
- Create urgency without being spammy
- Are under 50 characters
- Would make [TARGET AUDIENCE] want to open immediately

Test variations: curiosity-based, benefit-driven, question-based
\`\`\`

## 3. The Social Proof Story Builder

\`\`\`
Transform this customer result into a compelling case study:

Result: [CUSTOMER RESULT]
Customer: [CUSTOMER TYPE]
Timeline: [TIMEFRAME]

Create:
1. A 3-sentence summary
2. A LinkedIn post version
3. A testimonial quote format
4. Key metrics to highlight
\`\`\`

## 4. The Ad Copy Framework

\`\`\`
Write Facebook ad copy for [PRODUCT/SERVICE] targeting [AUDIENCE].

Use the PAS framework:
- Problem: What keeps them up at night?
- Agitation: What happens if they don't solve it?
- Solution: How do we help?

Include: Hook, body (under 125 words), CTA
Create 3 variations with different emotional angles.
\`\`\`

## 5. The Landing Page Outline

\`\`\`
Create a high-converting landing page outline for [OFFER].

Target audience: [AUDIENCE]
Main objection to address: [OBJECTION]
Primary CTA: [DESIRED ACTION]

Include:
- Hero section copy
- 3 benefit blocks
- Social proof section
- FAQ (5 questions)
- Final CTA
\`\`\`

## 6. The Competitor Analysis

\`\`\`
Analyze [COMPETITOR]'s marketing strategy based on their website and social presence.

Evaluate:
1. Unique value proposition
2. Target audience positioning
3. Content themes
4. Calls-to-action used
5. Gaps we can exploit

Provide actionable insights for differentiation.
\`\`\`

## 7. The Content Repurposing Machine

\`\`\`
Take this blog post and create:
1. A Twitter/X thread (8-10 tweets)
2. A LinkedIn post
3. An email newsletter intro
4. 5 Instagram carousel slide concepts
5. A YouTube video script outline

Blog post: [PASTE CONTENT]
\`\`\`

## 8. The SEO Meta Description Writer

\`\`\`
Write 3 meta descriptions for this page:

Page title: [TITLE]
Primary keyword: [KEYWORD]
Page purpose: [PURPOSE]

Requirements:
- Under 155 characters
- Include keyword naturally
- Compelling reason to click
- Clear value proposition
\`\`\`

## 9. The Email Sequence Builder

\`\`\`
Create a 5-email welcome sequence for new [PRODUCT TYPE] subscribers.

Goals:
- Email 1: Deliver lead magnet, set expectations
- Email 2: Share quick win
- Email 3: Tell origin story
- Email 4: Overcome main objection
- Email 5: Soft pitch

Include subject lines and preview text for each.
\`\`\`

## 10. The A/B Test Generator

\`\`\`
Create A/B test variations for [ELEMENT TYPE]:

Original: [CURRENT VERSION]
Goal: [METRIC TO IMPROVE]

Generate:
- 3 variations with hypothesis for each
- What specifically changed and why
- Expected impact
- How to measure success
\`\`\`

## Start Using These Today

Copy any of these prompts and customize the brackets with your specific details. The key is specificity—the more context you provide, the better your results.

Want access to 1,000+ more prompts like these? Check out our complete prompt library.
        `.trim(),
        coverImage: '/blog/chatgpt-marketing.jpg',
        category: 'marketing-prompts',
        tags: ['chatgpt', 'marketing', 'copywriting', 'social media', 'email marketing'],
        author: 'AI Prompts Team',
        isPublished: true,
        publishedAt: new Date('2025-01-20'),
        views: 2340,
      },
    }),

    prisma.blogPost.upsert({
      where: { slug: 'ai-prompts-for-developers' },
      update: {},
      create: {
        title: 'AI Prompts Every Developer Should Know in 2025',
        slug: 'ai-prompts-for-developers',
        excerpt: 'From code reviews to documentation, these AI prompts will make you a more productive developer. Real examples included.',
        content: `
# AI Prompts Every Developer Should Know in 2025

AI coding assistants have become indispensable tools for developers. But most engineers barely scratch the surface of what's possible. Here are the prompts that separate 10x developers from the rest.

## Code Review & Quality

### The Code Reviewer

\`\`\`
Review this code for:
1. Bugs and potential runtime errors
2. Security vulnerabilities
3. Performance issues
4. Code style and best practices
5. Edge cases not handled

Code:
[PASTE CODE]

For each issue found, explain:
- What the problem is
- Why it matters
- How to fix it (with code example)
\`\`\`

### The Refactoring Assistant

\`\`\`
Refactor this code to:
- Improve readability
- Follow [LANGUAGE] best practices
- Reduce complexity
- Add proper error handling

Keep the same functionality. Explain each change.

[PASTE CODE]
\`\`\`

## Documentation

### The README Generator

\`\`\`
Create a comprehensive README.md for this project:

Project name: [NAME]
Purpose: [DESCRIPTION]
Tech stack: [STACK]

Include:
- Project description
- Installation steps
- Usage examples
- API documentation (if applicable)
- Contributing guidelines
- License section
\`\`\`

### The Code Commenter

\`\`\`
Add clear, helpful comments to this code:
- Explain the "why" not the "what"
- Document function parameters and returns
- Note any non-obvious behavior
- Add TODO comments for improvements

[PASTE CODE]
\`\`\`

## Problem Solving

### The Debugger

\`\`\`
Help me debug this issue:

Expected behavior: [WHAT SHOULD HAPPEN]
Actual behavior: [WHAT HAPPENS]
Error message: [ERROR]
Code: [RELEVANT CODE]
What I've tried: [ATTEMPTS]

Walk me through:
1. Likely causes
2. How to verify each
3. Step-by-step fix
\`\`\`

### The Architecture Advisor

\`\`\`
I'm building [PROJECT DESCRIPTION].

Requirements:
[LIST REQUIREMENTS]

Constraints:
[LIST CONSTRAINTS]

Recommend:
1. Architecture pattern
2. Tech stack choices
3. Database design
4. Key components
5. Potential pitfalls

Explain trade-offs for each decision.
\`\`\`

## Testing

### The Test Case Generator

\`\`\`
Generate test cases for this function:

[PASTE FUNCTION]

Include:
- Happy path tests
- Edge cases
- Error conditions
- Boundary values
- Integration scenarios

Use [TESTING FRAMEWORK] syntax.
\`\`\`

## Learning & Growth

### The Concept Explainer

\`\`\`
Explain [CONCEPT] as if I'm a developer who knows [YOUR BACKGROUND].

Include:
- Simple analogy
- When to use it
- Code example
- Common mistakes
- Best practices
- Resources to learn more
\`\`\`

## Bonus: The Code Translator

\`\`\`
Convert this [SOURCE LANGUAGE] code to [TARGET LANGUAGE]:

[PASTE CODE]

Maintain:
- Same functionality
- Idiomatic target language patterns
- Equivalent error handling
- Similar performance characteristics
\`\`\`

## Level Up Your Development

These prompts are just the beginning. The key is treating AI as a pair programmer—give it context, be specific about what you need, and iterate on the results.

Browse our full developer prompt library for 100+ more coding prompts.
        `.trim(),
        coverImage: '/blog/developer-prompts.jpg',
        category: 'coding-prompts',
        tags: ['development', 'coding', 'chatgpt', 'copilot', 'programming'],
        author: 'AI Prompts Team',
        isPublished: true,
        publishedAt: new Date('2025-01-25'),
        views: 1890,
      },
    }),

    prisma.blogPost.upsert({
      where: { slug: 'prompt-engineering-mistakes' },
      update: {},
      create: {
        title: '7 Prompt Engineering Mistakes Killing Your AI Results',
        slug: 'prompt-engineering-mistakes',
        excerpt: 'Are you making these common prompt engineering mistakes? Learn what they are and how to fix them for dramatically better AI outputs.',
        content: `
# 7 Prompt Engineering Mistakes Killing Your AI Results

You've got access to the most powerful AI tools ever created. So why are your results... meh?

After analyzing thousands of prompts, we've identified the 7 most common mistakes—and how to fix them.

## Mistake #1: Being Too Vague

**The Problem:**
"Write me a blog post about marketing."

This tells the AI nothing about length, audience, tone, angle, or format. You'll get generic content that needs heavy editing.

**The Fix:**
"Write a 1,200-word blog post for B2B SaaS marketers about email automation ROI. Include 3 case study references, actionable tips, and a conversational but professional tone. Target keyword: email automation ROI."

## Mistake #2: No Context About Your Business

**The Problem:**
AI doesn't know your company, products, audience, or voice—unless you tell it.

**The Fix:**
Start prompts with context blocks:
"You are writing for [Company], a [description]. Our audience is [target]. Our brand voice is [tone]. Key differentiators: [list]."

## Mistake #3: Forgetting to Specify Format

**The Problem:**
Asking for "ideas" and getting a wall of text, or asking for "an email" and getting a 500-word novel.

**The Fix:**
Always specify structure:
- "Provide as a numbered list"
- "Use bullet points with bold headers"
- "Keep under 150 words"
- "Format as: [Problem] → [Solution] → [Benefit]"

## Mistake #4: Not Showing Examples

**The Problem:**
Describing what you want is hard. Showing is easier and more effective.

**The Fix:**
Include "few-shot" examples:
"Write in this style: [paste example]. Here's the tone I want: [paste example]."

## Mistake #5: Asking for Everything at Once

**The Problem:**
"Write a complete marketing strategy with content calendar, email sequences, ad copy, and landing pages."

This overwhelms the AI and produces shallow results across all areas.

**The Fix:**
Chain your prompts. Break complex tasks into steps:
1. First, develop the strategy framework
2. Then, create the content calendar
3. Next, write the email sequences
4. Finally, develop ad copy

Each step builds on the previous.

## Mistake #6: Accepting First Outputs

**The Problem:**
Taking whatever the AI gives you without iteration.

**The Fix:**
Treat AI outputs as drafts. Follow up with:
- "Make this more [specific adjective]"
- "Rewrite with more focus on [aspect]"
- "Give me 3 more variations"
- "Now make it half the length"

## Mistake #7: Not Assigning a Role

**The Problem:**
Asking general AI for expert-level work.

**The Fix:**
Give the AI an expert persona:
- "Act as a senior copywriter with 20 years of experience"
- "You are a McKinsey consultant"
- "Respond as a technical architect at a Fortune 500 company"

This activates different "knowledge patterns" and improves output quality.

## The Compound Effect

Fix these 7 mistakes and watch your AI results transform. Better prompts → Better outputs → Less editing → More time for strategic work.

Want prompts that already have these principles built in? Our library of 1,000+ expert prompts does the hard work for you.
        `.trim(),
        coverImage: '/blog/prompt-mistakes.jpg',
        category: 'guides',
        tags: ['prompt engineering', 'tips', 'mistakes', 'chatgpt', 'ai'],
        author: 'AI Prompts Team',
        isPublished: true,
        publishedAt: new Date('2025-01-28'),
        views: 3120,
      },
    }),

    prisma.blogPost.upsert({
      where: { slug: 'chatgpt-vs-claude-prompts' },
      update: {},
      create: {
        title: 'ChatGPT vs Claude: Which AI Needs Different Prompts?',
        slug: 'chatgpt-vs-claude-prompts',
        excerpt: 'Not all AI models respond the same way to prompts. Learn how to optimize your prompts for ChatGPT, Claude, and other popular AI tools.',
        content: `
# ChatGPT vs Claude: Which AI Needs Different Prompts?

Different AI models have different strengths, weaknesses, and "personalities." Using the same prompt across all of them means leaving performance on the table.

Here's how to optimize your prompts for each major AI.

## ChatGPT (GPT-4)

**Strengths:**
- Excellent at following complex instructions
- Great with coding tasks
- Strong at creative writing
- Good with structured outputs

**Prompting Tips:**
1. Be explicit about format—GPT-4 follows formatting instructions well
2. Use system prompts for consistent personas
3. Chain of thought works great: "Think step by step"
4. Specify what NOT to do (it respects constraints)

**Example Optimization:**
Instead of: "Write a product description"
Use: "Write a product description for [product]. Format: Hook (1 sentence), 3 bullet points of benefits, CTA. Tone: Enthusiastic but not salesy. Under 100 words."

## Claude

**Strengths:**
- Excellent at nuanced, thoughtful responses
- Strong at analysis and reasoning
- Better at acknowledging uncertainty
- More natural conversational flow
- Handles longer contexts well

**Prompting Tips:**
1. Give Claude room to think—it excels at analysis
2. Ask for reasoning: "Explain your thinking"
3. Use conversational prompts—Claude responds well to natural language
4. Leverage longer context windows for complex documents

**Example Optimization:**
Instead of: "Analyze this data"
Use: "Review this data and share your analysis. What patterns do you notice? What concerns you? What would you recommend? Feel free to think through this step by step."

## Google Gemini

**Strengths:**
- Strong multimodal capabilities
- Good at combining information sources
- Solid at factual queries
- Integrates well with Google ecosystem

**Prompting Tips:**
1. Leverage its access to current information
2. Use for fact-checking and research tasks
3. Good for comparing multiple sources
4. Effective with image + text prompts

## General Best Practices (All Models)

Regardless of the AI, these principles apply:

1. **Context is king** - More relevant context = better outputs
2. **Be specific** - Vague prompts get vague results
3. **Iterate** - First output is rarely final
4. **Assign expertise** - "Act as a [expert type]" improves quality
5. **Specify format** - Structure your desired output

## When to Use Which

| Task | Best AI |
|------|---------|
| Complex coding | ChatGPT (GPT-4) |
| Thoughtful analysis | Claude |
| Current events | Gemini |
| Creative writing | ChatGPT or Claude |
| Long document review | Claude |
| Structured data | ChatGPT |

## The Bottom Line

The best AI is the one you prompt correctly. Understanding each model's strengths helps you get better results with less effort.

Our prompt library includes model-specific optimizations for each prompt—so you always get the best results regardless of which AI you use.
        `.trim(),
        coverImage: '/blog/chatgpt-vs-claude.jpg',
        category: 'guides',
        tags: ['chatgpt', 'claude', 'gemini', 'comparison', 'prompt engineering'],
        author: 'AI Prompts Team',
        isPublished: true,
        publishedAt: new Date('2025-02-01'),
        views: 980,
      },
    }),
  ])

  console.log(`  ✓ Created ${blogPosts.length} blog posts`)

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
