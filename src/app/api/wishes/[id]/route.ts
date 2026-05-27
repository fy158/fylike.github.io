import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/wishes/[id] - 删除愿望
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.wish.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: '愿望不存在' }, { status: 404 })
    }

    await prisma.wish.delete({ where: { id } })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除愿望失败:', error)
    return NextResponse.json({ error: '删除愿望失败' }, { status: 500 })
  }
}

// POST /api/wishes/[id]/like - 点赞（likes+1）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.wish.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: '愿望不存在' }, { status: 404 })
    }

    const wish = await prisma.wish.update({
      where: { id },
      data: { likes: { increment: 1 } },
    })

    return NextResponse.json(wish)
  } catch (error) {
    console.error('点赞失败:', error)
    return NextResponse.json({ error: '点赞失败' }, { status: 500 })
  }
}
