import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - 删除链接
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.linkCollection.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除链接失败:', error)
    return NextResponse.json({ error: '删除链接失败' }, { status: 500 })
  }
}

// PATCH - 更新链接
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, url, coverImage, icon, order } = body

    const link = await prisma.linkCollection.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(url && { url }),
        ...(coverImage && { coverImage }),
        ...(icon && { icon }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('更新链接失败:', error)
    return NextResponse.json({ error: '更新链接失败' }, { status: 500 })
  }
}
