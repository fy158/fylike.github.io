'use client';

import { useState, useRef } from 'react';
import { uploadPhotoToCloud, type CloudPhoto } from '@/lib/photoStorage';

interface PhotoUploadProps {
  category: string;
  onUploaded: (photo: CloudPhoto) => void;
}

export default function PhotoUpload({ category, onUploaded }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);

  // 处理文件选择
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 检查文件大小（最大20MB）
    if (file.size > 20 * 1024 * 1024) {
      alert('图片大小不能超过20MB');
      return;
    }

    pendingFileRef.current = file;
    setShowInput(true);
  };

  // 确认上传
  const handleConfirm = async () => {
    const file = pendingFileRef.current;
    if (!file) return;

    setIsUploading(true);
    try {
      // 上传到云端
      const photoTitle = title || `${category} · ${new Date().toLocaleDateString('zh-CN')}`;
      const photo = await uploadPhotoToCloud(file, photoTitle, category);
      
      onUploaded(photo);

      // 重置状态
      setTitle('');
      setShowInput(false);
      pendingFileRef.current = null;
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('上传失败:', err);
      alert('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 取消
  const handleCancel = () => {
    setShowInput(false);
    setTitle('');
    pendingFileRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      {/* 上传按钮 - 与照片卡片同大小 */}
      <button
        id="photo-upload-btn"
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0 w-full aspect-square rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-pink-400 dark:hover:border-pink-500 bg-gray-50 dark:bg-gray-800/30 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-all duration-200 flex items-center justify-center cursor-pointer group"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-300 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 标题输入弹窗 */}
      {showInput && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <div
            className="bg-white dark:bg-[#1e1a2e] rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              📷 添加到「{category}」
            </h3>

            {/* 预览 */}
            {pendingFileRef.current && (
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={URL.createObjectURL(pendingFileRef.current)}
                  alt="预览"
                  className="w-full h-40 object-contain"
                />
              </div>
            )}

            {/* 标题输入 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入照片标题（可选）"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-800 transition-all mb-4"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
            />

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                disabled={isUploading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? '上传中...' : '确认上传'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
