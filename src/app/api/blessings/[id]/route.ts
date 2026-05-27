import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE /api/blessings/[id] - 删除祝福
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.blessing.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: '祝福不存在' }, { status: 404 })
    }

    await prisma.blessing.delete({ where: { id } })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除祝福失败:', error)
    return NextResponse.json({ error: '删除祝福失败' }, { status: 500 })
  }
}
