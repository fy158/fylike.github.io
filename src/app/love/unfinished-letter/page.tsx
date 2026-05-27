/**
 * 一封未尽的情书 - 链接收藏页面
 * 外链收藏夹，支持添加、删除、跳转网址
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';

interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  coverImage: string;
  icon: string;
  order: number;
}

export default function UnfinishedLetterPage() {
  const [isDark, setIsDark] = useState(false);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 添加表单状态
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    icon: '🔗'
  });
  const [coverImage, setCoverImage] = useState<string>('');

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  // 获取链接列表
  const fetchLinks = useCallback(async () => {
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      }
    } catch (error) {
      console.error('获取链接失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  // 上传封面图片
  const uploadCover = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64,
              filename: `link-cover-${Date.now()}.webp`
            })
          });

          if (!response.ok) throw new Error('上传失败');
          const data = await response.json();
          resolve(data.url);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      alert('请上传封面图片');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coverImage
        })
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({ title: '', description: '', url: '', icon: '🔗' });
        setCoverImage('');
        fetchLinks();
        alert('添加成功！');
      } else {
        throw new Error('添加失败');
      }
    } catch (error) {
      console.error('添加失败:', error);
      alert('添加失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 删除链接
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个链接吗？')) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/links/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchLinks();
        alert('删除成功！');
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    } finally {
      setDeletingId(null);
    }
  };

  // 处理封面上传
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadCover(file);
      setCoverImage(url);
    } catch (error) {
      console.error('封面上传失败:', error);
      alert('封面上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className={`min-h-screen transition-colors duration-1000 ${
      isDark ? 'bg-[#0a0e27]' : 'bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50'
    }`}>
      <SakuraPetals />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />

      {/* 头部 */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27]/80 border-white/10' : 'bg-white/80 border-pink-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/love/moments" className={`flex items-center gap-2 transition-colors ${
            isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-500'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回点点滴滴</span>
          </Link>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            💌 一封未尽的情书
          </h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm hover:scale-105 transition-transform"
          >
            + 添加链接
          </button>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 顶部介绍 - 封面背景 */}
        <div className="relative mb-12 rounded-3xl overflow-hidden h-64 md:h-80 group">
          {/* 背景图片 */}
          <img
            src="/images/love-letter-cover.webp"
            alt="情书封面"
            className="absolute inset-0 w-full h-full object-cover object-[center_55%]"
          />
          {/* 文字内容 - 毛玻璃效果 */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
            <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/40 transition-all duration-500 group-hover:bg-white/80 group-hover:dark:bg-black/80 group-hover:shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg group-hover:text-gray-800 group-hover:dark:text-white transition-colors duration-500">
                💌 写不完的情话 💌
              </h2>
              <p className="text-base md:text-lg text-white/90 max-w-md text-center drop-shadow group-hover:text-gray-600 group-hover:dark:text-gray-300 transition-colors duration-500">
                这里收藏着我们一起走过的点点滴滴，每一个链接都是一段美好的回忆
              </p>
            </div>
          </div>
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>加载中...</p>
          </div>
        )}

        {/* 链接卡片网格 */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <div
                key={link.id}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                  isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-md'
                }`}
              >
                {/* 封面图片 */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={link.coverImage}
                    alt={link.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/ai-covers/default-cover.webp';
                    }}
                  />
                  {/* 遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* 删除按钮 */}
                  <button
                    onClick={() => handleDelete(link.id)}
                    disabled={deletingId === link.id}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {deletingId === link.id ? '...' : '✕'}
                  </button>

                  {/* 图标 */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-2xl shadow-lg">
                    {link.icon}
                  </div>
                </div>

                {/* 内容区域 */}
                <div className="p-4">
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {link.title}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {link.description}
                  </p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm hover:scale-105 transition-transform"
                  >
                    <span>去看看</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 空状态 */}
        {!loading && links.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💌</div>
            <p className={`text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              还没有收藏任何链接
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105 transition-transform"
            >
              添加第一个链接
            </button>
          </div>
        )}
      </div>

      {/* 添加表单弹窗 */}
      {showAddForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddForm(false)} />
          <div className={`relative w-full max-w-lg max-h-[90vh] overflow-auto rounded-3xl shadow-2xl ${
            isDark ? 'bg-[#1a1a2e]' : 'bg-white'
          }`}>
            {/* 弹窗头部 */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDark ? 'border-white/10' : 'border-gray-100'
            }`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                💌 添加新链接
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                ✕
              </button>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* 标题 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  标题 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  placeholder="给这个链接起个名字"
                />
              </div>

              {/* 描述 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  描述文字 *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  rows={3}
                  placeholder="描述一下这个链接的内容"
                />
              </div>

              {/* 网址 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  跳转网址 *
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  placeholder="https://..."
                />
              </div>

              {/* 图标 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  图标 (emoji)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                  placeholder="🔗"
                  maxLength={2}
                />
              </div>

              {/* 封面图片 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  封面图片 *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-pink-500`}
                />
                {coverImage && (
                  <div className="mt-2 relative">
                    <img
                      src={coverImage}
                      alt="封面预览"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <span className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      已上传
                    </span>
                  </div>
                )}
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {uploading ? '添加中...' : '确认添加'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className={`text-center py-8 mt-8 border-t transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27] border-white/10 text-gray-500' : 'bg-white border-pink-100 text-gray-500'
      }`}>
        <p>Made with <span className="text-red-400">♥</span> by 桃小淘</p>
      </footer>
    </main>
  );
}
