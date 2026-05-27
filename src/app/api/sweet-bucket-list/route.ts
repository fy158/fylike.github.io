import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/sweet-bucket-list - 获取甜蜜清单
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const completed = searchParams.get('completed')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (completed !== null && completed !== undefined) {
      where.completed = completed === 'true'
    }

    const items = await prisma.sweetBucketList.findMany({
      where,
      take: limit,
      orderBy: [
        { completed: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('获取甜蜜清单失败:', error)
    return NextResponse.json({ error: '获取甜蜜清单失败' }, { status: 500 })
  }
}

// POST /api/sweet-bucket-list - 创建清单项
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, category, description, targetDate } = body

    if (!title || !category) {
      return NextResponse.json({ error: '标题和分类不能为空' }, { status: 400 })
    }

    const item = await prisma.sweetBucketList.create({
      data: {
        title,
        category,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        completed: false,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('创建甜蜜清单项失败:', error)
    return NextResponse.json({ error: '创建甜蜜清单项失败' }, { status: 500 })
  }
}

// PUT /api/sweet-bucket-list?id=xxx - 更新清单项
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, category, description, completed, targetDate } = body

    const updateData: Record<string, unknown> = { title, category, description, targetDate }
    
    // 如果标记为完成，设置完成时间
    if (completed === true) {
      updateData.completed = true
      updateData.completedAt = new Date()
    } else if (completed === false) {
      updateData.completed = false
      updateData.completedAt = null
    }

    const item = await prisma.sweetBucketList.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('更新甜蜜清单项失败:', error)
    return NextResponse.json({ error: '更新甜蜜清单项失败' }, { status: 500 })
  }
}

// PATCH /api/sweet-bucket-list?id=xxx - 切换完成状态
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const current = await prisma.sweetBucketList.findUnique({
      where: { id },
    })

    if (!current) {
      return NextResponse.json({ error: '项目不存在' }, { status: 404 })
    }

    const item = await prisma.sweetBucketList.update({
      where: { id },
      data: {
        completed: !current.completed,
        completedAt: !current.completed ? new Date() : null,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('切换完成状态失败:', error)
    return NextResponse.json({ error: '切换完成状态失败' }, { status: 500 })
  }
}

// DELETE /api/sweet-bucket-list?id=xxx - 删除清单项
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    await prisma.sweetBucketList.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除甜蜜清单项失败:', error)
    return NextResponse.json({ error: '删除甜蜜清单项失败' }, { status: 500 })
  }
}
