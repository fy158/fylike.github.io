import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有AI生成内容
export async function GET() {
  try {
    const contents = await prisma.aIGeneratedContent.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(contents)
  } catch (error) {
    console.error('获取AI生成内容失败:', error)
    return NextResponse.json(
      { error: '获取AI生成内容失败' },
      { status: 500 }
    )
  }
}

// POST - 创建新的AI生成内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, type, url, coverImage, icon, category } = body

    // 验证必填字段
    if (!title || !description || !type || !url || !coverImage || !category) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    const content = await prisma.aIGeneratedContent.create({
      data: {
        title,
        description,
        type,
        url,
        coverImage,
        icon: icon || '✨',
        category
      }
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('创建AI生成内容失败:', error)
    return NextResponse.json(
      { error: '创建AI生成内容失败' },
      { status: 500 }
    )
  }
}
