/**
 * 分类展示组件
 * 展示文章分类和数量 - 点击可进入分类页面
 * 从 API 获取数据
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  articlesCount?: number;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'love': (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      <path d="M12 18.5l-1-0.9C7 14.5 5 12.2 5 9.5 5 7.6 6.3 6 8.2 6c1.2 0 2.3.6 2.8 1.5.5-.9 1.6-1.5 2.8-1.5 1.9 0 3.2 1.6 3.2 3.5 0 2.7-2 5-6 8.1l-1 .9z" fill="white" opacity="0.5"/>
    </svg>
  ),
  'guide': (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" fill="currentColor" opacity="0.3"/>
      <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'letter': (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      <path d="M12 10.5l-4-3h8l-4 3z" fill="white" opacity="0.5"/>
    </svg>
  ),
  'qa': (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      <circle cx="9" cy="9" r="1.5" fill="white"/>
      <circle cx="15" cy="9" r="1.5" fill="white"/>
      <path d="M8 13c1.5 2 4.5 2 6 0" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  ),
};

const categoryColors: Record<string, string> = {
  'love': 'from-pink-400 to-rose-500',
  'guide': 'from-purple-400 to-pink-500',
  'letter': 'from-rose-400 to-orange-400',
  'qa': 'from-blue-400 to-purple-500',
};

// 默认分类数据
const defaultCategories: Category[] = [
  { id: '1', name: '爱情故事', slug: 'love', count: 128, articlesCount: 128 },
  { id: '2', name: '恋爱攻略', slug: 'guide', count: 86, articlesCount: 86 },
  { id: '3', name: '微情书', slug: 'letter', count: 256, articlesCount: 256 },
  { id: '4', name: '情感问答', slug: 'qa', count: 64, articlesCount: 64 },
];

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section id="categories" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="gradient-text">文章分类</span>
            </h2>
            <p className="text-gray-500">探索不同类型的爱情故事</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-md p-6 text-center animate-pulse">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-200" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories">
      {/* 标题 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          <span className="gradient-text">文章分类</span>
        </h2>
        <p className="text-gray-500">探索不同类型的爱情故事</p>
      </div>

      {/* 分类卡片 - 可点击 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group bg-white rounded-2xl shadow-md p-6 text-center cursor-pointer card-hover block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 图标容器 - 使用渐变背景 */}
              <div className={`
                w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                bg-gradient-to-br ${categoryColors[category.slug] || 'from-pink-400 to-rose-500'} text-white
                transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                shadow-lg group-hover:shadow-xl
              `}>
                {categoryIcons[category.slug] || categoryIcons['love']}
              </div>

              {/* 分类名称 */}
              <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-pink-500 transition-colors">
                {category.name}
              </h3>

              {/* 文章数量 */}
              <p className="text-sm text-gray-400">
                {category.articlesCount ?? category.count} 篇文章
              </p>
              
              {/* 查看更多提示 */}
              <div className="mt-3 text-xs text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">
                点击查看 →
              </div>
            </Link>
          ))}
        </div>
    </section>
  );
}
