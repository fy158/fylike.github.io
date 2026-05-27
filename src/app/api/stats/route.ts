import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/stats - 获取站点统计信息
export async function GET() {
  try {
    const [articles, wishes, blessings, totalViews] = await Promise.all([
      prisma.article.count(),
      prisma.wish.count(),
      prisma.blessing.count(),
      prisma.article.aggregate({ _sum: { views: true } }),
    ])

    const stats = {
      articles,
      views: totalViews._sum.views || 0,
      wishes,
      blessings,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('获取站点统计失败:', error)
    return NextResponse.json({ error: '获取站点统计失败' }, { status: 500 })
  }
}
