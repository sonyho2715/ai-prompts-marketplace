'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface EnhancedPromptCardProps {
  prompt: {
    id: string
    title: string
    description: string
    content: string
    category: {
      name: string
      icon: string | null
      slug: string
    }
    tags: string[]
    aiModel: string[]
    difficulty: string
    isFree: boolean
    isPopular: boolean
    tier: string
  }
}

export function EnhancedPromptCard({ prompt }: EnhancedPromptCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const difficultyConfig = {
    beginner: {
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      icon: '★',
    },
    intermediate: {
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      icon: '★★',
    },
    advanced: {
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      icon: '★★★',
    },
  }

  const tierConfig = {
    free: { label: 'FREE', color: 'bg-green-500', textColor: 'text-white' },
    starter: { label: 'STARTER', color: 'bg-blue-500', textColor: 'text-white' },
    pro: { label: 'PRO', color: 'bg-purple-500', textColor: 'text-white' },
    complete: { label: 'COMPLETE', color: 'bg-gradient-to-r from-purple-500 to-pink-500', textColor: 'text-white' },
  }

  const difficulty = difficultyConfig[prompt.difficulty as keyof typeof difficultyConfig] || difficultyConfig.beginner
  const tier = tierConfig[prompt.tier as keyof typeof tierConfig] || tierConfig.free

  return (
    <div
      className="group relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/prompts/${prompt.id}`} className="block h-full">
        <div className="relative h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl hover:-translate-y-1">
          {/* Category Badge with Icon */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-lg">{prompt.category.icon}</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {prompt.category.name}
              </span>
            </div>
          </div>

          {/* Tier Badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className={`px-3 py-1 rounded-full ${tier.color} ${tier.textColor} text-xs font-bold shadow-md`}>
              {tier.label}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 pt-16">
            {/* Popular Badge */}
            {prompt.isPopular && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold mb-3 shadow-sm">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                POPULAR
              </div>
            )}

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {prompt.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
              {prompt.description}
            </p>

            {/* Difficulty Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${difficulty.color}`}>
                <span>{difficulty.icon}</span>
                <span className="capitalize">{prompt.difficulty}</span>
              </span>
            </div>

            {/* AI Models */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {prompt.aiModel.slice(0, 3).map((model) => (
                <span
                  key={model}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600"
                >
                  {model}
                </span>
              ))}
              {prompt.aiModel.length > 3 && (
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  +{prompt.aiModel.length - 3}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap min-h-[24px]">
              {prompt.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-slate-500 dark:text-slate-400 font-medium"
                >
                  #{tag}
                </span>
              ))}
              {prompt.tags.length > 2 && (
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  +{prompt.tags.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Hover Overlay with Actions - Better contrast with darker gradient from bottom */}
          <div
            className={`absolute inset-0 flex flex-col justify-end pb-8 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{
              background: 'linear-gradient(to top, rgba(30, 41, 59, 0.97) 0%, rgba(30, 41, 59, 0.90) 40%, rgba(30, 41, 59, 0.6) 70%, transparent 100%)'
            }}
          >
            {/* Title in overlay with good contrast */}
            <div className="px-6 mb-4">
              <h3 className="text-xl font-bold text-white drop-shadow-lg mb-2 line-clamp-2">
                {prompt.title}
              </h3>
              <p className="text-white/90 text-sm drop-shadow line-clamp-2">
                {prompt.description}
              </p>
            </div>

            <div className="space-y-3 w-full px-6">
              <div className="flex items-center justify-center gap-3">
                <div className="flex-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      // Link will handle navigation
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
                <CopyButton
                  text={prompt.content}
                  className="px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white hover:text-slate-900 transition-all shadow-lg"
                  iconClassName="w-5 h-5"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
