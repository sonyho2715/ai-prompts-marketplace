import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface SuccessPageProps {
  searchParams: {
    session_id?: string
  }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  const sessionId = searchParams.session_id

  let purchase = null
  if (sessionId) {
    purchase = await prisma.purchase.findFirst({
      where: {
        stripeSessionId: sessionId,
        userId: session.user.id,
      },
      include: {
        pricingTier: true,
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xl">
          {/* Success Animation */}
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Welcome to AI Prompts Pro
            </p>
          </div>

          {/* Purchase Details */}
          {purchase && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <div className="text-sm text-blue-900 dark:text-blue-300 mb-2">
                You've unlocked:
              </div>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                {purchase.pricingTier.name}
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-400">
                {purchase.pricingTier.promptCount.toLocaleString()} AI Prompts
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              What's next?
            </h2>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">1</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Access Your Dashboard
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    View and manage all your prompts in one place
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">2</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Browse the Library
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Explore all available prompts across categories
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">3</span>
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    Start Creating
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Copy prompts and use them with your favorite AI tools
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/prompts"
              className="rounded-lg border-2 border-slate-300 dark:border-slate-700 px-8 py-3 font-semibold text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
            >
              Browse Prompts
            </Link>
          </div>

          {/* Receipt */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
            A receipt has been sent to {session.user.email}
          </div>
        </div>
      </div>
    </div>
  )
}
