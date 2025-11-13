import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Header } from '@/components/Header'
import { PromptsContent } from './PromptsContent'

interface PromptsPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    tier?: string
    aiModel?: string
    difficulty?: string
    page?: string
    sort?: string
  }>
}

export default async function PromptsPage({ searchParams }: PromptsPageProps) {
  const session = await getServerSession(authOptions)
  const { search, category, tier, aiModel, difficulty, page, sort } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const ITEMS_PER_PAGE = 12

  // Build where clause for filtering
  const where: any = {}

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ]
  }

  if (category) {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
    })
    if (categoryData) {
      where.categoryId = categoryData.id
    }
  }

  if (tier) {
    where.tier = tier
  }

  if (aiModel) {
    where.aiModel = { has: aiModel }
  }

  if (difficulty) {
    where.difficulty = difficulty
  }

  // Determine sort order
  let orderBy: any[] = [
    { isPopular: 'desc' },
    { views: 'desc' },
    { createdAt: 'desc' },
  ]

  if (sort === 'newest') {
    orderBy = [{ createdAt: 'desc' }]
  } else if (sort === 'most-used') {
    orderBy = [{ views: 'desc' }]
  } else if (sort === 'popular') {
    orderBy = [{ isPopular: 'desc' }, { views: 'desc' }]
  }

  // Fetch prompts with pagination
  const [prompts, categories, totalCount] = await Promise.all([
    prisma.prompt.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      skip: (currentPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { prompts: true }
        }
      }
    }),
    prisma.prompt.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header session={session} />

      <PromptsContent
        prompts={prompts}
        categories={categories}
        totalCount={totalCount}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={ITEMS_PER_PAGE}
        searchParams={{ search, category, tier, aiModel, difficulty, sort }}
      />
    </div>
  )
}
