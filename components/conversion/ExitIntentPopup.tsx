'use client'

import { useState, useEffect } from 'react'

export function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setShow(true)
        setHasShown(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [hasShown])

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 relative shadow-2xl animate-scale-in border-2 border-blue-500">
        <button
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Wait! Before you go...
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Get an <span className="font-bold text-green-600">extra 10% OFF</span> when you sign up right now
          </p>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white mb-6 shadow-xl">
            <div className="text-sm font-semibold mb-2 uppercase tracking-wide">Your Exclusive Discount</div>
            <div className="text-5xl font-black mb-3">40% OFF</div>
            <div className="text-sm opacity-90 font-medium">Use code: <span className="font-bold">STAYWITHUS40</span></div>
            <div className="mt-3 text-xs opacity-80">Limited to first 100 customers today</div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>5,000+ Professional AI Prompts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lifetime Access + Free Updates</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </div>

          <a
            href="#pricing"
            onClick={() => setShow(false)}
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4 rounded-xl font-bold text-lg mb-3 hover:shadow-2xl hover:scale-105 transition-all"
          >
            Claim My 40% Discount
          </a>

          <button
            onClick={() => setShow(false)}
            className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  )
}
