import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/blessings - 获取所有祝福（包含 replies，按 createdAt 降序）
export async function GET() {
  try {
    const blessings = await prisma.blessing.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    return NextResponse.json(blessings)
  } catch (error) {
    console.error('获取祝福列表失败:', error)
    return NextResponse.json({ error: '获取祝福列表失败' }, { status: 500 })
  }
}

// POST /api/blessings - 创建祝福
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { author, content, avatarColor, authorId, isVIP } = body

    if (!author || !content) {
      return NextResponse.json({ error: '缺少必填字段：author, content' }, { status: 400 })
    }

    const blessing = await prisma.blessing.create({
      data: {
        author,
        content,
        avatarColor: avatarColor || 'from-pink-400 to-rose-400',
        authorId: authorId || null,
        isVIP: isVIP || false,
      },
      include: {
        replies: true,
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    return NextResponse.json(blessing, { status: 201 })
  } catch (error) {
    console.error('创建祝福失败:', error)
    return NextResponse.json({ error: '创建祝福失败' }, { status: 500 })
  }
}
