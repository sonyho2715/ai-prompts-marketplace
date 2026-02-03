'use client';

import { useState } from 'react';
import { ChevronRight, Copy, Check, Play, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';

interface ChainStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  prompt: string;
  expectedOutput?: string;
  variables: string[];
}

interface Chain {
  id: string;
  title: string;
  description: string;
  category: string;
  industry?: string;
  difficulty: string;
  steps: ChainStep[];
  isFree: boolean;
  isPopular: boolean;
  tier: string;
}

interface PromptChainProps {
  chain: Chain;
  isSaved?: boolean;
  onSave?: (chainId: string) => void;
  isLocked?: boolean;
}

export default function PromptChain({
  chain,
  isSaved = false,
  onSave,
  isLocked = false,
}: PromptChainProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(isSaved);

  // Extract all unique variables from all steps
  const allVariables = Array.from(
    new Set(chain.steps.flatMap((step) => step.variables))
  );

  const handleCopyStep = async (stepIndex: number) => {
    let prompt = chain.steps[stepIndex].prompt;

    // Replace variables with user values
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`);
    });

    await navigator.clipboard.writeText(prompt);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleSave = async () => {
    if (onSave) {
      onSave(chain.id);
    }
    setSaved(!saved);

    try {
      await fetch('/api/chains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chainId: chain.id,
          customVariables: variables,
        }),
      });
    } catch (error) {
      console.error('Failed to save chain:', error);
    }
  };

  const getFilledPrompt = (prompt: string) => {
    let filled = prompt;
    Object.entries(variables).forEach(([key, value]) => {
      filled = filled.replace(
        new RegExp(`\\[${key}\\]`, 'g'),
        value ? `**${value}**` : `[${key}]`
      );
    });
    return filled;
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColors[chain.difficulty as keyof typeof difficultyColors]}`}>
                {chain.difficulty}
              </span>
              {chain.isPopular && (
                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Popular
                </span>
              )}
              <span className="px-2 py-0.5 text-xs font-medium bg-white/20 text-white rounded-full">
                {chain.steps.length} steps
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{chain.title}</h2>
            <p className="text-indigo-100 text-sm">{chain.description}</p>
          </div>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={saved ? 'Remove from saved' : 'Save chain'}
          >
            {saved ? (
              <BookmarkCheck className="w-6 h-6 text-yellow-300" />
            ) : (
              <Bookmark className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Variables Input */}
      {allVariables.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Fill in your details:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {allVariables.map((variable) => (
              <div key={variable}>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {variable}
                </label>
                <input
                  type="text"
                  value={variables[variable] || ''}
                  onChange={(e) =>
                    setVariables({ ...variables, [variable]: e.target.value })
                  }
                  placeholder={`Enter ${variable.toLowerCase()}`}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="p-6">
        {/* Step Navigation */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {chain.steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => !isLocked && setActiveStep(index)}
              disabled={isLocked && index > 0}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeStep === index
                  ? 'bg-indigo-600 text-white'
                  : isLocked && index > 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs">
                {index + 1}
              </span>
              {step.title}
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        {isLocked ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upgrade to Access This Chain
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This prompt chain is available on the {chain.tier} tier and above.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors"
            >
              View Pricing <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Step {activeStep + 1}: {chain.steps[activeStep].title}
              </h3>
              <button
                onClick={() => handleCopyStep(activeStep)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
              >
                {copiedStep === activeStep ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Prompt
                  </>
                )}
              </button>
            </div>

            {chain.steps[activeStep].description && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {chain.steps[activeStep].description}
              </p>
            )}

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                {getFilledPrompt(chain.steps[activeStep].prompt)}
              </pre>
            </div>

            {chain.steps[activeStep].expectedOutput && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Output:
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  {chain.steps[activeStep].expectedOutput}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {activeStep < chain.steps.length - 1 ? (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <Play className="w-4 h-4" /> Chain Complete!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
