/**
 * 快速发布弹窗组件
 * 用于在各板块直接发布内容
 */

'use client';

import { useState, useRef } from 'react';

interface QuickPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  categoryLabel: string;
  onSuccess: () => void;
}

const coverImages = [
  '/images/story-default.jpg',
  '/images/story-love-1.jpg',
  '/images/story-guide-1.jpg',
  '/images/story-letter-1.jpg',
];

export default function QuickPostModal({ isOpen, onClose, category, categoryLabel, onSuccess }: QuickPostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: coverImages[0],
  });
  const [customPreview, setCustomPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        setMessage('❌ 请选择图片文件');
        return;
      }
      // 检查文件大小 (最大 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('❌ 图片大小不能超过 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomPreview(base64);
        setFormData({ ...formData, coverImage: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const contentArray = formData.content
        .split('\n')
        .filter(p => p.trim() !== '');

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          categoryName: category,
          excerpt: formData.excerpt,
          content: contentArray,
          coverImage: formData.coverImage,
          authorId: 'admin', // 放到 body 中
        }),
      });

      if (res.ok) {
        setMessage('✅ 发布成功！');
        setTimeout(() => {
          onSuccess();
          onClose();
          setFormData({ title: '', excerpt: '', content: '', coverImage: coverImages[0] });
          setCustomPreview(null);
          setMessage('');
        }, 1500);
      } else {
        const _error = await res.json();
        setMessage(`❌ ${_error.error || '发布失败'}`);
      }
    } catch (_error) {
      setMessage('❌ 网络错误');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* 弹窗 */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            ✨ 写{categoryLabel}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={`给你的${categoryLabel}起个标题...`}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
              required
            />
          </div>

          {/* 摘要 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="简短描述一下..."
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
            />
          </div>

          {/* 封面图 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">封面图</label>
            <div className="flex gap-2 flex-wrap">
              {coverImages.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, coverImage: img });
                    setCustomPreview(null);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    formData.coverImage === img && !customPreview ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {/* 自定义上传按钮 */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-16 h-16 rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 ${
                  customPreview ? 'border-pink-500 ring-2 ring-pink-200 bg-pink-50' : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                }`}
                title="上传自定义封面"
              >
                {customPreview ? (
                  <img src={customPreview} alt="自定义封面" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs text-gray-400">上传</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {customPreview && (
              <p className="text-xs text-pink-600 mt-1">✓ 已选择自定义封面</p>
            )}
          </div>

          {/* 内容 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容 *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={`在这里写下你的${categoryLabel}...\n\n用空行分隔段落`}
              rows={8}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all resize-none"
              required
            />
          </div>

          {/* 提示信息 */}
          {message && (
            <div className={`p-3 rounded-xl text-center text-sm ${message.includes('✅') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          {/* 按钮 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-400 to-rose-500 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSubmitting ? '发布中...' : '🚀 发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
