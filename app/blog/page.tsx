import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import NewsletterSignup from '@/components/features/NewsletterSignup';

export const metadata = {
  title: 'AI Prompts Blog | Tips, Guides & Best Practices',
  description: 'Learn how to write better AI prompts, discover industry-specific strategies, and stay updated with the latest in prompt engineering.',
};

// Sample blog posts (in production, fetch from database)
const BLOG_POSTS = [
  {
    slug: 'best-chatgpt-prompts-small-business',
    title: '25 ChatGPT Prompts Every Small Business Owner Needs',
    excerpt: 'Save hours each week with these battle-tested prompts for marketing, customer service, and operations.',
    category: 'Small Business',
    readTime: '8 min read',
    publishedAt: '2026-01-28',
    coverImage: '/blog/small-business-prompts.jpg',
    featured: true,
  },
  {
    slug: 'prompt-engineering-frameworks',
    title: 'The Complete Guide to Prompt Engineering Frameworks',
    excerpt: 'Master RACE, TRACE, PAS, and other proven frameworks that professionals use to get better AI outputs.',
    category: 'Guides',
    readTime: '12 min read',
    publishedAt: '2026-01-25',
    coverImage: '/blog/frameworks-guide.jpg',
    featured: true,
  },
  {
    slug: 'ai-prompts-real-estate-agents',
    title: '30 AI Prompts for Real Estate Agents That Close More Deals',
    excerpt: 'From listing descriptions to follow-up emails, these prompts help agents save time and convert more leads.',
    category: 'Real Estate',
    readTime: '10 min read',
    publishedAt: '2026-01-22',
    coverImage: '/blog/real-estate-prompts.jpg',
    featured: false,
  },
  {
    slug: 'midjourney-prompts-ecommerce',
    title: 'Midjourney Prompts for E-commerce Product Photography',
    excerpt: 'Create stunning product images without expensive photoshoots using these Midjourney prompt templates.',
    category: 'E-commerce',
    readTime: '6 min read',
    publishedAt: '2026-01-20',
    coverImage: '/blog/midjourney-ecommerce.jpg',
    featured: false,
  },
  {
    slug: 'claude-vs-chatgpt-prompts',
    title: 'Claude vs ChatGPT: How to Optimize Prompts for Each',
    excerpt: 'Learn the key differences and how to tailor your prompts to get the best results from each AI model.',
    category: 'Guides',
    readTime: '7 min read',
    publishedAt: '2026-01-18',
    coverImage: '/blog/claude-vs-chatgpt.jpg',
    featured: false,
  },
  {
    slug: 'email-marketing-prompts',
    title: '20 Email Marketing Prompts That Increase Open Rates',
    excerpt: 'Write subject lines, welcome sequences, and re-engagement campaigns that actually convert.',
    category: 'Marketing',
    readTime: '9 min read',
    publishedAt: '2026-01-15',
    coverImage: '/blog/email-marketing.jpg',
    featured: false,
  },
];

const CATEGORIES = [
  'All',
  'Small Business',
  'Marketing',
  'Real Estate',
  'E-commerce',
  'Guides',
  'Productivity',
];

export default function BlogPage() {
  const featuredPosts = BLOG_POSTS.filter(p => p.featured);
  const recentPosts = BLOG_POSTS.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            AI Prompts
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/prompts" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Prompts
            </Link>
            <Link href="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Pricing
            </Link>
            <Link href="/login" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            AI Prompts Blog
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Master the Art of AI Prompts
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Tips, guides, and industry-specific strategies to get better results from AI.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === 'All'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Posts */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-blue-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                    📝
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-medium">
                    Read article <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mb-16">
          <NewsletterSignup source="blog" variant="inline" />
        </section>

        {/* Recent Posts */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your AI Results?
          </h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto">
            Get access to 1000+ professionally crafted prompts and our AI optimizer tool.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-colors"
          >
            View Pricing <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © 2026 AI Prompts Marketplace. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
