import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/secret-messages - 获取悄悄话
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '30')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (unreadOnly) where.isRead = false

    const [messages, total] = await Promise.all([
      prisma.secretMessage.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.secretMessage.count({ where }),
    ])

    return NextResponse.json({
      messages,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('获取悄悄话失败:', error)
    return NextResponse.json({ error: '获取悄悄话失败' }, { status: 500 })
  }
}

// POST /api/secret-messages - 创建悄悄话
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, author } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: '内容不能为空' }, { status: 400 })
    }

    const message = await prisma.secretMessage.create({
      data: {
        content: content.trim(),
        author: author?.trim() || '匿名',
        isRead: false,
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('创建悄悄话失败:', error)
    return NextResponse.json({ error: '创建悄悄话失败' }, { status: 500 })
  }
}

// PUT /api/secret-messages?id=xxx - 更新悄悄话（用于回复）
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const body = await request.json()
    const { reply, isRead } = body

    const updateData: Record<string, unknown> = {}

    if (reply !== undefined) {
      updateData.reply = reply
      updateData.replyAt = reply ? new Date() : null
    }

    if (isRead !== undefined) {
      updateData.isRead = isRead
      updateData.readAt = isRead ? new Date() : null
    }

    const message = await prisma.secretMessage.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('更新悄悄话失败:', error)
    return NextResponse.json({ error: '更新悄悄话失败' }, { status: 500 })
  }
}

// PATCH /api/secret-messages?id=xxx - 标记为已读
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const message = await prisma.secretMessage.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('标记已读失败:', error)
    return NextResponse.json({ error: '标记已读失败' }, { status: 500 })
  }
}

// DELETE /api/secret-messages?id=xxx - 删除悄悄话
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    await prisma.secretMessage.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除悄悄话失败:', error)
    return NextResponse.json({ error: '删除悄悄话失败' }, { status: 500 })
  }
}
