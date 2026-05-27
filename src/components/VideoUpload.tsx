'use client';

import { useState, useRef } from 'react';
import { saveVideo, readFileAsDataURL, formatFileSize, type StoredVideo } from '@/lib/videoStorage';

interface VideoUploadProps {
  onUploaded: (video: StoredVideo) => void;
}

export default function VideoUpload({ onUploaded }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFileRef = useRef<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 处理文件选择
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('video/')) {
      alert('请选择视频文件');
      return;
    }

    // 检查文件大小（最大100MB）
    if (file.size > 100 * 1024 * 1024) {
      alert('视频大小不能超过100MB');
      return;
    }

    pendingFileRef.current = file;
    
    // 创建预览URL并获取时长
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // 获取视频时长
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setDuration(video.duration);
    };
    video.src = url;
    
    setShowInput(true);
  };

  // 确认上传
  const handleConfirm = async () => {
    const file = pendingFileRef.current;
    if (!file) return;

    setIsUploading(true);
    try {
      // 读取为 DataURL
      const dataUrl = await readFileAsDataURL(file);
      
      // 生成视频数据
      const video: StoredVideo = {
        id: `video-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        dataUrl,
        title: title || `视频 · ${new Date().toLocaleDateString('zh-CN')}`,
        date: new Date().toISOString().split('T')[0],
        category: '视频',
        createdAt: Date.now(),
        size: file.size,
        duration: duration || 0,
      };

      // 保存到 IndexedDB
      await saveVideo(video);
      onUploaded(video);

      // 重置状态
      setTitle('');
      setShowInput(false);
      setPreviewUrl(null);
      setDuration(0);
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
    setPreviewUrl(null);
    setDuration(0);
    pendingFileRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      {/* 上传按钮 - 与照片同大小 */}
      <button
        id="video-upload-btn"
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0 w-full aspect-square rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-pink-400 dark:hover:border-pink-500 bg-gray-50 dark:bg-gray-800/30 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-all duration-200 flex items-center justify-center cursor-pointer group"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-300 group-hover:text-pink-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
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
            className="bg-white dark:bg-[#1e1a2e] rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              🎬 上传视频
            </h3>

            {/* 预览 */}
            {previewUrl && (
              <div className="mb-4 rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  src={previewUrl}
                  className="w-full h-48 object-contain"
                  controls
                />
              </div>
            )}

            {/* 文件信息 */}
            {pendingFileRef.current && (
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                <p>大小: {formatFileSize(pendingFileRef.current.size)}</p>
                {duration > 0 && (
                  <p>时长: {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</p>
                )}
              </div>
            )}

            {/* 标题输入 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入视频标题（可选）"
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
