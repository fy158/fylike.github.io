import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/anniversaries - 获取纪念日
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upcoming = searchParams.get('upcoming') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')

    const raw = await prisma.anniversary.findMany({
      take: limit,
      orderBy: { date: 'asc' },
    })

    // 计算下一个纪念日日期
    const now = new Date()
    const currentYear = now.getFullYear()

    const anniversaries = raw.map(a => {
      const originalDate = new Date(a.date)
      let nextDate = new Date(currentYear, originalDate.getMonth(), originalDate.getDate())
      
      // 如果今年的纪念日已过，计算明年的
      if (nextDate < now && a.isRecurring) {
        nextDate = new Date(currentYear + 1, originalDate.getMonth(), originalDate.getDate())
      }

      const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      return {
        ...a,
        nextDate: nextDate.toISOString(),
        daysUntil,
      }
    })

    // 如果需要即将到期的，按天数排序
    const sorted = upcoming
      ? [...anniversaries].sort((a, b) => a.daysUntil - b.daysUntil)
      : anniversaries

    return NextResponse.json(sorted)
  } catch (error) {
    console.error('获取纪念日失败:', error)
    return NextResponse.json({ error: '获取纪念日失败' }, { status: 500 })
  }
}

// POST /api/anniversaries - 创建纪念日
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, description, icon, color, isRecurring } = body

    if (!title || !date) {
      return NextResponse.json({ error: '标题和日期不能为空' }, { status: 400 })
    }

    const anniversary = await prisma.anniversary.create({
      data: {
        title,
        date: new Date(date),
        description,
        icon,
        color,
        isRecurring: isRecurring ?? true,
      },
    })

    return NextResponse.json(anniversary, { status: 201 })
  } catch (error) {
    console.error('创建纪念日失败:', error)
    return NextResponse.json({ error: '创建纪念日失败' }, { status: 500 })
  }
}

// PUT /api/anniversaries?id=xxx - 更新纪念日
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, date, description, icon, color, isRecurring } = body

    const anniversary = await prisma.anniversary.update({
      where: { id },
      data: {
        title,
        date: date ? new Date(date) : undefined,
        description,
        icon,
        color,
        isRecurring,
      },
    })

    return NextResponse.json(anniversary)
  } catch (error) {
    console.error('更新纪念日失败:', error)
    return NextResponse.json({ error: '更新纪念日失败' }, { status: 500 })
  }
}

// DELETE /api/anniversaries?id=xxx - 删除纪念日
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    await prisma.anniversary.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除纪念日失败:', error)
    return NextResponse.json({ error: '删除纪念日失败' }, { status: 500 })
  }
}
