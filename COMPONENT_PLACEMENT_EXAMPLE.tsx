// This file shows exactly where to place each conversion component in your page.tsx
// Copy the relevant sections and paste them into your actual app/page.tsx

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  StickyConversionBar,
  ROICalculator,
  PlanComparison,
  PromptPreviewDemo,
  RealtimeActivity,
  TrustBadges,
  ExitIntentPopup,
  MobileBottomSheet
} from '@/components/conversion'

export const dynamic = 'force-dynamic'

export default async function Home() {
  // Your existing data fetching
  const pricingTiers = await prisma.pricingTier.findMany({
    orderBy: { order: 'asc' },
  })

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    take: 6,
  })

  const popularPrompts = await prisma.prompt.findMany({
    where: { isPopular: true },
    include: { category: true },
    orderBy: { views: 'desc' },
    take: 3,
  })

  const stats = {
    totalPrompts: await prisma.prompt.count(),
    categories: await prisma.category.count(),
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header - KEEP YOUR EXISTING HEADER */}
      <header>...</header>

      {/* Hero Section - KEEP YOUR EXISTING HERO */}
      <section>...</section>

      {/*
        ⭐ INSERT #1: Interactive Prompt Preview
        Place this RIGHT AFTER your hero section
        This shows visitors the quality before they commit
      */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
        <PromptPreviewDemo />
      </section>

      {/* Social Proof / Logos - KEEP EXISTING */}
      <section>...</section>

      {/*
        ⭐ INSERT #2: Trust & Activity Section
        Place this after social proof logos
        Combines real-time activity with trust badges
      */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Join thousands of professionals already using AI Prompts Pro
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            See what's happening right now
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start mb-12">
          <div className="md:col-span-2">
            <RealtimeActivity />
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border border-green-200 dark:border-green-800 p-6 text-center">
              <div className="text-4xl font-black text-green-600 mb-2">$25,680</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Saved by users this week</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6 text-center">
              <div className="text-4xl font-black text-blue-600 mb-2">15.2hrs</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Average time saved/week</div>
            </div>
          </div>
        </div>
        <TrustBadges />
      </section>

      {/* Problem/Solution Section - KEEP EXISTING */}
      <section>...</section>

      {/* Testimonials - KEEP EXISTING */}
      <section>...</section>

      {/* Features Section - KEEP EXISTING */}
      <section>...</section>

      {/*
        ⭐ INSERT #3: ROI Calculator
        Place this after features, before pricing
        This demonstrates tangible value before asking for money
      */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <ROICalculator />
      </section>

      {/* How It Works - KEEP EXISTING */}
      <section>...</section>

      {/* Categories Preview - KEEP EXISTING */}
      <section>...</section>

      {/* Pricing Section - KEEP YOUR EXISTING PRICING */}
      <section id="pricing">...</section>

      {/*
        ⭐ INSERT #4: Comparison Table
        Place this RIGHT AFTER pricing cards
        This helps users make informed decisions
      */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <PlanComparison />
      </section>

      {/* FAQ Section - KEEP EXISTING */}
      <section>...</section>

      {/* Final CTA Section - KEEP EXISTING */}
      <section>...</section>

      {/* Footer - KEEP EXISTING */}
      <footer>...</footer>

      {/*
        ⭐ INSERT #5: Global Conversion Components
        Place these at the VERY END, just before closing </div>
        These components are position: fixed and appear globally
      */}
      <StickyConversionBar />
      <MobileBottomSheet />
      <ExitIntentPopup />
    </div>
  )
}

/*
  ============================================
  QUICK INTEGRATION CHECKLIST
  ============================================

  Step 1: Copy imports from top of this file
  Step 2: Insert component sections marked with ⭐
  Step 3: Test in development: npm run dev
  Step 4: Check all components appear correctly
  Step 5: Test mobile responsiveness
  Step 6: Deploy: npm run build && vercel --prod

  ============================================
  EXPECTED RESULTS
  ============================================

  ✅ Sticky bar appears when you scroll down
  ✅ Countdown timer is counting down
  ✅ ROI calculator updates as you adjust sliders
  ✅ Activity feed updates every 8 seconds
  ✅ Exit intent popup appears when mouse leaves
  ✅ Mobile bottom sheet appears on mobile devices
  ✅ All components work in dark mode
  ✅ All animations are smooth

  ============================================
  TROUBLESHOOTING
  ============================================

  Issue: Components not showing
  Fix: Make sure you imported from '@/components/conversion'

  Issue: TypeScript errors
  Fix: Run npm run build to check for type errors

  Issue: Animations not working
  Fix: Make sure globals.css was updated with animations

  Issue: Dark mode looks wrong
  Fix: All components support dark mode by default

  ============================================
*/
