import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Upgrading test user to Complete tier...')

  const email = 'test@example.com'

  // Get user
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    console.error('Test user not found!')
    process.exit(1)
  }

  // Get Complete tier
  const completeTier = await prisma.pricingTier.findUnique({
    where: { slug: 'complete' },
  })

  if (!completeTier) {
    console.error('Complete tier not found!')
    process.exit(1)
  }

  // Check if user already has a purchase
  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      userId: user.id,
      pricingTierId: completeTier.id,
      status: 'completed',
    },
  })

  if (existingPurchase) {
    console.log('✓ User already has Complete tier access!')
    console.log('  Purchase ID:', existingPurchase.id)
    console.log('  Created:', existingPurchase.createdAt)
    return
  }

  // Create a completed purchase
  const purchase = await prisma.purchase.create({
    data: {
      userId: user.id,
      pricingTierId: completeTier.id,
      amount: completeTier.price,
      status: 'completed',
      stripeSessionId: `manual_upgrade_${Date.now()}`,
    },
  })

  console.log('✓ Test user upgraded successfully!')
  console.log('  Email:', email)
  console.log('  Tier: Complete (1,000 prompts)')
  console.log('  Purchase ID:', purchase.id)
  console.log('  Amount:', `$${purchase.amount}`)
  console.log('\nYou can now log in and access all 1,000 prompts!')
}

main()
  .catch((e) => {
    console.error('Error upgrading test user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
