/**
 * 有趣的AI生成页面
 * 展示AI生成的网页和图片作品
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SparkleParticles from '@/components/SparkleParticles';
import AIWelcomePopup from '@/components/AIWelcomePopup';
import MouseFollower from '@/components/MouseFollower';

interface AIGeneratedItem {
  id: string;
  title: string;
  description: string;
  type: 'html' | 'image';
  url: string;
  icon: string;
  category: string;
  coverImage: string;
  createdAt?: string;
}

const categories = ['全部', '自我提升', '学习工具', '效率工具', '生活工具', '趣味模拟', 'AI图片'];

export default function AIGeneratedPage() {
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [previewItem, setPreviewItem] = useState<AIGeneratedItem | null>(null);
  const [items, setItems] = useState<AIGeneratedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // 上传表单状态
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'html' as 'html' | 'image',
    category: '自我提升',
    icon: '✨',
    url: '',
    coverImage: ''
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedCover, setUploadedCover] = useState<File | null>(null);

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  // 获取数据
  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch('/api/ai-generated');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 过滤项目
  const filteredItems = activeCategory === '全部'
    ? items
    : items.filter(item => item.category === activeCategory);

  // 上传文件到服务器
  const uploadFile = async (file: File, type: 'html' | 'image'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/ai-generated/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('上传失败');
    }

    const data = await response.json();
    return data.url;
  };

  // 上传封面图片
  const uploadCoverImage = async (file: File): Promise<string> => {
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
              filename: `ai-cover-${Date.now()}.webp`
            })
          });

          if (!response.ok) {
            throw new Error('封面上传失败');
          }

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

  // 处理上传
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let url = uploadForm.url;
      let coverImage = uploadForm.coverImage;

      // 上传主文件
      if (uploadedFile) {
        url = await uploadFile(uploadedFile, uploadForm.type);
      }

      // 上传封面
      if (uploadedCover) {
        coverImage = await uploadCoverImage(uploadedCover);
      }

      // 如果没有封面，使用默认封面
      if (!coverImage) {
        coverImage = '/images/ai-covers/default-cover.webp';
      }

      // 创建记录
      const response = await fetch('/api/ai-generated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          url,
          coverImage
        })
      });

      if (response.ok) {
        setShowUploadForm(false);
        setUploadForm({
          title: '',
          description: '',
          type: 'html',
          category: '自我提升',
          icon: '✨',
          url: '',
          coverImage: ''
        });
        setUploadedFile(null);
        setUploadedCover(null);
        fetchItems();
        alert('上传成功！');
      } else {
        throw new Error('创建记录失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  // 处理删除
  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个项目吗？')) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`/api/ai-generated/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchItems();
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

  return (
    <main className={`min-h-screen transition-colors duration-1000 ${
      isDark ? 'bg-[#0a0e27]' : 'bg-gradient-to-b from-purple-50 via-pink-50 to-indigo-50'
    }`}>
      <SparkleParticles />
      <AIWelcomePopup />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />

      {/* 头部 */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27]/80 border-white/10' : 'bg-white/80 border-purple-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2 transition-colors ${
            isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回首页</span>
          </Link>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            🤖 有趣的AI生成
          </h1>
          <button
            onClick={() => setShowUploadForm(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm hover:scale-105 transition-transform"
          >
            + 新增内容
          </button>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 顶部介绍 - 1.5倍大 */}
        <div 
          className="text-center mb-12 p-12 rounded-3xl bg-cover bg-center relative overflow-hidden min-h-[240px] flex items-center justify-center"
          style={{ backgroundImage: 'url(/images/ai-covers/header-bg.webp)' }}
        >
          <div className={`absolute inset-0 ${isDark ? 'bg-black/50' : 'bg-white/30'}`} />
          <div className="relative z-10">
            <h2 className={`text-5xl font-bold mb-4 ${isDark ? 'text-white drop-shadow-lg' : 'text-purple-800 drop-shadow-md'}`}>
              🤖 AI 创意工坊
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-200 drop-shadow-md' : 'text-gray-800 drop-shadow-sm'}`}>
              用 AI 创造的有趣工具，游戏和精美图片
            </p>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : isDark
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-white text-gray-700 hover:bg-purple-50 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 加载状态 */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
            <p className={`mt-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>加载中...</p>
          </div>
        )}

        {/* 内容网格 */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${
                  isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-md'
                }`}
              >
                {/* 缩略图区域 */}
                <div 
                  className="h-40 flex items-center justify-center overflow-hidden cursor-pointer relative"
                  onClick={() => setPreviewItem(item)}
                >
                  <img 
                    src={item.coverImage || '/images/ai-covers/default-cover.webp'} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    disabled={deletingId === item.id}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {deletingId === item.id ? '...' : '✕'}
                  </button>
                </div>

                {/* 信息区域 */}
                <div className="p-4 cursor-pointer" onClick={() => setPreviewItem(item)}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {item.icon} {item.title}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-600'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 空状态提示 */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-16">
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              该分类暂无内容，点击"新增内容"添加吧！
            </p>
          </div>
        )}
      </div>

      {/* 上传表单弹窗 */}
      {showUploadForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadForm(false)} />
          <div className={`relative w-full max-w-lg max-h-[90vh] overflow-auto rounded-3xl shadow-2xl ${
            isDark ? 'bg-[#1a1a2e]' : 'bg-white'
          }`}>
            {/* 弹窗头部 */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDark ? 'border-white/10' : 'border-gray-100'
            }`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                ✨ 新增AI生成内容
              </h3>
              <button
                onClick={() => setShowUploadForm(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                ✕
              </button>
            </div>

            {/* 表单内容 */}
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* 标题 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  标题 *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="输入标题"
                />
              </div>

              {/* 描述 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  描述 *
                </label>
                <textarea
                  required
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  rows={3}
                  placeholder="输入描述"
                />
              </div>

              {/* 类型 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  类型 *
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as 'html' | 'image' })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="html">HTML网页</option>
                  <option value="image">图片</option>
                </select>
              </div>

              {/* 分类 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  分类 *
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  {categories.filter(c => c !== '全部').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* 图标 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  图标 (emoji)
                </label>
                <input
                  type="text"
                  value={uploadForm.icon}
                  onChange={(e) => setUploadForm({ ...uploadForm, icon: e.target.value })}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="✨"
                  maxLength={2}
                />
              </div>

              {/* 文件上传 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {uploadForm.type === 'html' ? 'HTML文件 *' : '图片文件 *'}
                </label>
                <input
                  type="file"
                  accept={uploadForm.type === 'html' ? '.html,.htm' : 'image/*'}
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {uploadForm.type === 'html' ? '支持 .html 文件' : '支持常见图片格式'}
                </p>
              </div>

              {/* 封面上传 */}
              <div>
                <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  封面图片
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadedCover(e.target.files?.[0] || null)}
                  className={`w-full px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/5 border-white/10 text-white' 
                      : 'bg-white border-gray-200 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  不上传则使用默认封面
                </p>
              </div>

              {/* 提交按钮 */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '上传中...' : '确认上传'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 预览弹窗 */}
      {previewItem && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewItem(null)} />
          <div className={`relative w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl ${
            isDark ? 'bg-[#1a1a2e]' : 'bg-white'
          }`}>
            {/* 弹窗头部 */}
            <div className={`flex items-center justify-between p-4 border-b ${
              isDark ? 'border-white/10' : 'border-gray-100'
            }`}>
              <div>
                <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {previewItem.icon} {previewItem.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {previewItem.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {previewItem.type === 'html' && (
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm hover:scale-105 transition-transform"
                  >
                    新窗口打开
                  </a>
                )}
                <button
                  onClick={() => setPreviewItem(null)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="h-[calc(90vh-80px)] overflow-auto">
              {previewItem.type === 'image' ? (
                <div className="flex items-center justify-center h-full p-4 bg-gray-900">
                  <img 
                    src={previewItem.url} 
                    alt={previewItem.title} 
                    className="max-w-full max-h-full object-contain rounded-lg" 
                  />
                </div>
              ) : (
                <iframe
                  src={previewItem.url}
                  className="w-full h-full border-0"
                  title={previewItem.title}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* 页脚 */}
      <footer className={`text-center py-8 mt-8 border-t transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27] border-white/10 text-gray-500' : 'bg-white border-purple-100 text-gray-500'
      }`}>
        <p>Made with <span className="text-red-400">♥</span> by AI & 桃小淘</p>
      </footer>
    </main>
  );
}
