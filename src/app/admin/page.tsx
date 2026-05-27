/**
 * 管理后台页面
 * 用于发布文章、管理内容
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  { value: '微情书', label: '💌 微情书 - 写给TA的情书' },
  { value: '爱情故事', label: '💕 爱情故事 - 我们的故事' },
  { value: '恋爱攻略', label: '💡 恋爱攻略 - 恋爱技巧' },
  { value: '情感问答', label: '❓ 情感问答 - 答疑解惑' },
];

export default function AdminPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    categoryName: '微情书',
    excerpt: '',
    content: '',
    coverImage: '/images/story-default.jpg',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      // 将内容按段落分割
      const contentArray = formData.content
        .split('\n')
        .filter(p => p.trim() !== '');

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorId': 'admin', // 使用管理员ID
        },
        body: JSON.stringify({
          ...formData,
          content: contentArray,
        }),
      });

      if (res.ok) {
        setMessage('✅ 文章发布成功！');
        setFormData({
          title: '',
          categoryName: '微情书',
          excerpt: '',
          content: '',
          coverImage: '/images/story-default.jpg',
        });
        // 3秒后跳转到首页
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        const error = await res.json();
        setMessage(`❌ 发布失败: ${error.error || '未知错误'}`);
      }
    } catch (error) {
      setMessage('❌ 网络错误，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff5f7] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 text-gray-500 hover:text-pink-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首页
        </button>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">✨ 发布新文章</h1>
          <p className="text-gray-500">写下你的心意，记录每一份感动</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {/* 文章标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章标题 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="例如：写给亲爱的你"
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              required
            />
          </div>

          {/* 选择分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章分类 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* 文章摘要 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章摘要
            </label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="简短描述文章内容，会显示在列表页..."
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            />
          </div>

          {/* 封面图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              封面图片
            </label>
            <div className="flex gap-2 flex-wrap">
              {['/images/story-default.jpg', '/images/story-love-1.jpg', '/images/story-guide-1.jpg', '/images/story-letter-1.jpg'].map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setFormData({ ...formData, coverImage: img })}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    formData.coverImage === img ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 文章内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              文章内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="在这里写下你的故事...

每段文字请用空行分隔。

例如：
亲爱的，

今天是我们相识的第100天...

我想对你说..."
              rows={12}
              className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none"
              required
            />
            <p className="text-xs text-gray-400 mt-2">
              💡 提示：用空行分隔段落，每段会自动排版
            </p>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-pink-400 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                发布中...
              </span>
            ) : (
              '🚀 发布文章'
            )}
          </button>

          {/* 提示信息 */}
          {message && (
            <div className={`p-4 rounded-xl text-center ${message.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
