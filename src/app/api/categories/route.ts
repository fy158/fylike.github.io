import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - 获取所有分类（包含文章数量）
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { count: 'desc' },
      include: {
        _count: {
          select: { articles: true },
        },
      },
    })

    // 将 _count 映射为 articlesCount
    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      count: cat.count,
      articlesCount: cat._count.articles,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    return NextResponse.json({ error: '获取分类列表失败' }, { status: 500 })
  }
}
