'use client'

import { useState } from 'react'

export function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10)
  const [hourlyRate, setHourlyRate] = useState(50)

  const timeSaved = hoursPerWeek * 0.7 // 70% time savings
  const weeklySavings = timeSaved * hourlyRate
  const yearlySavings = weeklySavings * 52
  const planCost = 197
  const roi = ((yearlySavings - planCost) / planCost) * 100
  const paybackWeeks = Math.ceil(planCost / weeklySavings)

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-3xl border-2 border-green-200 dark:border-green-800 p-8 shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Calculate Your ROI
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          See how much time and money you'll save with AI Prompts Pro
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Input: Hours per week */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Hours spent on AI tasks per week
          </label>
          <input
            type="range"
            min="1"
            max="40"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full h-3 bg-green-200 dark:bg-green-900/30 rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="text-right font-bold text-green-600 text-3xl mt-2">
            {hoursPerWeek} hours
          </div>
        </div>

        {/* Input: Hourly rate */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Your hourly rate
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full pl-12 pr-4 py-3 text-2xl font-bold bg-white dark:bg-slate-800 border-2 border-green-300 dark:border-green-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-green-200 dark:border-green-800">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Time Saved</div>
            <div className="text-3xl font-bold text-green-600">{timeSaved.toFixed(1)}h</div>
            <div className="text-xs text-slate-500">per week</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Money Saved</div>
            <div className="text-3xl font-bold text-green-600">${weeklySavings.toLocaleString()}</div>
            <div className="text-xs text-slate-500">per week</div>
          </div>
          <div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">Yearly Value</div>
            <div className="text-3xl font-bold text-green-600">${yearlySavings.toLocaleString()}</div>
            <div className="text-xs text-slate-500">per year</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white text-center">
          <div className="text-sm font-semibold mb-2 uppercase tracking-wide">Your Return on Investment</div>
          <div className="text-6xl font-black mb-2">{roi.toFixed(0)}%</div>
          <div className="text-sm opacity-90 font-medium">
            Pays for itself in just {paybackWeeks} {paybackWeeks === 1 ? 'week' : 'weeks'}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 rounded-xl text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
        >
          <span>Start Saving Time Now</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          No credit card required for free tier • 30-day money-back guarantee
        </p>
      </div>
    </div>
  )
}
