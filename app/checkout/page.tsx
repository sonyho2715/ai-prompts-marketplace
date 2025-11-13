import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckoutButton } from '@/components/CheckoutButton'

interface CheckoutPageProps {
  searchParams: Promise<{
    tier?: string
  }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const session = await getServerSession(authOptions)
  const { tier } = await searchParams

  if (!session) {
    redirect('/login?callbackUrl=/checkout?tier=' + (tier || ''))
  }

  const tierSlug = tier || 'starter'

  const pricingTier = await prisma.pricingTier.findUnique({
    where: { slug: tierSlug },
  })

  if (!pricingTier) {
    redirect('/')
  }

  // Check if user already purchased this tier or higher
  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      userId: session.user.id,
      status: 'completed',
    },
    include: {
      pricingTier: true,
    },
  })

  const tierHierarchy: { [key: string]: number } = {
    free: 0,
    starter: 1,
    pro: 2,
    complete: 3,
  }

  const alreadyPurchased =
    existingPurchase &&
    tierHierarchy[existingPurchase.pricingTier.slug] >= tierHierarchy[tierSlug]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Prompts Pro
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            You're one step away from accessing premium AI prompts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {pricingTier.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {pricingTier.description}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  ${pricingTier.price}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-2xl">${pricingTier.price}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  One-time payment • Lifetime access
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <div className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                What's included:
              </div>
              <ul className="space-y-2">
                {pricingTier.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-400"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
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
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Payment Details
            </h2>

            {alreadyPurchased ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Already Purchased
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  You already have access to this tier or a higher tier.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-blue-600 dark:text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Logged in as
                        </div>
                        <div className="font-medium text-slate-900 dark:text-white">
                          {session.user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Click the button below to proceed to secure payment with Stripe.
                  </div>
                </div>

                <CheckoutButton
                  tierSlug={tierSlug}
                  tierId={pricingTier.id}
                  amount={pricingTier.price}
                />

                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-10 h-4" viewBox="0 0 60 25" fill="currentColor">
                    <path d="M0 0h60v25H0z" fill="none" />
                    <text x="5" y="18" fontSize="14" fontWeight="bold">
                      stripe
                    </text>
                  </svg>
                  <span>Secure payment powered by Stripe</span>
                </div>

                <div className="mt-4 text-xs text-center text-slate-500 dark:text-slate-400">
                  🔒 Your payment information is encrypted and secure
                </div>
              </>
            )}
          </div>
        </div>

        {/* Guarantees */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2">🔒</div>
            <div className="font-semibold text-slate-900 dark:text-white mb-1">
              Secure Payment
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              256-bit SSL encryption
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">♾️</div>
            <div className="font-semibold text-slate-900 dark:text-white mb-1">
              Lifetime Access
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              One-time payment, forever access
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📧</div>
            <div className="font-semibold text-slate-900 dark:text-white mb-1">
              Instant Delivery
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Access immediately after purchase
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
