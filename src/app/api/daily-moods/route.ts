import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/daily-moods - 获取每日心情标记
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const date = searchParams.get('date')

    if (date) {
      // 获取特定日期
      const record = await prisma.dailyMood.findUnique({
        where: { date },
      })
      return NextResponse.json(record)
    }

    if (year && month) {
      // 获取某年某月的所有记录
      const startDate = `${year}-${month.padStart(2, '0')}-01`
      const endMonth = parseInt(month) + 1
      const endDate = `${year}-${endMonth.toString().padStart(2, '0')}-01`
      
      const records = await prisma.dailyMood.findMany({
        where: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: { date: 'asc' },
      })
      return NextResponse.json(records)
    }

    // 获取所有记录
    const records = await prisma.dailyMood.findMany({
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error('获取每日心情失败:', error)
    return NextResponse.json({ error: '获取每日心情失败' }, { status: 500 })
  }
}

// POST /api/daily-moods - 创建或更新每日心情
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, mood, emoji, note } = body

    if (!date || !mood || !emoji) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const record = await prisma.dailyMood.upsert({
      where: { date },
      update: { mood, emoji, note },
      create: { date, mood, emoji, note },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('保存每日心情失败:', error)
    return NextResponse.json({ error: '保存每日心情失败' }, { status: 500 })
  }
}

// PUT /api/daily-moods?id=xxx - 更新记录
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const body = await request.json()
    const { mood, emoji, note } = body

    const record = await prisma.dailyMood.update({
      where: { id },
      data: { mood, emoji, note },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('更新每日心情失败:', error)
    return NextResponse.json({ error: '更新每日心情失败' }, { status: 500 })
  }
}

// DELETE /api/daily-moods?id=xxx - 删除记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    await prisma.dailyMood.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除每日心情失败:', error)
    return NextResponse.json({ error: '删除每日心情失败' }, { status: 500 })
  }
}
