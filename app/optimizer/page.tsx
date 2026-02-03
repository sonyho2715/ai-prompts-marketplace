import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import PromptOptimizer from '@/components/features/PromptOptimizer';
import NewsletterSignup from '@/components/features/NewsletterSignup';

export const metadata = {
  title: 'AI Prompt Optimizer | Transform Your Ideas into Powerful Prompts',
  description: 'Use our AI-powered tool to transform rough ideas into professionally crafted prompts optimized for ChatGPT, Claude, Midjourney, and more.',
};

export default async function OptimizerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?redirect=/optimizer');
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            AI Prompts
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Powered by Claude AI
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI Prompt Optimizer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Transform your rough ideas into professionally crafted prompts
            that get better results from any AI model.
          </p>
        </div>

        {/* Optimizer Component */}
        <div className="max-w-3xl mx-auto mb-16">
          <PromptOptimizer />
        </div>

        {/* Tips Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Tips for Better Results
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Be Specific About Your Goal',
                tip: 'Instead of "write a blog post", try "write a 1500-word blog post about productivity tips for remote workers"',
              },
              {
                title: 'Mention Your Audience',
                tip: 'Specify who will read the output: "for small business owners" or "for beginners in photography"',
              },
              {
                title: 'Include Context',
                tip: 'Add relevant background: your industry, brand voice, or specific requirements',
              },
              {
                title: 'Define the Format',
                tip: 'Specify how you want the output: "as a numbered list", "in table format", or "with headers"',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="max-w-xl mx-auto">
          <NewsletterSignup source="optimizer-page" showIndustry />
        </div>
      </main>
    </div>
  );
}
