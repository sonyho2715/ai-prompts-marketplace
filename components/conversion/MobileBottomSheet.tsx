'use client'

import { useState, useEffect } from 'react'

export function MobileBottomSheet() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!show) return null

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-900 border-t-2 border-blue-500 shadow-2xl z-50 pb-safe animate-slide-up">
      <div className="p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">Pro Plan (Most Popular)</div>
            <div className="font-bold text-xl">
              <span className="text-green-600">$137</span>
              <span className="text-sm text-slate-400 line-through ml-2">$197</span>
            </div>
          </div>
          <div className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full font-bold animate-pulse">
            30% OFF
          </div>
        </div>

        <a
          href="#pricing"
          className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
        >
          Get Lifetime Access Now
        </a>

        <div className="text-center text-xs text-slate-500 dark:text-slate-500 mt-2 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            30-day guarantee
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Instant access
          </span>
        </div>
      </div>
    </div>
  )
}
