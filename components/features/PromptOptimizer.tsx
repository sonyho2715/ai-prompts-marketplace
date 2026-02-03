'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check, Loader2, Zap, ArrowRight } from 'lucide-react';

const AI_MODELS = [
  { id: 'ChatGPT', name: 'ChatGPT', icon: '🤖' },
  { id: 'Claude', name: 'Claude', icon: '🧠' },
  { id: 'Midjourney', name: 'Midjourney', icon: '🎨' },
  { id: 'DALL-E', name: 'DALL-E', icon: '🖼️' },
  { id: 'Gemini', name: 'Gemini', icon: '✨' },
  { id: 'Copilot', name: 'GitHub Copilot', icon: '💻' },
];

const INDUSTRIES = [
  { id: 'small-business', name: 'Small Business Owner', icon: '🏪' },
  { id: 'real-estate', name: 'Real Estate', icon: '🏠' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'marketing-agency', name: 'Marketing Agency', icon: '📢' },
  { id: 'freelancer', name: 'Freelancer', icon: '💼' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'legal', name: 'Legal', icon: '⚖️' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'tech-startup', name: 'Tech Startup', icon: '🚀' },
];

interface OptimizerProps {
  initialPrompt?: string;
  onOptimized?: (prompt: string) => void;
}

export default function PromptOptimizer({ initialPrompt = '', onOptimized }: OptimizerProps) {
  const [inputPrompt, setInputPrompt] = useState(initialPrompt);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [targetAI, setTargetAI] = useState('ChatGPT');
  const [industry, setIndustry] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleOptimize = async () => {
    if (!inputPrompt.trim()) {
      setError('Please enter a prompt to optimize');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: inputPrompt,
          targetAI,
          industry: industry || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.upgradeRequired) {
          setError('Free optimizations used. Upgrade to Pro for unlimited access.');
        } else {
          setError(data.error || 'Failed to optimize prompt');
        }
        return;
      }

      setOptimizedPrompt(data.optimizedPrompt);
      onOptimized?.(data.optimizedPrompt);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            AI Prompt Optimizer
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Transform your rough ideas into powerful prompts
          </p>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        {/* AI Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target AI Model
          </label>
          <div className="flex flex-wrap gap-2">
            {AI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setTargetAI(model.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  targetAI === model.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-1">{model.icon}</span> {model.name}
              </button>
            ))}
          </div>
        </div>

        {/* Industry Selection (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Industry <span className="text-gray-400">(optional)</span>
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select your industry for tailored prompts</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind.id} value={ind.id}>
                {ind.icon} {ind.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Rough Prompt
          </label>
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Enter your prompt idea here... (e.g., 'write a blog post about productivity')"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Optimize Button */}
        <button
          onClick={handleOptimize}
          disabled={isLoading || !inputPrompt.trim()}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Optimizing...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Optimize Prompt
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Output Section */}
      {optimizedPrompt && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Optimized Prompt
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
              {optimizedPrompt}
            </pre>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Optimized for {targetAI}
            {industry && ` • Tailored for ${INDUSTRIES.find(i => i.id === industry)?.name}`}
          </p>
        </div>
      )}
    </div>
  );
}
