'use client'

import { useState } from 'react'

interface CopyButtonProps {
  content?: string
  text?: string
  className?: string
  iconClassName?: string
}

export function CopyButton({ content, text, className, iconClassName }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const textToCopy = text || content || ''
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Default styling for backward compatibility
  const defaultClassName = "absolute top-4 right-4 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
  const buttonClassName = className || defaultClassName

  return (
    <button
      onClick={handleCopy}
      className={buttonClassName}
    >
      {copied ? (
        <span className="flex items-center gap-2">
          <svg className={iconClassName || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <svg className={iconClassName || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {className ? '' : 'Copy'}
        </span>
      )}
    </button>
  )
}
