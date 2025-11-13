'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EnhancedPromptCard } from './EnhancedPromptCard'

interface PromptsContentProps {
  prompts: any[]
  categories: Array<{
    id: string
    name: string
    slug: string
    icon: string | null
    _count: {
      prompts: number
    }
  }>
  totalCount: number
  currentPage: number
  totalPages: number
  itemsPerPage: number
  searchParams: {
    search?: string
    category?: string
    tier?: string
    aiModel?: string
    difficulty?: string
    sort?: string
  }
}

export function PromptsContent({
  prompts,
  categories,
  totalCount,
  currentPage,
  totalPages,
  itemsPerPage,
  searchParams,
}: PromptsContentProps) {
  const router = useRouter()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(searchParams.search || '')

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams()

    // Keep existing params
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== key && k !== 'page') {
        params.set(k, v)
      }
    })

    // Set new value or remove if empty
    if (value) {
      params.set(key, value)
    }

    router.push(`/prompts?${params.toString()}`)
  }

  const removeFilter = (key: string) => {
    updateFilter(key, '')
  }

  const clearAllFilters = () => {
    setSearchInput('')
    router.push('/prompts')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', searchInput)
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    params.set('page', String(page))
    return `/prompts?${params.toString()}`
  }

  const activeFiltersCount = Object.entries(searchParams).filter(([k, v]) => v && k !== 'sort').length

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
          Home
        </Link>
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-900 dark:text-white font-medium">Browse Prompts</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8 lg:mb-12">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Browse AI Prompts
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Discover {totalCount.toLocaleString()} expert prompts to supercharge your AI workflow
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-3xl">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search prompts by title, description, or tags..."
            className="w-full px-6 py-4 pl-14 pr-32 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg shadow-sm"
          />
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Quick Filters */}
        <div className="flex items-center gap-3 mt-6 flex-wrap">
          <button
            onClick={() => updateFilter('sort', 'popular')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              searchParams.sort === 'popular' || !searchParams.sort
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => updateFilter('tier', 'free')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              searchParams.tier === 'free'
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-green-500'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => updateFilter('sort', 'newest')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              searchParams.sort === 'newest'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-purple-500'
            }`}
          >
            New
          </button>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-20 space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => removeFilter('category')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    !searchParams.category
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-xs text-slate-500">{totalCount}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      searchParams.category === cat.slug
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {cat.name}
                    </span>
                    <span className="text-xs text-slate-500">{cat._count.prompts}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Tier */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pricing
              </h3>
              <div className="space-y-2">
                {['free', 'starter', 'pro', 'complete'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => updateFilter('tier', tier)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                      searchParams.tier === tier
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Difficulty
              </h3>
              <div className="space-y-2">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateFilter('difficulty', level)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                      searchParams.difficulty === level
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Model */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                AI Model
              </h3>
              <div className="space-y-2">
                {['ChatGPT', 'Claude', 'Midjourney', 'DALL-E', 'Stable Diffusion'].map((model) => (
                  <button
                    key={model}
                    onClick={() => updateFilter('aiModel', model)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      searchParams.aiModel === model
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mb-6 flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Active filters:</span>
              {searchParams.search && (
                <button
                  onClick={() => { setSearchInput(''); removeFilter('search') }}
                  className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Search: {searchParams.search}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {searchParams.category && (
                <button
                  onClick={() => removeFilter('category')}
                  className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium flex items-center gap-2 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  Category: {categories.find(c => c.slug === searchParams.category)?.name}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {searchParams.tier && (
                <button
                  onClick={() => removeFilter('tier')}
                  className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors capitalize"
                >
                  Tier: {searchParams.tier}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {searchParams.difficulty && (
                <button
                  onClick={() => removeFilter('difficulty')}
                  className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-medium flex items-center gap-2 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors capitalize"
                >
                  Difficulty: {searchParams.difficulty}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {searchParams.aiModel && (
                <button
                  onClick={() => removeFilter('aiModel')}
                  className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 text-sm font-medium flex items-center gap-2 hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                >
                  AI Model: {searchParams.aiModel}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Showing <span className="font-semibold text-slate-900 dark:text-white">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-semibold text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, totalCount)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{totalCount.toLocaleString()}</span> prompts
            </div>

            {/* Sort Dropdown */}
            <select
              value={searchParams.sort || 'popular'}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="most-used">Most Used</option>
            </select>
          </div>

          {/* Prompts Grid */}
          {prompts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="inline-block p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-3">
                No prompts found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                We couldn't find any prompts matching your criteria. Try adjusting your filters or search query.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <EnhancedPromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous/Next Buttons */}
              <div className="flex items-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildPageUrl(currentPage - 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </div>
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={buildPageUrl(currentPage + 1)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed">
                    Next
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 7) {
                    pageNum = i + 1
                  } else if (currentPage <= 4) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i
                  } else {
                    pageNum = currentPage - 3 + i
                  }

                  return (
                    <Link
                      key={pageNum}
                      href={buildPageUrl(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                        pageNum === currentPage
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  )
                })}
              </div>

              {/* Page Info */}
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-900 z-50 overflow-y-auto lg:hidden shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Mobile Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => { removeFilter('category'); setIsMobileFiltersOpen(false) }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                        !searchParams.category
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="text-xs text-slate-500">{totalCount}</span>
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => { updateFilter('category', cat.slug); setIsMobileFiltersOpen(false) }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                          searchParams.category === cat.slug
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          {cat.name}
                        </span>
                        <span className="text-xs text-slate-500">{cat._count.prompts}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Pricing */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Pricing</h3>
                  <div className="space-y-2">
                    {['free', 'starter', 'pro', 'complete'].map((tier) => (
                      <button
                        key={tier}
                        onClick={() => { updateFilter('tier', tier); setIsMobileFiltersOpen(false) }}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm capitalize ${
                          searchParams.tier === tier
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Difficulty */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Difficulty</h3>
                  <div className="space-y-2">
                    {['beginner', 'intermediate', 'advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => { updateFilter('difficulty', level); setIsMobileFiltersOpen(false) }}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm capitalize ${
                          searchParams.difficulty === level
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile AI Model */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">AI Model</h3>
                  <div className="space-y-2">
                    {['ChatGPT', 'Claude', 'Midjourney', 'DALL-E', 'Stable Diffusion'].map((model) => (
                      <button
                        key={model}
                        onClick={() => { updateFilter('aiModel', model); setIsMobileFiltersOpen(false) }}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm ${
                          searchParams.aiModel === model
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => { clearAllFilters(); setIsMobileFiltersOpen(false) }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-red-500 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
