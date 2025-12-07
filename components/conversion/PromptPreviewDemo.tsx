'use client'

import { useState } from 'react'

export function PromptPreviewDemo() {
  const [selectedCategory, setSelectedCategory] = useState('marketing')
  const [showOutput, setShowOutput] = useState(false)

  const demos = {
    marketing: {
      title: 'Marketing & Copywriting',
      input: 'Create a compelling Instagram caption for a new artisan coffee brand launching in Brooklyn. Focus on authenticity, craft, and community.',
      output: '☕️ Meet your new morning ritual.\n\nCrafted by Brooklyn roasters who believe every cup tells a story. Single-origin beans, small-batch roasting, and a commitment to the craft that goes into every bag.\n\nWe\'re not just selling coffee. We\'re building a community of people who appreciate the art of a perfect brew.\n\nJoin us at our grand opening this Saturday. First 50 customers get a free bag of our signature blend.\n\n#BrooklynCoffee #CraftCoffee #SupportLocal #CoffeeLovers #ArtisanCoffee',
      tags: ['ChatGPT-4', 'Claude', 'Instagram', 'Social Media']
    },
    design: {
      title: 'Design & Creative',
      input: 'Generate a modern, minimalist logo concept for "TechFlow", a productivity app for developers. Include design rationale.',
      output: 'Logo Concept:\n\nA flowing bracket symbol "{" that transforms into a forward arrow "→", rendered in a single continuous line. The design represents:\n\n1. Code brackets (developer focus)\n2. Forward motion (productivity)\n3. Flow state (seamless workflow)\n\nColor: Electric blue (#0066FF) on white, or white on dark backgrounds\n\nTypography: Sans-serif, lowercase "techflow" in medium weight\n\nThe symbol can stand alone as an app icon while remaining recognizable. The continuous line suggests uninterrupted workflow and smooth transitions between tasks.',
      tags: ['Midjourney', 'DALL-E', 'Logo Design', 'Branding']
    },
    business: {
      title: 'Business Strategy',
      input: 'Analyze the market opportunity for a B2B SaaS tool that helps e-commerce stores automate customer support using AI. Include TAM, SAM, and SOM.',
      output: 'Market Analysis for AI Customer Support SaaS:\n\nTAM (Total Addressable Market):\n- Global e-commerce market: $5.7T\n- Customer support software: $12B\n- Estimated TAM: $3.5B annually\n\nSAM (Serviceable Available Market):\n- Mid-market e-commerce (100-1000 employees): $890M\n- English-speaking markets first: $445M\n\nSOM (Serviceable Obtainable Market - Year 1):\n- Realistic 0.5% capture: $2.2M\n- ~440 customers at $5K/year ARR\n\nKey Insights:\n- High growth market (22% CAGR)\n- Clear pain point validation\n- Strong competitor landscape indicates proven demand',
      tags: ['ChatGPT-4', 'Claude', 'Business Analysis', 'Strategy']
    },
    coding: {
      title: 'Development & Code',
      input: 'Write a React hook for debouncing search input with TypeScript, including proper cleanup and cancellation.',
      output: 'import { useEffect, useState } from \'react\';\n\nfunction useDebounce<T>(value: T, delay: number = 500): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    // Set timeout to update debounced value\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    // Cleanup function to cancel timeout\n    return () => {\n      clearTimeout(handler);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\n// Usage:\nconst [search, setSearch] = useState(\'\');\nconst debouncedSearch = useDebounce(search, 300);\n\nuseEffect(() => {\n  // API call with debouncedSearch\n}, [debouncedSearch]);',
      tags: ['ChatGPT-4', 'Claude', 'React', 'TypeScript']
    }
  }

  const currentDemo = demos[selectedCategory as keyof typeof demos]

  return (
    <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-white mb-2">
          See the Quality Before You Buy
        </h3>
        <p className="text-slate-400">
          Real examples from our prompt library
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {Object.entries(demos).map(([key, demo]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedCategory(key)
              setShowOutput(false)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === key
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {demo.title}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {currentDemo.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Interactive demo */}
      <div className="space-y-4">
        {/* Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Prompt Input</div>
            <button
              onClick={() => navigator.clipboard.writeText(currentDemo.input)}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm text-green-400">
            {currentDemo.input}
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center">
          <button
            onClick={() => setShowOutput(!showOutput)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            {showOutput ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generate New Output
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                See AI Output
              </>
            )}
          </button>
        </div>

        {/* Output */}
        {showOutput && (
          <div className="animate-scale-in">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">AI Output</div>
              <button
                onClick={() => navigator.clipboard.writeText(currentDemo.output)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-4 text-sm text-white leading-relaxed whitespace-pre-wrap">
              {currentDemo.output}
            </div>
          </div>
        )}
      </div>

      {/* CTA within demo */}
      <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl">
        <p className="text-white mb-4 font-medium">
          This is just one prompt. Get access to {' '}
          <span className="font-bold text-blue-400">5,000+ prompts like this</span>
        </p>
        <a
          href="#pricing"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-lg text-white font-bold hover:shadow-xl hover:shadow-blue-500/50 transition-all"
        >
          <span>Get Full Access Now</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </div>
  )
}
