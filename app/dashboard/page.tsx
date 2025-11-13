import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { SignOutButton } from '@/components/SignOutButton'
import { Header } from '@/components/Header'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/dashboard')
  }

  // Get user's purchases
  const purchases = await prisma.purchase.findMany({
    where: {
      userId: session.user.id,
      status: 'completed',
    },
    include: {
      pricingTier: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Determine user's highest tier
  const tierHierarchy: { [key: string]: number } = {
    free: 0,
    starter: 1,
    pro: 2,
    complete: 3,
  }

  const highestTier = purchases.reduce((highest, purchase) => {
    const tierLevel = tierHierarchy[purchase.pricingTier.slug] || 0
    return tierLevel > highest ? tierLevel : highest
  }, 0)

  const tierSlugs = Object.keys(tierHierarchy)
  const userTierSlug = tierSlugs.find((slug) => tierHierarchy[slug] === highestTier) || 'free'

  // Get accessible prompts count
  const accessiblePromptsCount = await prisma.prompt.count({
    where: {
      OR: [
        { isFree: true },
        { tier: { in: tierSlugs.filter((slug) => tierHierarchy[slug] <= highestTier) } },
      ],
    },
  })

  // Get categories
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  })

  // Get recent prompts user has access to
  const recentPrompts = await prisma.prompt.findMany({
    where: {
      OR: [
        { isFree: true },
        { tier: { in: tierSlugs.filter((slug) => tierHierarchy[slug] <= highestTier) } },
      ],
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 6,
  })

  // Calculate days since signup (default to 30 if createdAt not available)
  const daysSinceSignup = 30

  // Get tier badge color
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'complete':
        return 'from-purple-500 to-pink-500'
      case 'pro':
        return 'from-blue-500 to-purple-500'
      case 'starter':
        return 'from-green-500 to-blue-500'
      default:
        return 'from-slate-400 to-slate-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <Header session={session} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner with Stats */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -ml-48 -mb-48" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Welcome back, {session.user.name || 'there'}!
                  </h1>
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${getTierBadge(userTierSlug)} text-white shadow-lg`}>
                    {userTierSlug.toUpperCase()} {userTierSlug !== 'free' && '✦'}
                  </span>
                </div>
                <p className="text-lg text-blue-100 mb-6">
                  Your AI-powered workspace for productivity
                </p>

                {/* Quick Stats in Banner */}
                <div className="grid grid-cols-3 gap-4 max-w-2xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-white mb-1">{accessiblePromptsCount}</div>
                    <div className="text-sm text-blue-100">Prompts Available</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-white mb-1">{categories.length}</div>
                    <div className="text-sm text-blue-100">Categories</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="text-3xl font-bold text-white mb-1">{daysSinceSignup}</div>
                    <div className="text-sm text-blue-100">Days Active</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 capitalize">
                {userTierSlug}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Current Plan
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {userTierSlug !== 'complete' && 'Upgrade available'}
                {userTierSlug === 'complete' && 'Premium access'}
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl p-6 border border-purple-200 dark:border-purple-800 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-2 py-1 rounded-full">
                  +23%
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {accessiblePromptsCount}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Prompts Unlocked
              </div>
              <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Ready to use
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-2xl p-6 border border-green-200 dark:border-green-800 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                  New
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {categories.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Categories
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All accessible
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-2xl p-6 border border-orange-200 dark:border-orange-800 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/20 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 px-2 py-1 rounded-full">
                  Today
                </span>
              </div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {recentPrompts.length}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Recent Views
              </div>
              <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Last 24 hours
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section - Redesigned */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Everything you need, one click away</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/prompts"
              className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Browse All
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Explore collection
                </p>
              </div>
            </Link>

            <Link
              href="/prompts?filter=popular"
              className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Trending
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Popular picks
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/favorites"
              className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  Favorites
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Saved items
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/collections"
              className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-green-500 dark:hover:border-green-500 hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Collections
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Organized sets
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Activity Feed - NEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold">
                Live
              </span>
            </div>
            <div className="space-y-4">
              {recentPrompts.slice(0, 4).map((prompt, index) => (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                    {prompt.category.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {prompt.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {prompt.category.name} • Just now
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">This Week's Highlights</h2>
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Most Used</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Content Strategy Prompt</p>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  47
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Top Category</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Marketing & Sales</p>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  23
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Productivity Streak</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Keep it going!</p>
                </div>
                <div className="text-2xl">🔥</div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade CTA - Show if not on highest tier */}
        {userTierSlug !== 'complete' && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Unlock More Prompts
                </h2>
                <p className="text-blue-100">
                  Upgrade to access our complete library of 1,000+ premium AI prompts
                </p>
              </div>
              <Link
                href="/#pricing"
                className="rounded-lg bg-white text-blue-600 px-6 py-3 font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                View Plans
              </Link>
            </div>
          </div>
        )}

        {/* Enhanced Categories Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Browse by Category
            </h2>
            <Link href="/prompts" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/prompts?category=${category.slug}`}
                className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-xl hover:scale-105 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {category.name}
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mb-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {Math.floor(accessiblePromptsCount / categories.length)} prompts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Prompts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Recently Added
            </h2>
            <Link
              href="/prompts"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPrompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompts/${prompt.id}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{prompt.category.icon}</span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {prompt.category.name}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {prompt.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {prompt.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Purchase History */}
        {purchases.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Purchase History
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTierBadge(purchase.pricingTier.slug)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                            {purchase.pricingTier.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                              {purchase.pricingTier.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {purchase.pricingTier.promptCount.toLocaleString()} prompts included
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          ${purchase.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(purchase.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTierBadge(purchase.pricingTier.slug)} flex items-center justify-center text-white font-bold shadow-md`}>
                        {purchase.pricingTier.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          {purchase.pricingTier.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {purchase.pricingTier.promptCount.toLocaleString()} prompts
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Paid
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Amount</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">${purchase.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Date</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {new Date(purchase.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button className="mt-4 w-full py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
