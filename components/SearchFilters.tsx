'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface SearchFiltersProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    icon: string | null
  }>
  searchParams: {
    search?: string
    category?: string
    tier?: string
    aiModel?: string
    difficulty?: string
  }
}

export function SearchFilters({ categories, searchParams }: SearchFiltersProps) {
  const router = useRouter()
  const currentSearchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.search || '')

  useEffect(() => {
    setSearch(searchParams.search || '')
  }, [searchParams.search])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(currentSearchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/prompts?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/prompts')
  }

  const hasActiveFilters = searchParams.search || searchParams.category ||
    searchParams.tier || searchParams.aiModel || searchParams.difficulty

  return (
    <div className="mb-8 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts by title, description, or tags..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </form>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Category Filter */}
        <select
          value={searchParams.category || ''}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>

        {/* Tier Filter */}
        <select
          value={searchParams.tier || ''}
          onChange={(e) => updateFilter('tier', e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Tiers</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
          <option value="complete">Complete</option>
        </select>

        {/* Difficulty Filter */}
        <select
          value={searchParams.difficulty || ''}
          onChange={(e) => updateFilter('difficulty', e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* AI Model Filter */}
        <select
          value={searchParams.aiModel || ''}
          onChange={(e) => updateFilter('aiModel', e.target.value)}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All AI Models</option>
          <option value="ChatGPT">ChatGPT</option>
          <option value="Claude">Claude</option>
          <option value="Midjourney">Midjourney</option>
          <option value="DALL-E">DALL-E</option>
          <option value="Stable Diffusion">Stable Diffusion</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  )
}
