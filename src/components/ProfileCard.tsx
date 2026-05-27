/**
 * 个人中心卡片组件 - 升级版
 * 黑胶唱片头像 + 热门标签 + 统计数据 + 滚动sticky效果
 * 比部署版内容更丰富，动态效果更丝滑
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { bloggerInfo } from '@/data/content';

interface Stats {
  articles: number;
  views: number;
  wishes: number;
  blessings: number;
}

const hotTags = ['初恋', '异地恋', '表白', '约会', '纪念日', '分手挽回'];

export default function ProfileCard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('获取统计失败:', error);
      }
    };
    fetchStats();
  }, []);

  // 入场动画 + sticky 检测
  useEffect(() => {
    // 入场动画
    const timer = setTimeout(() => setIsVisible(true), 300);

    // sticky 状态检测
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    observer.observe(sentinel);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* 哨兵元素 - 用于检测sticky状态 */}
      <div ref={sentinelRef} className="h-0" />

      <div
        ref={cardRef}
        className={`
          transition-all duration-500 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          ${isStuck ? 'shadow-2xl scale-[0.98]' : 'shadow-lg'}
        `}
        style={{
          position: 'sticky',
          top: '96px',
          zIndex: 10,
        }}
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl overflow-hidden relative border border-pink-100/50">
          {/* 顶部装饰渐变条 */}
          <div className="h-1 bg-gradient-to-r from-pink-300 via-rose-400 to-pink-300" />

          {/* 内容区域 */}
          <div className="relative p-6 text-center">
            {/* 头像 - 黑胶唱片效果 */}
            <div className="relative inline-block mb-4">
              {/* 头像光晕 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300/40 to-rose-400/40 blur-xl scale-125" />
              <div className="vinyl-avatar mx-auto relative">
                <Image
                  src={bloggerInfo.avatar}
                  alt={bloggerInfo.name}
                  width={84}
                  height={84}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 在线状态指示器 */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full pulse-glow" />
            </div>

            {/* 博客名称 */}
            <h3 className="text-xl font-bold text-gray-800 mb-1">{bloggerInfo.name}</h3>

            {/* 签名 */}
            <p className="text-sm text-gray-400 mb-5 italic">&ldquo;{bloggerInfo.signature}&rdquo;</p>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-pink-100/80">
              <div className="text-center group cursor-default">
                <div className="text-xl font-bold text-pink-500 group-hover:scale-110 transition-transform">
                  {stats ? stats.articles : 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">文章</div>
              </div>
              <div className="text-center border-x border-pink-100/80 group cursor-default">
                <div className="text-xl font-bold text-pink-500 group-hover:scale-110 transition-transform">
                  {stats ? (stats.wishes + stats.blessings) : 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">互动</div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-xl font-bold text-pink-500 group-hover:scale-110 transition-transform">
                  {stats
                    ? stats.views >= 10000
                      ? `${(stats.views / 10000).toFixed(1)}w`
                      : stats.views >= 1000
                        ? `${(stats.views / 1000).toFixed(1)}k`
                        : stats.views
                    : `0`
                  }
                </div>
                <div className="text-xs text-gray-400 mt-1">访问量</div>
              </div>
            </div>

            {/* 热门标签 */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold text-gray-500 mb-3 flex items-center justify-center gap-1">
                <svg className="w-3.5 h-3.5 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                热门标签
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {hotTags.map((tag, i) => (
                  <span
                    key={tag}
                    className="tag cursor-default"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
