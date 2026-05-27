import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/articles - 文章列表（分页、筛选、搜索）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (category) {
      where.categoryName = category
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, username: true, avatar: true },
          },
        },
      }),
      prisma.article.count({ where }),
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return NextResponse.json({ error: '获取文章列表失败' }, { status: 500 })
  }
}

// POST /api/articles - 创建文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, categoryName, coverImage, authorId: bodyAuthorId } = body

    if (!title || !content || !categoryName) {
      return NextResponse.json({ error: '缺少必填字段：title, content, categoryName' }, { status: 400 })
    }

    // 处理 authorId：可能是用户名或用户ID
    let authorId = bodyAuthorId || request.headers.get('authorId')
    
    // 如果 authorId 看起来像用户名（不是cuid格式），查找对应的用户ID
    if (authorId && !authorId.startsWith('cm')) {
      const userByUsername = await prisma.user.findFirst({
        where: { username: authorId }
      })
      if (userByUsername) {
        authorId = userByUsername.id
      }
    }
    
    // 如果没有 authorId，尝试查找或创建默认用户
    if (!authorId) {
      const defaultUser = await prisma.user.findFirst({
        where: { username: 'admin' }
      })
      
      if (defaultUser) {
        authorId = defaultUser.id
      } else {
        // 创建默认用户
        const newUser = await prisma.user.create({
          data: {
            username: 'admin',
            email: 'admin@example.com',
            password: await bcrypt.hash('admin123', 10),
            avatar: '/images/avatar.jpg',
          }
        })
        authorId = newUser.id
      }
    }

    // 处理 content：如果是数组，用换行符连接成字符串
    const contentString = Array.isArray(content) 
      ? content.join('\n\n') 
      : (typeof content === 'string' ? content : JSON.stringify(content))

    // 先确保分类存在（外键约束要求）
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { 
        name: categoryName, 
        slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') 
      },
    })

    const article = await prisma.article.create({
      data: {
        title,
        content: contentString,
        excerpt: excerpt || null,
        categoryName,
        coverImage: coverImage || '/images/story-default.jpg',
        authorId,
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    })

    // 更新分类计数
    await prisma.category.update({
      where: { name: categoryName },
      data: { count: { increment: 1 } },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('创建文章失败:', error)
    return NextResponse.json({ error: `创建文章失败: ${error instanceof Error ? error.message : '未知错误'}` }, { status: 500 })
  }
}
