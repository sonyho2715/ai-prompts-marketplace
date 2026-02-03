'use client';

import { useState } from 'react';
import { Check, Building2 } from 'lucide-react';

const INDUSTRIES = [
  {
    id: 'small-business',
    name: 'Small Business Owner',
    icon: '🏪',
    description: 'Retail, services, local business',
    benefits: ['Operations prompts', 'Customer service', 'Marketing on a budget'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: '🏠',
    description: 'Agents, brokers, property managers',
    benefits: ['Listing descriptions', 'Client follow-ups', 'Market analysis'],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: '🛒',
    description: 'Online stores, dropshipping, DTC brands',
    benefits: ['Product descriptions', 'Email sequences', 'Ad copy'],
  },
  {
    id: 'marketing-agency',
    name: 'Marketing Agency',
    icon: '📢',
    description: 'Digital marketing, content, social media',
    benefits: ['Client strategies', 'Content calendars', 'Campaign briefs'],
  },
  {
    id: 'freelancer',
    name: 'Freelancer / Consultant',
    icon: '💼',
    description: 'Independent professionals',
    benefits: ['Proposals', 'Client communication', 'Personal branding'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Medical practices, wellness, health tech',
    benefits: ['Patient communication', 'Health content', 'Documentation'],
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    description: 'Teachers, trainers, course creators',
    benefits: ['Lesson plans', 'Student engagement', 'Course content'],
  },
  {
    id: 'legal',
    name: 'Legal',
    icon: '⚖️',
    description: 'Law firms, legal services',
    benefits: ['Document drafts', 'Client intake', 'Research summaries'],
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    description: 'Financial advisors, accountants, fintech',
    benefits: ['Client reports', 'Analysis templates', 'Advisory content'],
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    icon: '🚀',
    description: 'SaaS, apps, tech products',
    benefits: ['Product copy', 'Investor decks', 'Technical docs'],
  },
  {
    id: 'creator',
    name: 'Content Creator',
    icon: '🎬',
    description: 'YouTubers, bloggers, influencers',
    benefits: ['Video scripts', 'Social content', 'Engagement hooks'],
  },
  {
    id: 'restaurant',
    name: 'Restaurant / Food Service',
    icon: '🍽️',
    description: 'Restaurants, cafes, food brands',
    benefits: ['Menu descriptions', 'Social posts', 'Customer responses'],
  },
];

interface IndustrySelectorProps {
  currentIndustry?: string;
  onSelect: (industryId: string) => void;
  compact?: boolean;
}

export default function IndustrySelector({
  currentIndustry,
  onSelect,
  compact = false,
}: IndustrySelectorProps) {
  const [selected, setSelected] = useState(currentIndustry || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSelect = async (industryId: string) => {
    setSelected(industryId);
    setIsLoading(true);

    try {
      const response = await fetch('/api/industries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: industryId }),
      });

      if (response.ok) {
        onSelect(industryId);
      }
    } catch (error) {
      console.error('Failed to update industry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((industry) => (
          <button
            key={industry.id}
            onClick={() => handleSelect(industry.id)}
            disabled={isLoading}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selected === industry.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {industry.icon} {industry.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Select Your Industry
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get personalized prompts tailored to your business
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRIES.map((industry) => (
          <button
            key={industry.id}
            onClick={() => handleSelect(industry.id)}
            disabled={isLoading}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              selected === industry.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
            }`}
          >
            {selected === industry.id && (
              <div className="absolute top-3 right-3">
                <div className="p-1 bg-blue-500 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{industry.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {industry.name}
              </h3>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {industry.description}
            </p>

            <div className="flex flex-wrap gap-1">
              {industry.benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
