import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE - 删除AI生成内容
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.aIGeneratedContent.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除AI生成内容失败:', error)
    return NextResponse.json(
      { error: '删除AI生成内容失败' },
      { status: 500 }
    )
  }
}

// PATCH - 更新AI生成内容
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, type, url, coverImage, icon, category } = body

    const content = await prisma.aIGeneratedContent.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(type && { type }),
        ...(url && { url }),
        ...(coverImage && { coverImage }),
        ...(icon && { icon }),
        ...(category && { category })
      }
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('更新AI生成内容失败:', error)
    return NextResponse.json(
      { error: '更新AI生成内容失败' },
      { status: 500 }
    )
  }
}
