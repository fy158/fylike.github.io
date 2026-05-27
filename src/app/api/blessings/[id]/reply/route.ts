import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/blessings/[id]/reply - 回复祝福
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.blessing.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: '祝福不存在' }, { status: 404 })
    }

    const body = await request.json()
    const { author, content, toUser } = body

    if (!author || !content) {
      return NextResponse.json({ error: '缺少必填字段：author, content' }, { status: 400 })
    }

    const reply = await prisma.blessingReply.create({
      data: {
        author,
        content,
        toUser: toUser || null,
        blessingId: id,
      },
    })

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    console.error('回复祝福失败:', error)
    return NextResponse.json({ error: '回复祝福失败' }, { status: 500 })
  }
}
