/**
 * 分类页面客户端组件
 * 接收服务端传递的数据
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

// 分类图标
const categoryIcons: Record<string, React.ReactNode> = {
  '爱情故事': (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  '恋爱攻略': (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  '微情书': (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
  ),
  '情感问答': (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
    </svg>
  ),
};

// 分类颜色
const categoryColors: Record<string, string> = {
  '爱情故事': 'from-pink-400 to-rose-500',
  '恋爱攻略': 'from-purple-400 to-pink-500',
  '微情书': 'from-rose-400 to-orange-400',
  '情感问答': 'from-blue-400 to-purple-500',
};

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  categoryName: string;
  coverImage: string;
  views: number;
  createdAt: string;
  author: {
    username: string;
  };
}

interface CategoryPageClientProps {
  categoryName: string;
  initialArticles: Article[];
}

export default function CategoryPageClient({ categoryName, initialArticles }: CategoryPageClientProps) {
  const [articles] = useState<Article[]>(initialArticles);
  
  const categoryColor = categoryColors[categoryName] || 'from-pink-400 to-rose-500';
  
  // 格式化阅读量
  const formatViews = (views: number) => {
    if (views >= 10000) return `${(views / 10000).toFixed(1)}w`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  return (
    <main className="min-h-screen bg-[#fff5f7]">
      <SakuraPetals />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />
      <Sidebar />

      {/* 分类头部 */}
      <div className={`relative py-20 bg-gradient-to-br ${categoryColor} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white/20 blur-3xl" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            {categoryIcons[categoryName]}
          </div>
          <h1 className="text-4xl font-bold mb-4">{categoryName}</h1>
          <p className="text-lg opacity-90 mb-6">
            共收录 {articles.length} 篇精选内容
          </p>
          
          {/* 面包屑导航 */}
          <div className="flex items-center justify-center gap-2 text-sm opacity-80">
            <Link href="/" className="hover:opacity-100 transition-opacity">首页</Link>
            <span>/</span>
            <span className="opacity-100">{categoryName}</span>
          </div>
        </div>
      </div>

      {/* 文章列表 */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <Link
                key={article.id}
                href={`/stories/${article.id}`}
                className="group bg-white rounded-2xl shadow-md overflow-hidden card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 文章封面 */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-medium text-pink-500">
                      {article.categoryName}
                    </span>
                  </div>
                </div>
                
                {/* 文章信息 */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {article.excerpt || '暂无摘要'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{article.author?.username || '匿名'}</span>
                    <span>{formatViews(article.views)} 阅读</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500">该分类下暂无文章</p>
            <Link 
              href="/"
              className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full hover:scale-105 transition-transform"
            >
              返回首页
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
