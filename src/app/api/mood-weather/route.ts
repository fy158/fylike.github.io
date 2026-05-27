import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/mood-weather - 获取心情天气记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const limit = parseInt(searchParams.get('limit') || '30')

    if (date) {
      // 获取特定日期的记录
      const record = await prisma.moodWeather.findUnique({
        where: { date },
      })
      return NextResponse.json(record)
    }

    // 获取最近记录
    const records = await prisma.moodWeather.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(records)
  } catch (error) {
    console.error('获取心情天气记录失败:', error)
    return NextResponse.json({ error: '获取心情天气记录失败' }, { status: 500 })
  }
}

// POST /api/mood-weather - 创建或更新心情天气
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { moodId, label, icon, note, color, date } = body

    if (!moodId || !label || !icon || !color || !date) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    // 使用 upsert 创建或更新
    const record = await prisma.moodWeather.upsert({
      where: { date },
      update: { moodId, label, icon, note, color },
      create: { moodId, label, icon, note, color, date },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('保存心情天气失败:', error)
    return NextResponse.json({ error: '保存心情天气失败' }, { status: 500 })
  }
}

// DELETE /api/mood-weather?id=xxx - 删除记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    await prisma.moodWeather.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除心情天气记录失败:', error)
    return NextResponse.json({ error: '删除心情天气记录失败' }, { status: 500 })
  }
}
