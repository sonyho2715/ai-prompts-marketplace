interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'blue' | 'white' | 'purple' | 'slate'
  className?: string
}

export function LoadingSpinner({ size = 'md', color = 'blue', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }

  const colorClasses = {
    blue: 'border-blue-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    purple: 'border-purple-600 border-t-transparent',
    slate: 'border-slate-600 border-t-transparent',
  }

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" color="blue" />
        <p className="text-lg font-semibold text-slate-900 dark:text-white">{message}</p>
      </div>
    </div>
  )
}

interface ButtonLoadingProps {
  loading?: boolean
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export function ButtonLoading({
  loading = false,
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
}: ButtonLoadingProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative ${className} ${loading || disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" color="white" />
        </div>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </button>
  )
}

interface CardSkeletonProps {
  count?: number
}

export function CardSkeleton({ count = 3 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse"
        >
          {/* Top badges skeleton */}
          <div className="flex justify-between mb-4">
            <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>

          {/* Title skeleton */}
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-3/4" />

          {/* Description skeleton */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
          </div>

          {/* Difficulty skeleton */}
          <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full mb-4" />

          {/* AI Models skeleton */}
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-2">
            <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </>
  )
}
