import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const pricingTiers = await prisma.pricingTier.findMany({
    orderBy: { order: 'asc' },
  })

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    take: 6,
  })

  const popularPrompts = await prisma.prompt.findMany({
    where: { isPopular: true },
    include: { category: true },
    orderBy: { views: 'desc' },
    take: 3,
  })

  const stats = {
    totalPrompts: await prisma.prompt.count(),
    categories: await prisma.category.count(),
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Prompts Pro
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/prompts"
                className="hidden md:block text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
              >
                Browse Library
              </Link>
              <Link
                href="#pricing"
                className="hidden md:block text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20">
        {/* Animated background decoration */}
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Join 50,000+ professionals using our AI prompts
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
              Stop Struggling With AI.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Start Getting Results.
              </span>
            </h1>

            <p className="mx-auto max-w-3xl text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
              Access {stats.totalPrompts.toLocaleString()}+ battle-tested prompts that turn ChatGPT, Claude, and Midjourney
              into your personal team of experts. <span className="font-semibold text-slate-900 dark:text-white">Save 10+ hours per week.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="#pricing"
                className="group w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-5 text-lg font-semibold text-white hover:shadow-2xl hover:shadow-blue-500/50 transition-all hover:scale-105"
              >
                <span className="flex items-center gap-2 justify-center">
                  Get Instant Access
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/prompts"
                className="group w-full sm:w-auto rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-10 py-5 text-lg font-semibold text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xl transition-all"
              >
                <span className="flex items-center gap-2 justify-center">
                  Browse 100+ Free Prompts
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Free Updates Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">30-Day Money-Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Happy Users</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {stats.totalPrompts.toLocaleString()}+
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">AI Prompts</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-2">
                4.9/5
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">User Rating</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-800 p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                10hrs
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Saved/Week</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Logos */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 mb-8">
            WORKS WITH ALL MAJOR AI PLATFORMS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">ChatGPT</div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">Claude</div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">Midjourney</div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">DALL-E</div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">Gemini</div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">Stable Diffusion</div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block rounded-full bg-red-100 dark:bg-red-900/30 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 mb-6">
              The Problem
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Generic AI outputs are costing you time and money
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>Spending hours tweaking prompts instead of getting work done</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>Getting vague, generic responses that need heavy editing</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>Wasting money on AI subscriptions that underdeliver</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p>Missing deadlines because AI isn't understanding your needs</p>
              </div>
            </div>
          </div>
          <div>
            <div className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-300 mb-6">
              The Solution
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              Expert prompts that deliver professional results instantly
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Copy-paste ready prompts that work perfectly the first time</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Detailed, specific outputs that need minimal editing</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Get 10x more value from your existing AI subscriptions</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>Ship projects faster and exceed expectations every time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Loved by professionals worldwide
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Join thousands who have transformed their AI workflow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                "These prompts have saved me at least 10 hours per week. The quality of output is incredible - it's like having a team of experts at my fingertips."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Sarah Martinez</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Content Marketing Manager</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                "I was skeptical at first, but after using these prompts for a week, I'm blown away. My clients are happier and I'm finishing projects 3x faster."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  JC
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">James Chen</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Freelance Designer</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                "Best investment I've made this year. The ROI was immediate - I closed my first big client using outputs from these prompts within days."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                  EP
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Emily Parker</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Business Consultant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need to master AI
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Powerful features designed to 10x your productivity and unlock AI's full potential
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Battle-Tested Prompts
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Every prompt has been refined through hundreds of real-world uses. Get proven results, not experiments.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Zero Learning Curve
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              No tutorials needed. Copy, paste, and get professional results in seconds. That simple.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Always Up-to-Date
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              New prompts added weekly. Free lifetime updates mean your library grows with AI technology.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-green-300 dark:hover:border-green-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Universal Compatibility
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Works with ChatGPT, Claude, Midjourney, DALL-E, Gemini, and any AI tool. One library, infinite possibilities.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-orange-300 dark:hover:border-orange-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Smart Search & Filters
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Find exactly what you need in seconds with powerful filters by category, AI model, difficulty, and use case.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-red-300 dark:hover:border-red-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              One-Time Payment
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Pay once, own forever. No subscriptions, no recurring fees, no surprises. Just lifetime access.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Detailed Documentation
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Each prompt includes usage tips, examples, and variations. Learn as you go and master advanced techniques.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-700 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Community Access
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Join our private Discord community. Share results, get feedback, and discover new use cases from other pros.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Get started in under 60 seconds
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              No setup, no complexity, no learning curve. Just instant results.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl font-bold mb-6 shadow-lg relative z-10">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Pick Your Perfect Plan
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Start free or choose a plan that fits your needs. All plans include instant access.
              </p>
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-bold mb-6 shadow-lg relative z-10">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Find Your Prompt
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Search by category, AI model, or use case. Preview before you copy.
              </p>
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-600 to-red-600 text-white text-2xl font-bold mb-6 shadow-lg relative z-10">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Copy, Paste, Done
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                One click to copy, paste into any AI tool, and get professional results instantly.
              </p>
            </div>
          </div>

          {/* Visual Process Flow */}
          <div className="mt-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">BEFORE</div>
                <div className="text-lg text-slate-600 dark:text-slate-400">
                  2-3 hours tweaking prompts, editing outputs, frustrated with results
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex-1 text-center md:text-right">
                <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">AFTER</div>
                <div className="text-lg text-slate-600 dark:text-slate-400">
                  30 seconds to find prompt, instant professional results, time for coffee
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Prompts for every profession and project
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {stats.categories} categories covering every use case imaginable
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/prompts?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-2xl hover:scale-105"
            >
              <div className="text-5xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {category.description}
              </p>
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                <span>Explore prompts</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white hover:shadow-xl hover:shadow-blue-500/50 transition-all"
          >
            Browse All {stats.totalPrompts.toLocaleString()} Prompts
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950/20 dark:to-purple-950/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Choose your plan, own it forever
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              One-time payment. Lifetime access. No subscriptions. Ever.
            </p>
            <div className="inline-flex items-center gap-3 bg-green-100 dark:bg-green-900/30 rounded-full px-6 py-3 text-sm font-semibold text-green-700 dark:text-green-300">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Limited Time: Get 30% off all plans
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.id}
                className={`relative rounded-2xl border-2 p-8 ${
                  tier.isPopular
                    ? 'border-blue-500 shadow-2xl scale-105 bg-white dark:bg-slate-900'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      ${tier.price}
                    </span>
                    {tier.price > 0 && <span className="text-slate-600 dark:text-slate-400 text-sm">/one-time</span>}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {tier.description}
                  </p>
                </div>
                <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {tier.promptCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Professional AI Prompts
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.price === 0 ? '/prompts?tier=free' : `/checkout?tier=${tier.slug}`}
                  className={`block w-full rounded-lg py-3 text-center font-semibold transition-all ${
                    tier.isPopular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:shadow-blue-500/50'
                      : 'border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  {tier.price === 0 ? 'Start Free' : 'Get Lifetime Access'}
                </Link>
                {tier.price > 0 && (
                  <p className="text-xs text-center text-slate-500 dark:text-slate-500 mt-3">
                    30-day money-back guarantee
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Still not sure? Start with our free plan and upgrade anytime.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No Subscriptions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Everything you need to know before getting started
          </p>
        </div>
        <div className="space-y-4">
          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                How do these prompts actually work?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Simply copy any prompt from our library and paste it into your AI tool of choice (ChatGPT, Claude, Midjourney, etc.).
              The prompts are pre-engineered to generate high-quality outputs without any modification needed. Each prompt includes
              specific instructions, context, and formatting that guides the AI to produce exactly what you need.
            </p>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                What AI tools are these prompts compatible with?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Our prompts work with all major AI platforms including ChatGPT (3.5, 4, 4o), Claude (all versions), Google Gemini,
              Midjourney, DALL-E, Stable Diffusion, and more. Each prompt is labeled with recommended AI tools, but most are
              universal and can be adapted to any platform.
            </p>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                Is this really a one-time payment, or will I be charged again?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes, it's truly a one-time payment. No subscriptions, no recurring charges, no hidden fees. Pay once and get
              lifetime access to your tier's prompts plus all future updates. We add new prompts weekly, and you'll get
              access to all of them at no additional cost.
            </p>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                Can I upgrade from a lower tier to a higher one later?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Absolutely! You can upgrade at any time, and we'll credit what you already paid toward the higher tier.
              For example, if you start with Starter and later want Pro, you'll only pay the difference. Your previous
              purchase never goes to waste.
            </p>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                What if the prompts don't work for me?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              We offer a 30-day money-back guarantee, no questions asked. If you're not satisfied with the prompts for any
              reason, just email us within 30 days and we'll refund your full purchase. We're confident you'll love them,
              but we want you to feel completely secure in your purchase.
            </p>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                Do I need any technical skills to use these prompts?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Not at all! If you can copy and paste text, you can use our prompts. No coding, no technical knowledge, no
              special tools required. Each prompt comes with simple instructions and examples. You'll be generating
              professional AI outputs within minutes of signing up.
            </p>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                How often do you add new prompts?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              We add 20-30 new prompts every week across various categories. All updates are included free for life with
              your purchase. As AI technology evolves, we continuously refine existing prompts and create new ones to
              ensure you always have the best tools available.
            </p>
          </details>

          <details className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:shadow-lg transition-all">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                Can I use these prompts for commercial projects?
              </span>
              <svg className="w-5 h-5 text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! All outputs generated using our prompts are 100% yours to use commercially. Create content for clients,
              build products, generate marketing materials - whatever you need. The only thing you can't do is resell the
              prompts themselves as part of a competing prompt library.
            </p>
          </details>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-20">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to 10x your AI productivity?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 50,000+ professionals who have already transformed their workflow with our expert prompts.
            Start getting better results in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="#pricing"
              className="group w-full sm:w-auto rounded-xl bg-white px-10 py-5 text-lg font-semibold text-blue-600 hover:shadow-2xl hover:scale-105 transition-all"
            >
              <span className="flex items-center gap-2 justify-center">
                Get Started Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/prompts"
              className="w-full sm:w-auto rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-10 py-5 text-lg font-semibold text-white hover:bg-white/20 transition-all"
            >
              Browse Free Prompts
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card for free tier</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-day guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/prompts" className="hover:text-slate-900 dark:hover:text-white transition-colors">Browse Prompts</Link></li>
                <li><Link href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/categories" className="hover:text-slate-900 dark:hover:text-white transition-colors">Categories</Link></li>
                <li><Link href="/new" className="hover:text-slate-900 dark:hover:text-white transition-colors">New Prompts</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/blog" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-slate-900 dark:hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/tutorials" className="hover:text-slate-900 dark:hover:text-white transition-colors">Tutorials</Link></li>
                <li><Link href="/community" className="hover:text-slate-900 dark:hover:text-white transition-colors">Community</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/affiliates" className="hover:text-slate-900 dark:hover:text-white transition-colors">Affiliates</Link></li>
                <li><Link href="/careers" className="hover:text-slate-900 dark:hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/refunds" className="hover:text-slate-900 dark:hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/licenses" className="hover:text-slate-900 dark:hover:text-white transition-colors">Licenses</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-slate-600 dark:text-slate-400 text-sm">
                &copy; 2025 AI Prompts Pro. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
