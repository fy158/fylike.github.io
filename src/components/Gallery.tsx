/**
 * 相册组件
 * 网格展示照片，点击可放大查看
 * 从 API 获取数据
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  title: string;
  src: string;
  date: string;
  category: string;
}

// 默认填充图片
const DEFAULT_PHOTOS: Photo[] = [
  { id: 'default1', title: '白玫瑰的约定', src: '/images/anniversary/ann-01.jpg', date: '纪念日', category: 'default' },
  { id: 'default2', title: '更多美好', src: '/images/anniversary/ann-02.jpg', date: '未来可期', category: 'default' },
  { id: 'default3', title: '甜蜜时光', src: '/images/anniversary/ann-03.jpg', date: '纪念日', category: 'default' },
  { id: 'default4', title: '幸福瞬间', src: '/images/anniversary/ann-04.jpg', date: '纪念日', category: 'default' },
];

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        // 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch('/api/photos', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          setPhotos(data);
        }
      } catch (error) {
        console.error('获取照片失败:', error);
        // 出错时使用默认照片
        setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  // 合并真实照片和默认照片，确保有8张
  const displayPhotos = [...photos, ...DEFAULT_PHOTOS].slice(0, 8);

  if (isLoading) {
    return (
      <section id="gallery" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="gradient-text">甜蜜瞬间</span>
            </h2>
            <p className="text-gray-500">记录我们最美好的瞬间</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div 
                key={i} 
                className={`bg-gray-200 rounded-xl animate-pulse ${
                  i === 1 ? 'md:col-span-2 md:row-span-2 h-48 md:h-[528px]' : 'h-48 md:h-64'
                }`} 
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="gradient-text">甜蜜瞬间</span>
          </h2>
          <p className="text-gray-500">记录我们最美好的瞬间</p>
        </div>

        {/* 照片网格 - 8宫格布局 (4列) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayPhotos.map((photo, index) => {
            // 8宫格布局（4列）：
            // 第1行: [大图(占2x2)] [大图继续] [小图] [小图]
            // 第2行: [大图继续]    [大图继续] [小图] [小图]
            // index 0 是大图(占2行2列)，其他都是小图
            const isLarge = index === 0;
            
            return (
              <div
                key={photo.id}
                className={`
                  relative overflow-hidden rounded-xl cursor-pointer group
                  ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}
                `}
                onClick={() => !photo.id.startsWith('default') && setSelectedPhoto(photo)}
              >
                <div className={`
                  relative overflow-hidden rounded-xl w-full
                  ${isLarge ? 'h-48 md:h-[528px]' : 'h-48 md:h-64'}
                `}>
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* 悬停遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="font-semibold text-lg">{photo.title}</h4>
                      <p className="text-sm text-white/80">{photo.date}</p>
                    </div>
                  </div>
                  {/* 放大图标 */}
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 图片放大模态框 */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-4xl w-full animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 图片容器 */}
              <div className="relative rounded-2xl overflow-hidden bg-black">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    fill
                    className="object-contain"
                  />
                </div>
                {/* 图片信息 */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-semibold text-white mb-1">{selectedPhoto.title}</h3>
                  <p className="text-white/70">{selectedPhoto.date}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
