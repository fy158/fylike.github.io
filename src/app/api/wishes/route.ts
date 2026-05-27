import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/wishes - 获取所有愿望（按 likes 降序）
export async function GET() {
  try {
    const wishes = await prisma.wish.findMany({
      orderBy: { likes: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    return NextResponse.json(wishes, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('获取愿望列表失败:', error)
    return NextResponse.json({ error: '获取愿望列表失败' }, { status: 500 })
  }
}

// POST /api/wishes - 创建愿望
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, author, authorId, emoji, borderColor } = body

    if (!content || !author) {
      return NextResponse.json({ error: '缺少必填字段：content, author' }, { status: 400 })
    }

    const wish = await prisma.wish.create({
      data: {
        content,
        author,
        authorId: authorId || null,
        emoji: emoji || '💫',
        borderColor: borderColor || 'from-pink-400 to-purple-400',
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    return NextResponse.json(wish, { status: 201 })
  } catch (error) {
    console.error('创建愿望失败:', error)
    return NextResponse.json({ error: '创建愿望失败' }, { status: 500 })
  }
}
