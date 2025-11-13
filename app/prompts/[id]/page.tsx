import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { CopyButton } from '@/components/CopyButton'
import { Header } from '@/components/Header'
import { PromptCard } from '@/components/PromptCard'
import { PromptCustomizer } from '@/components/PromptCustomizer'

interface PromptDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const session = await getServerSession(authOptions)
  const { id } = await params

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      category: true,
    },
  })

  if (!prompt) {
    notFound()
  }

  // Increment view count
  await prisma.prompt.update({
    where: { id },
    data: { views: { increment: 1 } },
  })

  // Check if user has access to this prompt
  const hasAccess = prompt.isFree || (session?.user && await checkUserAccess(session.user.id, prompt.tier))

  // Fetch related prompts
  const relatedPrompts = await prisma.prompt.findMany({
    where: {
      OR: [
        { categoryId: prompt.categoryId },
        { tags: { hasSome: prompt.tags } },
      ],
      id: { not: prompt.id },
    },
    include: {
      category: true,
    },
    take: 6,
    orderBy: [
      { isPopular: 'desc' },
      { views: 'desc' },
    ],
  })

  // Fetch more from same category for sidebar
  const moreCategoryPrompts = await prisma.prompt.findMany({
    where: {
      categoryId: prompt.categoryId,
      id: { not: prompt.id },
    },
    include: {
      category: true,
    },
    take: 3,
    orderBy: { views: 'desc' },
  })

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
  }

  const difficultyIcons = {
    beginner: '🌱',
    intermediate: '⚡',
    advanced: '🚀',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header */}
      <Header session={session} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-600/5 dark:via-purple-600/5 dark:to-pink-600/5 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/prompts" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Prompts
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link
              href={`/prompts?category=${prompt.category.slug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {prompt.category.name}
            </Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-slate-900 dark:text-white font-medium">{prompt.title}</span>
          </nav>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-2xl">{prompt.category.icon}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {prompt.category.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                  {prompt.title}
                </span>
              </h1>

              {/* Badges Row */}
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                {prompt.isFree ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    FREE
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-bold text-white shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18.5c-4.05-.99-7-5.27-7-9.5V8.3l7-3.11 7 3.11V11c0 4.23-2.95 8.51-7 9.5z" />
                    </svg>
                    PREMIUM
                  </span>
                )}

                {prompt.isPopular && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-sm font-bold text-white shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    POPULAR
                  </span>
                )}

                <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold border ${difficultyColors[prompt.difficulty as keyof typeof difficultyColors]}`}>
                  <span>{difficultyIcons[prompt.difficulty as keyof typeof difficultyIcons]}</span>
                  {prompt.difficulty.toUpperCase()}
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="font-medium">{prompt.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-col items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-sm font-medium">Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium">Favorite</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Category Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                  {prompt.category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Category</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{prompt.category.name}</p>
                </div>
              </div>
              {prompt.category.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {prompt.category.description}
                </p>
              )}
            </div>

            {/* Difficulty Level */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Difficulty Level</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[prompt.difficulty as keyof typeof difficultyColors]}`}>
                    {prompt.difficulty}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      prompt.difficulty === 'beginner'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-1/3'
                        : prompt.difficulty === 'intermediate'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 w-2/3'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 w-full'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Compatible AI Models */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Compatible AI Models</h3>
              <div className="space-y-2">
                {prompt.aiModel.map((model) => (
                  <div
                    key={model}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{model}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {prompt.tags.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/prompts?search=${tag}`}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* More from Category */}
            {moreCategoryPrompts.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">More from {prompt.category.name}</h3>
                <div className="space-y-3">
                  {moreCategoryPrompts.map((relatedPrompt) => (
                    <Link
                      key={relatedPrompt.id}
                      href={`/prompts/${relatedPrompt.id}`}
                      className="block group"
                    >
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1 line-clamp-2">
                          {relatedPrompt.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                          {relatedPrompt.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/prompts?category=${prompt.category.slug}`}
                  className="block mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-center"
                >
                  View all {prompt.category.name} prompts →
                </Link>
              </div>
            )}
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Description</h2>
              <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                {prompt.description}
              </p>
            </div>

            {/* Prompt Content with Customizer */}
            {hasAccess ? (
                <PromptCustomizer
                  originalContent={prompt.content}
                  promptTitle={prompt.title}
                />
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 dark:from-slate-800 dark:via-blue-950/50 dark:to-purple-950/50 rounded-2xl p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 m-8">
                    <div className="relative z-10">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                        Premium Content Locked
                      </h3>
                      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                        This prompt is part of our <span className="font-semibold text-blue-600 dark:text-blue-400">{prompt.tier}</span> tier.
                        Unlock access to view the full prompt and hundreds more.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <Link
                          href="/#pricing"
                          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Upgrade to Access
                        </Link>
                        <Link
                          href="/#pricing"
                          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                        >
                          View Pricing Plans
                        </Link>
                      </div>

                      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-8 border-t border-slate-300 dark:border-slate-700">
                        <div className="text-center">
                          <div className="text-2xl mb-2">🚀</div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">500+ Prompts</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Curated library</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">⚡</div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">Instant Access</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Download anytime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl mb-2">🔄</div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-white">Regular Updates</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">New prompts weekly</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            {/* Usage Tips */}
            {hasAccess && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50 p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">How to Use This Prompt</h3>
                    <div className="space-y-3 text-slate-700 dark:text-slate-300">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">1</span>
                        <p>Copy the prompt using the button above</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">2</span>
                        <p>Paste it into your preferred AI model ({prompt.aiModel.join(', ')})</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">3</span>
                        <p>Customize the variables or parameters as needed for your specific use case</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-sm font-bold rounded-full flex-shrink-0 mt-0.5">4</span>
                        <p>Review and refine the output to match your requirements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section (UI Only) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Reviews & Ratings</h2>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-semibold shadow-sm hover:shadow-md transition-all">
                  Write a Review
                </button>
              </div>

              {/* Overall Rating */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-950/30 rounded-xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                      4.8
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Based on 127 reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400 w-12">{rating} stars</span>
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                            style={{ width: `${rating === 5 ? 75 : rating === 4 ? 20 : rating === 3 ? 3 : rating === 2 ? 1 : 1}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 w-12 text-right">
                          {rating === 5 ? 95 : rating === 4 ? 25 : rating === 3 ? 4 : rating === 2 ? 2 : 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Reviews */}
              <div className="space-y-4">
                {[
                  {
                    name: 'Sarah Johnson',
                    rating: 5,
                    date: '2 days ago',
                    comment: 'This prompt is absolutely fantastic! Saved me hours of work and the results are consistently excellent.',
                    avatar: 'SJ',
                  },
                  {
                    name: 'Mike Chen',
                    rating: 5,
                    date: '1 week ago',
                    comment: 'Great quality and very well structured. Works perfectly with Claude and ChatGPT.',
                    avatar: 'MC',
                  },
                  {
                    name: 'Emily Rodriguez',
                    rating: 4,
                    date: '2 weeks ago',
                    comment: 'Really useful prompt. Would love to see more examples in the documentation.',
                    avatar: 'ER',
                  },
                ].map((review, index) => (
                  <div
                    key={index}
                    className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{review.name}</h4>
                          <span className="text-sm text-slate-500 dark:text-slate-400">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium transition-colors">
                  Load More Reviews
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Related Prompts Section */}
        {relatedPrompts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-2">
                  Related Prompts
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Discover more prompts you might like
                </p>
              </div>
              <Link
                href="/prompts"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all shadow-sm hover:shadow-md"
              >
                Browse All
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPrompts.map((relatedPrompt) => (
                <PromptCard key={relatedPrompt.id} prompt={relatedPrompt} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href="/prompts"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all shadow-sm hover:shadow-md"
              >
                Browse All Prompts
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky CTA */}
      {!hasAccess && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 shadow-2xl z-40">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">Unlock This Prompt</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{prompt.tier} tier required</div>
            </div>
            <Link
              href="/#pricing"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-bold shadow-lg transition-all"
            >
              Upgrade
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

async function checkUserAccess(userId: string, requiredTier: string): Promise<boolean> {
  // Check if user has purchased a tier that includes this prompt
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      status: 'completed',
    },
    include: {
      pricingTier: true,
    },
  })

  // Tier hierarchy: free < starter < pro < complete
  const tierHierarchy: { [key: string]: number } = {
    free: 0,
    starter: 1,
    pro: 2,
    complete: 3,
  }

  const userHighestTier = Math.max(
    ...purchases.map((p) => tierHierarchy[p.pricingTier.slug] || 0)
  )

  return userHighestTier >= tierHierarchy[requiredTier]
}
