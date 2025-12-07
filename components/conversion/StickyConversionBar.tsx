'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function StickyConversionBar() {
  const [show, setShow] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 12
  })

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 800)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev

        if (seconds > 0) {
          seconds--
        } else if (minutes > 0) {
          minutes--
          seconds = 59
        } else if (hours > 0) {
          hours--
          minutes = 59
          seconds = 59
        } else {
          hours = 23
          minutes = 59
          seconds = 59
        }

        return { hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-slate-900 border-t-2 border-blue-500 shadow-2xl animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="text-sm text-slate-600 dark:text-slate-400">Special Offer</div>
              <div className="font-bold text-slate-900 dark:text-white">30% OFF - Limited Time</div>
            </div>
            <div className="text-2xl font-black">
              <span className="text-slate-400 line-through">$197</span>
              <span className="ml-2 text-green-600">$137</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown */}
            <div className="hidden sm:flex items-center gap-2 text-sm font-mono bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            {/* CTA Button */}
            <Link
              href="#pricing"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center gap-2"
            >
              <span className="hidden sm:inline">Claim 30% OFF</span>
              <span className="sm:hidden">Get 30% OFF</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
