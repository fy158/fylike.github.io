import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/articles/[id] - 获取文章详情（views+1）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: { id: true, username: true, avatar: true },
            },
            replies: {
              orderBy: { createdAt: 'asc' },
              include: {
                author: {
                  select: { id: true, username: true, avatar: true },
                },
              },
            },
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    // 浏览量 +1
    await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ ...article, views: article.views + 1 })
  } catch (error) {
    console.error('获取文章详情失败:', error)
    return NextResponse.json({ error: '获取文章详情失败' }, { status: 500 })
  }
}

// PUT /api/articles/[id] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, content, excerpt, categoryName, coverImage } = body

    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    const oldCategory = existing.categoryName
    const newCategory = categoryName || oldCategory

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && {
          content: Array.isArray(content) ? JSON.stringify(content) : content,
        }),
        ...(excerpt !== undefined && { excerpt }),
        ...(categoryName && { categoryName }),
        ...(coverImage && { coverImage }),
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    // 如果分类发生变化，更新分类计数
    if (categoryName && categoryName !== oldCategory) {
      await prisma.category.update({
        where: { name: oldCategory },
        data: { count: { decrement: 1 } },
      }).catch(() => {})

      await prisma.category.upsert({
        where: { name: categoryName },
        update: { count: { increment: 1 } },
        create: { name: categoryName, slug: categoryName.toLowerCase().replace(/\s+/g, '-') },
      })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error('更新文章失败:', error)
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 })
  }
}

// DELETE /api/articles/[id] - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await prisma.article.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: '文章不存在' }, { status: 404 })
    }

    await prisma.article.delete({ where: { id } })

    // 更新分类计数
    await prisma.category.update({
      where: { name: existing.categoryName },
      data: { count: { decrement: 1 } },
    }).catch(() => {})

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除文章失败:', error)
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 })
  }
}
