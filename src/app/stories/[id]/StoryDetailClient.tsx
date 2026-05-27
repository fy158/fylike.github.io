/**
 * 文章详情页 - 客户端内容组件
 * 显示文章标题、分类、作者、日期、阅读量、封面大图、正文
 * 包含点赞、返回首页、上一篇/下一篇导航
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { stories } from '@/data/content';
import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

interface StoryDetailClientProps {
  article?: {
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
  } | null;
}

export default function StoryDetailClient({ article: apiArticle }: StoryDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  // 优先使用 API 数据，否则使用本地数据
  const localStory = stories.find((s) => s.id === id);
  const story = apiArticle || localStory;

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!story) {
    return (
      <div className="min-h-screen bg-[#fff5f7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-400 mb-4">404</h1>
          <p className="text-gray-500 mb-8">文章未找到</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full hover:from-pink-500 hover:to-pink-700 transition-all"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = stories.findIndex((s) => s.id === id);
  const prevStory = currentIndex > 0 ? stories[currentIndex - 1] : null;
  const nextStory = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null;

  const formatViews = (views: number) => {
    if (views >= 10000) return `${(views / 10000).toFixed(1)}w`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}k`;
    return views.toString();
  };

  const handleLike = () => {
    if (!liked) {
      setLikes(1);
      setLiked(true);
    }
  };

  // 删除文章
  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('删除成功！');
        router.push('/');
      } else {
        const data = await res.json();
        alert(data.error || '删除失败');
      }
    } catch (error) {
      console.error('删除文章失败:', error);
      alert('删除失败，请重试');
    } finally {
      setIsDeleting(false);
    }
  };

  // 使用文章内容或生成默认内容
  const paragraphs = story.content ? 
    (typeof story.content === 'string' ? story.content.split('\n\n') : story.content) : 
    [story.excerpt || '暂无内容'];

  // 获取分类显示名称
  const categoryName = apiArticle?.categoryName || (story as any).categoryName || (story as any).category;

  return (
    <main className="min-h-screen bg-[#fff5f7]">
      <SakuraPetals />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />
      <Sidebar />

      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">返回首页</span>
          </Link>
          <div className="flex items-center gap-3">
            {/* 删除按钮 */}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-sm"
              title="删除文章"
            >
              {isDeleting ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>删除</span>
                </>
              )}
            </button>
            <span className="text-sm text-gray-400">甜心恋语</span>
          </div>
        </div>
      </div>

      {/* 文章内容 */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* 文章头部 */}
        <header className="mb-8 animate-fade-in">
          {/* 分类标签 */}
          <div className="mb-4">
            <Link 
              href={`/category/${['love', 'guide', 'letter', 'qa'][['爱情故事', '恋爱攻略', '微情书', '情感问答'].indexOf(categoryName)]}`}
              className="px-4 py-1 bg-gradient-to-r from-pink-400 to-pink-600 text-white text-sm rounded-full hover:from-pink-500 hover:to-pink-700 transition-all"
            >
              {categoryName}
            </Link>
          </div>

          {/* 标题 */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {story.title}
          </h1>

          {/* 作者信息 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                {(apiArticle?.author?.username || (typeof story.author === 'string' ? story.author : story.author?.username))?.charAt(0)}
              </div>
              <span className="font-medium text-gray-700">{apiArticle?.author?.username || (typeof story.author === 'string' ? story.author : story.author?.username)}</span>
            </div>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {apiArticle ? new Date(apiArticle.createdAt).toLocaleDateString('zh-CN') : ((story as any).date || new Date((story as any).createdAt).toLocaleDateString('zh-CN'))}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatViews((apiArticle?.views || story.views) + likes)} 阅读
            </span>
          </div>
        </header>

        {/* 封面大图 */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 shadow-xl animate-fade-in-up">
          <Image
            src={apiArticle?.coverImage || (story as any).image || (story as any).coverImage}
            alt={story.title}
            fill
            className="object-cover"
          />
        </div>

        {/* 正文内容 */}
        <div className="prose prose-lg max-w-none mb-12 animate-fade-in-up">
          {Array.isArray(paragraphs) ? paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-gray-700 leading-relaxed text-lg mb-6"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {paragraph}
            </p>
          )) : (
            <p className="text-gray-700 leading-relaxed text-lg mb-6">{paragraphs}</p>
          )}
        </div>

        {/* 点赞区域 */}
        <div className="flex items-center justify-center gap-6 py-8 border-t border-b border-pink-100 mb-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-8 py-3 rounded-full transition-all duration-300 ${
              liked
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-300'
                : 'bg-white text-pink-500 border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50'
            }`}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${liked ? 'scale-110' : ''}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">{(apiArticle?.views || story.views) + likes}</span>
          </button>
        </div>

        {/* 上一篇/下一篇导航 */}
        <nav className="grid md:grid-cols-2 gap-4">
          {prevStory ? (
            <Link
              href={`/stories/${prevStory.id}`}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all card-hover"
            >
              <span className="text-sm text-gray-400 mb-2 block">← 上一篇</span>
              <span className="text-gray-700 font-medium group-hover:text-pink-500 transition-colors line-clamp-2">
                {prevStory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextStory ? (
            <Link
              href={`/stories/${nextStory.id}`}
              className="group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all card-hover text-right"
            >
              <span className="text-sm text-gray-400 mb-2 block">下一篇 →</span>
              <span className="text-gray-700 font-medium group-hover:text-pink-500 transition-colors line-clamp-2">
                {nextStory.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>

      <Footer />
    </main>
  );
}
