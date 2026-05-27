/**
 * 文章详情页 - 服务端直接查询数据库
 * 不再通过 HTTP 调用 API，避免 serverless 环境问题
 */

import { prisma } from '@/lib/prisma';
import StoryDetailClient from './StoryDetailClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

// 直接从数据库获取文章
async function getArticle(id: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
        comments: {
          where: { parentId: null },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    
    if (!article) return null;
    
    // 将 Date 转换为字符串以匹配组件接口
    return {
      ...article,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      comments: article.comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        replies: comment.replies.map(reply => ({
          ...reply,
          createdAt: reply.createdAt.toISOString(),
        })),
      })),
    };
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}

export default async function StoryPage({ params }: PageProps) {
  const { id } = await params;
  
  // 直接从数据库获取文章
  const article = await getArticle(id);
  
  // 如果文章不存在，返回 404
  if (!article) {
    notFound();
  }
  
  return <StoryDetailClient article={article} />;
}
