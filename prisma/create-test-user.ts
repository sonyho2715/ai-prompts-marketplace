import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Creating test user...')

  const email = 'test@example.com'
  const password = 'password123'

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log('✓ Test user already exists')
    console.log('  Email:', email)
    console.log('  Password:', password)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create test user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email,
      password: hashedPassword,
    },
  })

  console.log('✓ Test user created successfully!')
  console.log('  Email:', email)
  console.log('  Password:', password)
  console.log('  User ID:', user.id)
}

main()
  .catch((e) => {
    console.error('Error creating test user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
