import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Twitter, Linkedin, Copy } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import NewsletterSignup from '@/components/features/NewsletterSignup';

// Sample blog content (in production, fetch from database and use MDX)
const SAMPLE_POSTS: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  tags: string[];
}> = {
  'best-chatgpt-prompts-small-business': {
    title: '25 ChatGPT Prompts Every Small Business Owner Needs',
    excerpt: 'Save hours each week with these battle-tested prompts for marketing, customer service, and operations.',
    category: 'Small Business',
    readTime: '8 min read',
    publishedAt: '2026-01-28',
    author: 'AI Prompts Team',
    tags: ['ChatGPT', 'Small Business', 'Productivity'],
  },
  'prompt-engineering-frameworks': {
    title: 'The Complete Guide to Prompt Engineering Frameworks',
    excerpt: 'Master RACE, TRACE, PAS, and other proven frameworks that professionals use to get better AI outputs.',
    category: 'Guides',
    readTime: '12 min read',
    publishedAt: '2026-01-25',
    author: 'AI Prompts Team',
    tags: ['Frameworks', 'Prompt Engineering', 'Advanced'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = SAMPLE_POSTS[slug];

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | AI Prompts Blog`,
    description: post.excerpt,
  };
}

// Blog content component for small business post
function SmallBusinessContent() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h2>Introduction</h2>
      <p>
        Running a small business means wearing many hats. Marketing, customer service,
        operations, and strategy, all competing for your limited time. That is where AI comes in.
      </p>
      <p>
        These 25 ChatGPT prompts are specifically designed for small business owners
        who need practical, actionable results without the learning curve.
      </p>

      <h2>Marketing Prompts</h2>

      <h3>1. Social Media Content Calendar</h3>
      <p><strong>The Prompt:</strong></p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`You are a social media strategist for a [BUSINESS TYPE]. Create a 2-week content calendar with:
- 3 posts per week (Monday, Wednesday, Friday)
- Mix of educational, promotional, and engaging content
- Specific post copy ready to use
- Relevant hashtags (5-7 per post)
- Best posting times for [TARGET AUDIENCE]`}
      </pre>
      <p>
        <strong>Why it works:</strong> This prompt gives you the role context (social media strategist),
        specific deliverables, and customization points. The output is ready to schedule immediately.
      </p>

      <h3>2. Email Subject Line Generator</h3>
      <p><strong>The Prompt:</strong></p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`Generate 10 email subject lines for a [CAMPAIGN TYPE] email for my [BUSINESS TYPE].
Target audience: [AUDIENCE]
Goal: [GOAL - opens, clicks, purchases]
Tone: [casual/professional/urgent]

For each subject line, explain why it would work and include an A/B testing variant.`}
      </pre>

      <h3>3. Google My Business Response Templates</h3>
      <p><strong>The Prompt:</strong></p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`Create 5 response templates for Google My Business reviews:
1. 5-star positive review (enthusiastic)
2. 4-star review with minor complaint
3. 3-star neutral review
4. 2-star negative review (service issue)
5. 1-star angry review (requires damage control)

Business: [YOUR BUSINESS]
Tone: Professional but warm
Include: Thank you, address feedback, invite back`}
      </pre>

      <h2>Customer Service Prompts</h2>

      <h3>4. FAQ Generator</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`You are a customer service expert for [BUSINESS TYPE]. Based on common customer pain points in this industry, generate:
- 15 frequently asked questions
- Clear, concise answers (2-3 sentences each)
- Group by category (ordering, shipping, returns, product info)
- Include 1 pro tip per category`}
      </pre>

      <h3>5. Difficult Customer Response</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`A customer sent this message: "[PASTE CUSTOMER MESSAGE]"

Write a response that:
- Acknowledges their frustration
- Takes responsibility without over-apologizing
- Offers a specific solution
- Sets clear expectations for next steps
- Maintains professional warmth
- Keeps the door open for future business`}
      </pre>

      <h2>The Key to Better Results</h2>
      <p>Notice the pattern in these prompts:</p>
      <ol>
        <li><strong>Role assignment</strong> - Tell ChatGPT who to be</li>
        <li><strong>Specific context</strong> - Your business, audience, goals</li>
        <li><strong>Clear deliverables</strong> - What exactly you want</li>
        <li><strong>Format guidance</strong> - How you want it structured</li>
      </ol>

      <h2>Get All 25 Prompts</h2>
      <p>
        This article covers just 5 of the 25 prompts in our Small Business Prompt Pack.
        Get the complete collection, plus industry customization and the AI Prompt Optimizer.
      </p>
      <p>
        <Link href="/pricing" className="text-purple-600 hover:underline font-semibold">
          View Pricing →
        </Link>
      </p>
    </div>
  );
}

// Blog content component for frameworks post
function FrameworksContent() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h2>Why Frameworks Matter</h2>
      <p>
        Random prompts get random results. Frameworks give you repeatable success.
      </p>
      <p>
        After analyzing thousands of prompts and their outputs, we have identified the frameworks
        that consistently produce better results. This guide teaches you when and how to use each one.
      </p>

      <h2>The RACE Framework</h2>
      <p><strong>R</strong>ole - <strong>A</strong>ction - <strong>C</strong>ontext - <strong>E</strong>xamples</p>

      <h3>When to Use</h3>
      <p>Best for task-oriented prompts where you need specific deliverables.</p>

      <h3>Structure</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`Role: You are a [professional role] with expertise in [domain]
Action: [specific task to complete]
Context: [background information, constraints, goals]
Examples: [sample output or reference]`}
      </pre>

      <h3>Example</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`Role: You are a senior copywriter at a Fortune 500 marketing agency

Action: Write 3 headline variations for a landing page

Context:
- Product: Project management software for remote teams
- Target: Engineering managers at startups
- Goal: Free trial signups
- Tone: Professional but not corporate

Examples of headlines I like:
- "Finally, a PM tool that developers actually use"
- "Ship faster. Meet less."`}
      </pre>

      <h2>The TRACE Framework</h2>
      <p><strong>T</strong>ask - <strong>R</strong>ole - <strong>A</strong>udience - <strong>C</strong>onstraints - <strong>E</strong>valuation</p>

      <h3>When to Use</h3>
      <p>Best for complex content creation where quality criteria matter.</p>

      <h3>Structure</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`Task: [what you want created]
Role: [who the AI should be]
Audience: [who will read/use this]
Constraints: [limitations, requirements, don'ts]
Evaluation: [how you'll judge quality]`}
      </pre>

      <h2>The Q&A Strategy</h2>
      <p>Sometimes the best prompt is one that makes the AI ask YOU questions first.</p>

      <h3>When to Use</h3>
      <p>When you are not sure exactly what you need, or the task requires deep customization.</p>

      <h3>Structure</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
{`I need help with [general task].

Before you provide a solution, ask me 5 clarifying questions that will help you give me a more tailored and effective response.

After I answer, proceed with the task.`}
      </pre>

      <h2>Framework Selection Guide</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 text-left">Situation</th>
              <th className="px-4 py-2 text-left">Best Framework</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="px-4 py-2 border-t">Need specific deliverable</td><td className="px-4 py-2 border-t">RACE</td></tr>
            <tr><td className="px-4 py-2 border-t">Creating content</td><td className="px-4 py-2 border-t">TRACE</td></tr>
            <tr><td className="px-4 py-2 border-t">Complex/unclear needs</td><td className="px-4 py-2 border-t">Q&A Strategy</td></tr>
            <tr><td className="px-4 py-2 border-t">Sales/persuasion</td><td className="px-4 py-2 border-t">PAS</td></tr>
            <tr><td className="px-4 py-2 border-t">Step-by-step process</td><td className="px-4 py-2 border-t">Chain prompting</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Practice Makes Perfect</h2>
      <p>
        The best way to master these frameworks is to use them. Our AI Prompt Optimizer
        tool automatically applies the right framework based on your input.
      </p>
      <p>
        <Link href="/optimizer" className="text-purple-600 hover:underline font-semibold">
          Try the Optimizer →
        </Link>
      </p>
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try to fetch from database first
  let post = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug },
    });
  } catch {
    // Database might not have the table yet
  }

  // Fall back to sample posts
  const samplePost = SAMPLE_POSTS[slug];
  if (!post && !samplePost) {
    notFound();
  }

  const displayPost = post || {
    title: samplePost.title,
    excerpt: samplePost.excerpt,
    category: samplePost.category,
    author: samplePost.author,
    publishedAt: new Date(samplePost.publishedAt),
    tags: samplePost.tags,
  };

  const readTime = samplePost?.readTime || '5 min read';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            AI Prompts
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Article Header */}
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
                {displayPost.category}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {displayPost.title}
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              {displayPost.excerpt}
            </p>

            <div className="flex items-center justify-between border-t border-b border-gray-200 dark:border-gray-700 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    AI
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {displayPost.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {displayPost.publishedAt
                      ? new Date(displayPost.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Draft'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Article Content - Rendered as React components for safety */}
          {slug === 'best-chatgpt-prompts-small-business' && <SmallBusinessContent />}
          {slug === 'prompt-engineering-frameworks' && <FrameworksContent />}

          {/* Tags */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {displayPost.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="font-semibold text-gray-900 dark:text-white mb-4">
              Share this article
            </p>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90">
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        </article>

        {/* Newsletter */}
        <div className="mt-12">
          <NewsletterSignup source={`blog-${slug}`} showIndustry />
        </div>

        {/* Related Posts */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(SAMPLE_POSTS)
              .filter(([key]) => key !== slug)
              .slice(0, 2)
              .map(([key, relatedPost]) => (
                <Link
                  key={key}
                  href={`/blog/${key}`}
                  className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                    {relatedPost.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
}
