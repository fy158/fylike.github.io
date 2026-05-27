import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/emotion-records - 获取情绪记录
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    const [records, total] = await Promise.all([
      prisma.emotionRecord.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.emotionRecord.count(),
    ])

    return NextResponse.json({
      records,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('获取情绪记录失败:', error)
    return NextResponse.json({ error: '获取情绪记录失败' }, { status: 500 })
  }
}

// POST /api/emotion-records - 创建情绪记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { emotionId, emotion, icon, level, note } = body

    if (!emotionId || !emotion || !icon || !level) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const record = await prisma.emotionRecord.create({
      data: { emotionId, emotion, icon, level, note },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error('创建情绪记录失败:', error)
    return NextResponse.json({ error: '创建情绪记录失败' }, { status: 500 })
  }
}

// PUT /api/emotion-records?id=xxx - 更新记录
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    const body = await request.json()
    const { emotionId, emotion, icon, level, note } = body

    const record = await prisma.emotionRecord.update({
      where: { id },
      data: { emotionId, emotion, icon, level, note },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error('更新情绪记录失败:', error)
    return NextResponse.json({ error: '更新情绪记录失败' }, { status: 500 })
  }
}

// DELETE /api/emotion-records?id=xxx - 删除记录
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '缺少ID' }, { status: 400 })
    }

    await prisma.emotionRecord.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除情绪记录失败:', error)
    return NextResponse.json({ error: '删除情绪记录失败' }, { status: 500 })
  }
}
