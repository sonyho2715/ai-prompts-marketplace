'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Link2, Filter, Search, Loader2 } from 'lucide-react';
import PromptChain from '@/components/features/PromptChain';

interface ChainStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  prompt: string;
  expectedOutput?: string;
  variables: string[];
}

interface Chain {
  id: string;
  title: string;
  description: string;
  category: string;
  industry?: string;
  difficulty: string;
  steps: ChainStep[];
  isFree: boolean;
  isPopular: boolean;
  tier: string;
  _count?: { savedBy: number };
}

const CATEGORIES = [
  { id: '', name: 'All Categories' },
  { id: 'business', name: 'Business Strategy' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'sales', name: 'Sales' },
  { id: 'content', name: 'Content Creation' },
  { id: 'development', name: 'Development' },
  { id: 'productivity', name: 'Productivity' },
];

// Sample chains for demo (in production, these come from the database)
const SAMPLE_CHAINS: Chain[] = [
  {
    id: '1',
    title: 'Complete Sales Outreach Sequence',
    description: 'A 5-email cold outreach sequence that gets 25%+ open rates and 8%+ response rates.',
    category: 'sales',
    industry: 'b2b',
    difficulty: 'intermediate',
    isFree: false,
    isPopular: true,
    tier: 'pro',
    steps: [
      {
        id: 's1',
        order: 1,
        title: 'Research & Personalization',
        description: 'Start by gathering information about your prospect',
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
        id: 's2',
        order: 2,
        title: 'Email 1: Problem Awareness',
        description: 'First touch - establish relevance without pitching',
        prompt: `Write a cold email using this research:
[PASTE_RESEARCH_FROM_STEP_1]

My product/service: [YOUR_PRODUCT]
Key benefit: [MAIN_BENEFIT]

Rules:
- Under 75 words
- No pitch in first email
- Ask a thought-provoking question about their pain point
- End with soft CTA (reply with thoughts)
- Subject line under 5 words, curiosity-driven`,
        expectedOutput: 'Short, personalized first-touch email',
        variables: ['PASTE_RESEARCH_FROM_STEP_1', 'YOUR_PRODUCT', 'MAIN_BENEFIT'],
      },
      {
        id: 's3',
        order: 3,
        title: 'Email 2: Social Proof',
        description: 'Follow-up with credibility and proof',
        prompt: `Write follow-up email #2 for the same prospect.

Context from email 1: [CONTEXT]

Include:
- Reference to first email (don't assume they saw it)
- One specific case study or testimonial: [CASE_STUDY]
- Specific metric or result achieved
- Keep under 100 words
- CTA: "Would this be worth a 15-min chat?"`,
        expectedOutput: 'Credibility-building follow-up email',
        variables: ['CONTEXT', 'CASE_STUDY'],
      },
      {
        id: 's4',
        order: 4,
        title: 'Email 3: Value Offer',
        description: 'Provide immediate value without requiring a call',
        prompt: `Write email #3 offering immediate value.

Offer one of these:
- Free resource: [FREE_RESOURCE]
- Quick audit/review of their [AREA]
- Relevant industry insight

Rules:
- Lead with value, not ask
- No strings attached tone
- Under 80 words
- CTA: Download/access the resource`,
        expectedOutput: 'Value-first email with free resource',
        variables: ['FREE_RESOURCE', 'AREA'],
      },
      {
        id: 's5',
        order: 5,
        title: 'Email 4: Break-Up Email',
        description: 'Final attempt with graceful exit',
        prompt: `Write the final "break-up" email.

Rules:
- Acknowledge they're busy
- Summarize the value briefly (1 sentence)
- Give them an easy out ("not a fit right now")
- Leave door open for future
- Under 60 words
- Subject: "Should I close your file?"`,
        expectedOutput: 'Respectful final follow-up email',
        variables: [],
      },
    ],
  },
  {
    id: '2',
    title: 'Blog Post Creation Workflow',
    description: 'Create SEO-optimized, engaging blog posts from idea to final draft.',
    category: 'content',
    difficulty: 'beginner',
    isFree: true,
    isPopular: true,
    tier: 'free',
    steps: [
      {
        id: 's1',
        order: 1,
        title: 'Topic Research & Outline',
        prompt: `Create a detailed blog post outline for: [TOPIC]

Target audience: [AUDIENCE]
Word count goal: [WORD_COUNT]

Provide:
1. 5 potential headline options (curiosity + benefit driven)
2. H2 subheadings (5-7 sections)
3. Key points to cover in each section
4. 3 unique angles that haven't been overdone`,
        expectedOutput: 'Comprehensive blog post outline',
        variables: ['TOPIC', 'AUDIENCE', 'WORD_COUNT'],
      },
      {
        id: 's2',
        order: 2,
        title: 'Introduction Hook',
        prompt: `Write 3 different opening paragraphs for a blog post about [TOPIC].

Use these hook styles:
1. Surprising statistic or fact
2. Relatable problem/pain point
3. Provocative question

Each intro should be 2-3 sentences and make readers want to continue.`,
        expectedOutput: '3 compelling introduction options',
        variables: ['TOPIC'],
      },
      {
        id: 's3',
        order: 3,
        title: 'Full Draft',
        prompt: `Write the complete blog post using this outline:
[OUTLINE_FROM_STEP_1]

Chosen intro style: [INTRO_CHOICE]

Guidelines:
- Conversational but authoritative tone
- Include specific examples and data
- Use short paragraphs (2-3 sentences)
- Add a practical tip in each section
- End sections with transitions
- Include a clear CTA at the end`,
        expectedOutput: 'Complete first draft of blog post',
        variables: ['OUTLINE_FROM_STEP_1', 'INTRO_CHOICE'],
      },
    ],
  },
  {
    id: '3',
    title: 'Business Strategy Sprint',
    description: 'Develop a complete business strategy in one focused session.',
    category: 'business',
    difficulty: 'advanced',
    isFree: false,
    isPopular: false,
    tier: 'complete',
    steps: [
      {
        id: 's1',
        order: 1,
        title: 'Market Analysis',
        prompt: `Act as a business strategist. Analyze the market for [BUSINESS_IDEA].

Provide:
1. Market size estimate (TAM, SAM, SOM)
2. Top 5 competitors and their positioning
3. Market trends (growing, declining, stable)
4. Entry barriers
5. Customer segments`,
        variables: ['BUSINESS_IDEA'],
      },
      {
        id: 's2',
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
        id: 's3',
        order: 3,
        title: 'Go-to-Market Strategy',
        prompt: `Create a go-to-market strategy for [BUSINESS_IDEA].

Value proposition: [VALUE_PROP]

Include:
1. Launch channels (ranked by priority)
2. Pricing strategy with reasoning
3. First 90-day milestones
4. Key metrics to track
5. Budget allocation recommendations`,
        variables: ['BUSINESS_IDEA', 'VALUE_PROP'],
      },
    ],
  },
];

