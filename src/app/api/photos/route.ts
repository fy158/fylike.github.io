import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/photos - 获取照片列表（支持分类筛选）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where: Record<string, unknown> = {}
    if (category) {
      where.category = category
    }

    const photos = await prisma.photo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    return NextResponse.json(photos)
  } catch (error) {
    console.error('获取照片列表失败:', error)
    return NextResponse.json({ error: '获取照片列表失败' }, { status: 500 })
  }
}

// POST /api/photos - 上传照片
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, src, category, date, authorId } = body

    if (!title || !src || !date) {
      return NextResponse.json({ error: '缺少必填字段：title, src, date' }, { status: 400 })
    }

    const photo = await prisma.photo.create({
      data: {
        title,
        src,
        category: category || '日常',
        date,
        authorId: authorId || null,
      },
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('上传照片失败:', error)
    return NextResponse.json({ error: '上传照片失败' }, { status: 500 })
  }
}
