/**
 * 文章瀑布流组件
 * 双列布局展示文章卡片，点击跳转到详情页，支持加载更多
 * 从 API 获取数据
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuickPostModal from './QuickPostModal';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  categoryName: string;
  coverImage: string;
  views: number;
  createdAt: string;
  author: {
    username: string;
  };
}

const INITIAL_DISPLAY_COUNT = 4;

// 默认文章数据
const defaultArticles: Article[] = [
  {
    id: '1',
    title: '在一起500天，他依然会每天说早安',
    content: '',
    excerpt: '每天早上醒来，第一件事就是收到他的早安消息，这种被惦记的感觉真的很幸福...',
    categoryName: '爱情故事',
    coverImage: '/images/story-love-1.jpg',
    views: 15680,
    createdAt: '2024-01-15',
    author: { username: '小确幸' }
  },
  {
    id: '2',
    title: '第一次约会这样做，让他对你念念不忘',
    content: '',
    excerpt: '第一次约会的细节决定了你们关系的走向，这些小技巧你一定要知道...',
    categoryName: '恋爱攻略',
    coverImage: '/images/story-guide-1.jpg',
    views: 12345,
    createdAt: '2024-01-14',
    author: { username: '恋爱达人' }
  },
  {
    id: '3',
    title: '异地恋三年，我们终于修成正果',
    content: '',
    excerpt: '从相隔千里到朝夕相伴，这三年的等待终于换来了今天的幸福...',
    categoryName: '爱情故事',
    coverImage: '/images/story-love-2.jpg',
    views: 23456,
    createdAt: '2024-01-13',
    author: { username: '幸福终点站' }
  },
  {
    id: '4',
    title: '写给未来的你：我在等一个人',
    content: '',
    excerpt: '我不知道你现在在哪里，但我知道，总有一天我们会相遇...',
    categoryName: '微情书',
    coverImage: '/images/story-letter-1.jpg',
    views: 9876,
    createdAt: '2024-01-12',
    author: { username: '等待者' }
  },
];

export default function ArticleGrid() {
  const [articles, setArticles] = useState<Article[]>(defaultArticles);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(defaultArticles.length);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('爱情故事');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 获取文章列表
  const fetchArticles = useCallback(async (offset = 0, limit = 8) => {
    try {
      const res = await fetch(`/api/articles?page=1&limit=${limit}&offset=${offset}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (error) {
      console.error('获取文章失败:', error);
    }
    return null;
  }, []);

  const refreshArticles = async () => {
    const data = await fetchArticles(0, 20);
    if (data && data.articles && data.articles.length > 0) {
      setArticles(data.articles);
      setTotal(data.total || 0);
    }
  };

  useEffect(() => {
    const load = async () => {
      const data = await fetchArticles(0, 20);
      if (data && data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        setTotal(data.total || 0);
      }
    };
    load();
  }, [fetchArticles]);

  const displayedArticles = articles.slice(0, displayCount);
  const hasMore = displayCount < articles.length;

  // 获取分类颜色
  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      '爱情故事': 'from-pink-400 to-rose-400',
      '恋爱攻略': 'from-purple-400 to-pink-400',
      '微情书': 'from-rose-400 to-orange-400',
      '情感问答': 'from-blue-400 to-purple-400',
    };
    return colors[categoryName] || 'from-pink-400 to-rose-400';
  };

  // 格式化阅读量
  const formatViews = (views: number) => {
    if (views >= 10000) {
      return `${(views / 10000).toFixed(1)}w`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\//g, '-');
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    setDisplayCount((prev) => Math.min(prev + 4, articles.length));
    setIsLoadingMore(false);
  };

  const openModal = (category: string) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // 删除文章
  const handleDelete = async (e: React.MouseEvent, articleId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return;
    }

    setDeletingId(articleId);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        // 从列表中移除
        setArticles(prev => prev.filter(a => a.id !== articleId));
        setTotal(prev => prev - 1);
        alert('删除成功！');
      } else {
        const data = await res.json();
        alert(data.error || '删除失败');
      }
    } catch (error) {
      console.error('删除文章失败:', error);
      alert('删除失败，请重试');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <section id="articles">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="gradient-text">精选文章</span>
          </h2>
          <p className="text-gray-500">每一篇都是心动的记录</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="articles">
      {/* 标题和发布按钮 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          <span className="gradient-text">精选文章</span>
        </h2>
        <p className="text-gray-500 mb-6">每一篇都是心动的记录</p>
        
        {/* 快速发布按钮组 */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => openModal('微情书')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-400 to-orange-400 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>💌</span> 写情书
          </button>
          <button
            onClick={() => openModal('爱情故事')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>💕</span> 写故事
          </button>
          <button
            onClick={() => openModal('恋爱攻略')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>💡</span> 写攻略
          </button>
          <button
            onClick={() => openModal('情感问答')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <span>❓</span> 提问题
          </button>
        </div>
      </div>

      {/* 瀑布流布局 */}
      <div className="grid md:grid-cols-2 gap-6">
          {displayedArticles.map((article, index) => (
            <Link
              key={article.id}
              href={`/stories/${article.id}`}
              className={`
                bg-white rounded-2xl shadow-md overflow-hidden card-hover cursor-pointer block relative group
                ${index % 3 === 0 ? 'md:translate-y-0' : ''}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* 删除按钮 */}
              <button
                onClick={(e) => handleDelete(e, article.id)}
                disabled={deletingId === article.id}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                title="删除文章"
              >
                {deletingId === article.id ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>

              {/* 封面图 */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                {/* 分类标签 */}
                <div className="absolute top-4 left-4">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium text-white
                    bg-gradient-to-r ${getCategoryColor(article.categoryName)}
                  `}>
                    {article.categoryName}
                  </span>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 hover:text-pink-500 transition-colors">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                {/* 底部信息 */}
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {article.author?.username || '匿名'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {formatViews(article.views)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      {/* 加载更多按钮 */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className={`px-8 py-3 rounded-full font-medium shadow-lg transition-all duration-300 ${
              isLoadingMore
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-pink-300 hover:shadow-xl hover:from-pink-500 hover:to-pink-700'
            }`}
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </button>
        </div>
      )}

      {/* 发布弹窗 */}
      <QuickPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
        categoryLabel={selectedCategory === '微情书' ? '情书' : selectedCategory === '爱情故事' ? '故事' : selectedCategory === '恋爱攻略' ? '攻略' : '问题'}
        onSuccess={refreshArticles}
      />
    </section>
  );
}