export default function ChainsPage() {
  const [chains, setChains] = useState<Chain[]>(SAMPLE_CHAINS);
  const [filteredChains, setFilteredChains] = useState<Chain[]>(SAMPLE_CHAINS);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessTiers, setAccessTiers] = useState(['free']);

  useEffect(() => {
    fetchChains();
  }, [selectedCategory]);

  const fetchChains = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);

      const response = await fetch(`/api/chains?${params}`);
      const data = await response.json();

      if (data.chains && data.chains.length > 0) {
        setChains(data.chains);
        setFilteredChains(data.chains);
        setAccessTiers(data.accessTiers || ['free']);
      } else {
        // Use sample data if no chains in database
        const filtered = selectedCategory
          ? SAMPLE_CHAINS.filter(c => c.category === selectedCategory)
          : SAMPLE_CHAINS;
        setFilteredChains(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch chains:', error);
      // Fallback to sample data
      setFilteredChains(SAMPLE_CHAINS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = chains.filter(chain =>
      chain.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chain.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredChains(filtered);
  }, [searchQuery, chains]);

  const isChainLocked = (chain: Chain) => {
    const tierOrder = { free: 0, starter: 1, pro: 2, complete: 3 };
    const userMaxTier = Math.max(...accessTiers.map(t => tierOrder[t as keyof typeof tierOrder] || 0));
    const chainTierOrder = tierOrder[chain.tier as keyof typeof tierOrder] || 0;
    return chainTierOrder > userMaxTier;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
            AI Prompts
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg"
          >
            Upgrade
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium mb-4">
            <Link2 className="w-4 h-4" />
            Multi-Step Workflows
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Prompt Chains
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Complete workflows that guide you step-by-step to achieve complex tasks with AI.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chains..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {selectedChain ? (
          <div>
            <button
              onClick={() => setSelectedChain(null)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all chains
            </button>
            <PromptChain
              chain={selectedChain}
              isLocked={isChainLocked(selectedChain)}
            />
          </div>
        ) : (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    className="text-left bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        chain.difficulty === 'beginner'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : chain.difficulty === 'intermediate'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {chain.difficulty}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                        {chain.steps.length} steps
                      </span>
                      {chain.isPopular && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Popular
                        </span>
                      )}
                      {isChainLocked(chain) && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full">
                          🔒 {chain.tier}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {chain.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {chain.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
