import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有链接
export async function GET() {
  try {
    const links = await prisma.linkCollection.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error('获取链接失败:', error)
    return NextResponse.json({ error: '获取链接失败' }, { status: 500 })
  }
}

// POST - 添加新链接
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, url, coverImage, icon } = body

    if (!title || !description || !url || !coverImage) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const link = await prisma.linkCollection.create({
      data: {
        title,
        description,
        url,
        coverImage,
        icon: icon || '🔗',
      }
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('添加链接失败:', error)
    return NextResponse.json({ error: '添加链接失败' }, { status: 500 })
  }
}
