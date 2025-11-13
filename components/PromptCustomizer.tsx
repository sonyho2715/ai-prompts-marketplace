'use client'

import { useState, useEffect } from 'react'
import { CopyButton } from './CopyButton'

interface PromptCustomizerProps {
  originalContent: string
  promptTitle: string
}

interface Variable {
  key: string
  label: string
  placeholder: string
  value: string
}

export function PromptCustomizer({ originalContent, promptTitle }: PromptCustomizerProps) {
  const [variables, setVariables] = useState<Variable[]>([])
  const [customizedContent, setCustomizedContent] = useState(originalContent)
  const [showFullscreen, setShowFullscreen] = useState(false)

  // Extract variables from prompt content (anything in [BRACKETS] or {CURLY_BRACES})
  useEffect(() => {
    const bracketMatches = originalContent.match(/\[([A-Z_\s\/]+)\]/g) || []
    const curlyMatches = originalContent.match(/\{([A-Z_\s\/]+)\}/g) || []
    const allMatches = [...new Set([...bracketMatches, ...curlyMatches])]

    const extractedVars: Variable[] = allMatches.map((match) => {
      const cleanKey = match.replace(/[\[\]\{\}]/g, '')
      const label = cleanKey
        .split('_')
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ')

      return {
        key: match,
        label,
        placeholder: `Enter ${label.toLowerCase()}...`,
        value: '',
      }
    })

    setVariables(extractedVars)
  }, [originalContent])

  // Update customized content when variables change
  useEffect(() => {
    let updated = originalContent
    variables.forEach((variable) => {
      if (variable.value) {
        // Replace all instances of the variable key with the user's value
        const regex = new RegExp(variable.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        updated = updated.replace(regex, variable.value)
      }
    })
    setCustomizedContent(updated)
  }, [variables, originalContent])

  const handleVariableChange = (key: string, value: string) => {
    setVariables((prev) =>
      prev.map((v) => (v.key === key ? { ...v, value } : v))
    )
  }

  const resetVariables = () => {
    setVariables((prev) => prev.map((v) => ({ ...v, value: '' })))
  }

  const hasVariables = variables.length > 0
  const allVariablesFilled = variables.every((v) => v.value.trim() !== '')

  return (
    <div className="space-y-6">
      {/* Variable Input Form */}
      {hasVariables && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                ✨ Customize Your Prompt
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Fill in the fields below to personalize this prompt
              </p>
            </div>
            {variables.some((v) => v.value) && (
              <button
                onClick={resetVariables}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
              >
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variables.map((variable) => (
              <div key={variable.key}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {variable.label}
                </label>
                <input
                  type="text"
                  value={variable.value}
                  onChange={(e) => handleVariableChange(variable.key, e.target.value)}
                  placeholder={variable.placeholder}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                />
              </div>
            ))}
          </div>

          {allVariablesFilled && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">All fields completed! Your customized prompt is ready below.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Prompt Content Display */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header with better contrast */}
        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">
              {hasVariables && variables.some((v) => v.value) ? 'Customized Prompt' : 'Prompt Content'}
            </h2>
            {hasVariables && (
              <p className="text-sm text-slate-300 mt-1">
                {allVariablesFilled ? 'All variables filled' : `${variables.filter((v) => v.value).length}/${variables.length} variables filled`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <CopyButton
              content={customizedContent}
              text="Copy"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm font-semibold transition-all"
              iconClassName="w-5 h-5"
            />
            <button
              onClick={() => {
                const blob = new Blob([customizedContent], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${promptTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={() => setShowFullscreen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm font-semibold transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Fullscreen
            </button>
          </div>
        </div>

        {/* Prompt Content with better spacing - buttons are in header now */}
        <div className="p-8">
          <pre className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl overflow-x-auto text-slate-900 dark:text-slate-100 font-mono text-sm leading-relaxed whitespace-pre-wrap border-2 border-slate-200 dark:border-slate-700">
            {customizedContent}
          </pre>

          {/* Highlighted variables that still need values */}
          {hasVariables && !allVariablesFilled && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
              <p className="text-sm text-yellow-800 dark:text-yellow-300 mb-2 font-semibold">
                📝 Variables still in prompt:
              </p>
              <div className="flex flex-wrap gap-2">
                {variables
                  .filter((v) => !v.value)
                  .map((v) => (
                    <span
                      key={v.key}
                      className="px-3 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-full text-xs font-mono"
                    >
                      {v.key}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex-1 overflow-auto p-8">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{promptTitle}</h2>
                <button
                  onClick={() => setShowFullscreen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm font-semibold transition-all"
                >
                  Close
                </button>
              </div>
              <pre className="bg-slate-900 text-slate-100 p-8 rounded-xl font-mono text-sm leading-relaxed whitespace-pre-wrap border-2 border-slate-700">
                {customizedContent}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
