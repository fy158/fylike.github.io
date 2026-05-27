/**
 * 分类页面 - 服务端组件
 * 在服务端获取数据，避免客户端 fetch 问题
 */

import { prisma } from '@/lib/prisma';
import CategoryPageClient from './CategoryPageClient';

// 英文 slug 到中文分类名的映射
const slugToName: Record<string, string> = {
  'love': '爱情故事',
  'guide': '恋爱攻略',
  'letter': '微情书',
  'qa': '情感问答',
  '爱情故事': '爱情故事',
  '恋爱攻略': '恋爱攻略',
  '微情书': '微情书',
  '情感问答': '情感问答',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;
  // params.slug 是 URL 编码的，需要解码
  const slug = decodeURIComponent(resolvedParams.slug);
  const categoryName = slugToName[slug] || '未知分类';
  
  console.log('Category page - slug:', slug, 'categoryName:', categoryName);
  
  // 在服务端获取文章
  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  try {
    articles = await prisma.article.findMany({
      where: { categoryName },
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
    console.log('Found articles:', articles.length);
  } catch (error) {
    console.error('获取分类文章失败:', error);
  }
  
  return <CategoryPageClient categoryName={categoryName} initialArticles={articles as any} />;
}
