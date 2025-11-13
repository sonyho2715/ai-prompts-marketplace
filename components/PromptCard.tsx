import Link from 'next/link'

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    description: string
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

export function PromptCard({ prompt }: PromptCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <div className="group relative h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {prompt.isFree && (
            <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
              FREE
            </span>
          )}
          {prompt.isPopular && (
            <span className="rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-400">
              POPULAR
            </span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyColors[prompt.difficulty as keyof typeof difficultyColors]}`}>
            {prompt.difficulty}
          </span>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{prompt.category.icon}</span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {prompt.category.name}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {prompt.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {prompt.description}
        </p>

        {/* AI Models */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {prompt.aiModel.slice(0, 3).map((model) => (
            <span
              key={model}
              className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs text-slate-700 dark:text-slate-300"
            >
              {model}
            </span>
          ))}
          {prompt.aiModel.length > 3 && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              +{prompt.aiModel.length - 3} more
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Arrow icon on hover */}
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
