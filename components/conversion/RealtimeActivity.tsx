'use client'

import { useState, useEffect } from 'react'

interface Activity {
  name: string
  action: string
  tier: string
  time: string
  location: string
}

export function RealtimeActivity() {
  const [activities, setActivities] = useState<Activity[]>([
    { name: 'Sarah M.', action: 'purchased', tier: 'Pro Plan', time: '2m ago', location: 'New York' },
    { name: 'John D.', action: 'started using', tier: 'Free Plan', time: '5m ago', location: 'London' },
    { name: 'Emily R.', action: 'upgraded to', tier: 'Complete Bundle', time: '12m ago', location: 'Sydney' }
  ])

  const moreActivities = [
    { name: 'Michael K.', action: 'purchased', tier: 'Starter Plan', time: 'just now', location: 'Toronto' },
    { name: 'Lisa W.', action: 'upgraded to', tier: 'Pro Plan', time: '1m ago', location: 'San Francisco' },
    { name: 'David P.', action: 'purchased', tier: 'Complete Bundle', time: '3m ago', location: 'Berlin' },
    { name: 'Anna S.', action: 'started using', tier: 'Free Plan', time: '6m ago', location: 'Tokyo' },
    { name: 'James L.', action: 'upgraded to', tier: 'Complete Bundle', time: '8m ago', location: 'Paris' }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      const randomActivity = moreActivities[Math.floor(Math.random() * moreActivities.length)]
      setActivities(prev => [randomActivity, ...prev.slice(0, 2)])
    }, 8000) // Add new activity every 8 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Live Activity</span>
        <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">Updated in real-time</span>
      </div>

      <div className="space-y-3">
        {activities.map((activity, i) => (
          <div
            key={`${activity.name}-${i}`}
            className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg transition-all hover:scale-[1.02] animate-slide-in"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {activity.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">
                <span className="font-semibold text-slate-900 dark:text-white">{activity.name}</span>
                {' '}
                <span className="text-slate-600 dark:text-slate-400">{activity.action}</span>
                {' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">{activity.tier}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {activity.location} • {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
          <span className="font-semibold text-slate-900 dark:text-white">127 people</span> viewing right now
        </p>
        <a
          href="#pricing"
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Join them →
        </a>
      </div>
    </div>
  )
}
