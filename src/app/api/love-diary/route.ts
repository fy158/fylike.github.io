import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/love-diary - 获取恋爱日记
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const [entries, total] = await Promise.all([
      prisma.loveDiary.findMany({
        take: limit,
        skip,
        orderBy: { date: 'desc' },
      }),
      prisma.loveDiary.count(),
    ])

    return NextResponse.json({
      entries,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('获取恋爱日记失败:', error)
    return NextResponse.json({ error: '获取恋爱日记失败' }, { status: 500 })
  }
}

// POST /api/love-diary - 创建日记
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, mood, date } = body

    if (!title || !content) {
      return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 })
    }

    const entry = await prisma.loveDiary.create({
      data: {
        title,
        content,
        mood,
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('创建恋爱日记失败:', error)
    return NextResponse.json({ error: '创建恋爱日记失败' }, { status: 500 })
  }
}

// PUT /api/love-diary?id=xxx - 更新日记
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, content, mood, date } = body

    const entry = await prisma.loveDiary.update({
      where: { id },
      data: {
        title,
        content,
        mood,
        date: date ? new Date(date) : undefined,
      },
    })

    return NextResponse.json(entry)
  } catch (error) {
    console.error('更新恋爱日记失败:', error)
    return NextResponse.json({ error: '更新恋爱日记失败' }, { status: 500 })
  }
}

// DELETE /api/love-diary?id=xxx - 删除日记
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    await prisma.loveDiary.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除恋爱日记失败:', error)
    return NextResponse.json({ error: '删除恋爱日记失败' }, { status: 500 })
  }
}
