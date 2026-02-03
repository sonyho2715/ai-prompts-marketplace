'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Building2, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

type BillingType = 'monthly' | 'annual' | 'lifetime';

const PRICING_TIERS = [
  {
    name: 'Free',
    slug: 'free',
    description: 'Get started with essential prompts',
    monthlyPrice: 0,
    annualPrice: 0,
    lifetimePrice: 0,
    promptCount: 20,
    features: [
      '20 curated prompts',
      'All categories access',
      'Basic prompt optimizer (3 uses)',
      'Email support',
    ],
    limitations: [
      'Limited prompt selection',
      'No prompt chains',
      'No priority updates',
    ],
    cta: 'Get Started Free',
    popular: false,
    icon: Zap,
    color: 'gray',
  },
  {
    name: 'Pro',
    slug: 'pro',
    description: 'For professionals who need more',
    monthlyPrice: 19,
    annualPrice: 149,
    lifetimePrice: 199,
    promptCount: 500,
    features: [
      '500+ premium prompts',
      'All categories access',
      'Unlimited prompt optimizer',
      'Prompt chains & workflows',
      'Industry customization',
      'Priority email support',
      'Weekly new prompts',
    ],
    limitations: [],
    cta: 'Get Pro Access',
    popular: true,
    icon: Sparkles,
    color: 'purple',
  },
  {
    name: 'Complete',
    slug: 'complete',
    description: 'The ultimate prompt library',
    monthlyPrice: 29,
    annualPrice: 199,
    lifetimePrice: 299,
    promptCount: 1000,
    features: [
      '1000+ master prompts',
      'Everything in Pro',
      'Advanced prompt chains',
      'VIP support (24h response)',
      'Early access to new features',
      'Private community access',
      'Custom prompt requests',
      'API access (coming soon)',
    ],
    limitations: [],
    cta: 'Get Complete Access',
    popular: false,
    icon: Crown,
    color: 'amber',
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'For teams and agencies',
    monthlyPrice: null,
    annualPrice: null,
    lifetimePrice: null,
    promptCount: 'Unlimited',
    features: [
      'Unlimited team members',
      'Custom prompt development',
      'Dedicated account manager',
      'SSO & advanced security',
      'Usage analytics dashboard',
      'Custom integrations',
      'Training & onboarding',
      'SLA guarantee',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
    icon: Building2,
    color: 'blue',
  },
];

export default function PricingPage() {
  const [billingType, setBillingType] = useState<BillingType>('lifetime');
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierSlug: string) => {
    if (tierSlug === 'free') {
      window.location.href = '/login?redirect=/dashboard';
      return;
    }

    if (tierSlug === 'enterprise') {
      window.location.href = 'mailto:sales@aiprompts.com?subject=Enterprise Inquiry';
      return;
    }

    setLoadingTier(tierSlug);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId: tierSlug, // In production, use actual tier ID from database
          billingType,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoadingTier(null);
    }
  };

  const getPrice = (tier: typeof PRICING_TIERS[0]) => {
    if (tier.monthlyPrice === null) return 'Custom';
    if (billingType === 'monthly') return tier.monthlyPrice;
    if (billingType === 'annual') return tier.annualPrice;
    return tier.lifetimePrice;
  };

  const getSavings = (tier: typeof PRICING_TIERS[0]) => {
    if (!tier.monthlyPrice || tier.monthlyPrice === 0) return null;
    if (billingType === 'annual') {
      const monthlyCost = tier.monthlyPrice * 12;
      const savings = monthlyCost - tier.annualPrice;
      return savings > 0 ? `Save $${savings}/year` : null;
    }
    if (billingType === 'lifetime') {
      return 'One-time payment';
    }
    return null;
  };

  const colorClasses = {
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      button: 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 dark:text-gray-900',
      icon: 'text-gray-600 dark:text-gray-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-300 dark:border-purple-700 ring-2 ring-purple-500',
      button: 'bg-purple-600 hover:bg-purple-700',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-700',
      button: 'bg-amber-600 hover:bg-amber-700',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Prompts
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            {(['monthly', 'annual', 'lifetime'] as BillingType[]).map((type) => (
              <button
                key={type}
                onClick={() => setBillingType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  billingType === type
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {type === 'monthly' && 'Monthly'}
                {type === 'annual' && 'Annual'}
                {type === 'lifetime' && 'Lifetime'}
              </button>
            ))}
          </div>
          {billingType === 'annual' && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
              Save up to 35%
            </span>
          )}
          {billingType === 'lifetime' && (
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
              Best Value
            </span>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => {
            const colors = colorClasses[tier.color as keyof typeof colorClasses];
            const Icon = tier.icon;
            const price = getPrice(tier);
            const savings = getSavings(tier);

            return (
              <div
                key={tier.slug}
                className={`relative rounded-2xl p-6 ${colors.bg} border-2 ${colors.border} flex flex-col`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${tier.popular ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {tier.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {tier.description}
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    {typeof price === 'number' ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ${price}
                        </span>
                        {price > 0 && (
                          <span className="text-gray-500 dark:text-gray-400">
                            {billingType === 'monthly' && '/mo'}
                            {billingType === 'annual' && '/yr'}
                            {billingType === 'lifetime' && ' once'}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {price}
                      </span>
                    )}
                  </div>
                  {savings && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      {savings}
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {tier.promptCount}
                  </span>{' '}
                  {typeof tier.promptCount === 'number' ? 'prompts' : 'prompts'}
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(tier.slug)}
                  disabled={loadingTier === tier.slug}
                  className={`w-full py-3 px-4 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2 ${colors.button} disabled:opacity-50`}
                >
                  {loadingTier === tier.slug ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {tier.cta}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: 'What happens after I purchase?',
                a: 'You get instant access to all prompts in your tier. Log in anytime to browse, copy, and use them.',
              },
              {
                q: 'Can I upgrade later?',
                a: 'Yes! You can upgrade anytime. We will credit your previous purchase toward the upgrade.',
              },
              {
                q: 'Is there a refund policy?',
                a: 'Yes, we offer a 30-day money-back guarantee. No questions asked.',
              },
              {
                q: 'What is the AI Prompt Optimizer?',
                a: 'It uses Claude AI to transform your rough ideas into professionally crafted prompts optimized for your target AI.',
              },
              {
                q: 'Do I own the prompts I create?',
                a: 'Yes! Any prompts you create using our optimizer or customize are yours to use commercially.',
              },
              {
                q: 'How often are new prompts added?',
                a: 'Pro and Complete members get new prompts weekly. We add 20-50 new prompts each month.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@aiprompts.com"
            className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
          >
            Contact our support team →
          </a>
        </div>
      </div>
    </div>
  );
}
