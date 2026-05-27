/**
 * Hero 区域组件 - 升级版
 * 全屏展示，包含背景图、标题、打字机效果、搜索框和滚动箭头
 * 底部使用三层柔和波浪效果（比部署版更自然）
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Typewriter from './Typewriter';

const typewriterTexts = [
  '你是我这一生最美丽的相遇',
  '我想和你一起看遍世间所有风景',
  '余生很长，我只想牵你的手',
  '你笑起来的样子，是我见过最美的风景',
  '遇见你之前，我没想过结婚；遇见你之后，我没想过别人',
  '你的名字，是我读过最短的情诗',
  '我想把世界上最好的都给你，却发现世界上最好的就是你',
  '如果爱有形状，那一定是你微笑的样子',
];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 使用百度搜索
      window.location.href = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`;
    }
  };

  const scrollToContent = () => {
    const element = document.getElementById('articles');
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景图 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        {/* 暗色遮罩 - 轻微提亮 */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* 主标题 */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          相信记录的力量
        </h1>

        {/* 打字机副标题 */}
        <div className="h-8 md:h-10 mb-10">
          <Typewriter
            texts={typewriterTexts}
            typingSpeed={80}
            deletingSpeed={40}
            pauseDuration={3000}
            className="text-lg md:text-2xl text-white/90 drop-shadow-md"
          />
        </div>

        {/* 搜索框 */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文章、故事..."
              className="search-input w-full px-6 py-4 pl-14 rounded-full bg-white/95 backdrop-blur-sm text-gray-700 placeholder-gray-400 outline-none shadow-lg"
            />
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-full font-medium hover:from-pink-500 hover:to-pink-700 transition-all shadow-md"
            >
              搜索
            </button>
          </div>
        </form>

        {/* 统计数据 */}
        <div className="flex justify-center gap-8 md:gap-16 text-white">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold drop-shadow-md">500+</div>
            <div className="text-sm text-white/80 mt-1">篇文章</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold drop-shadow-md">10w+</div>
            <div className="text-sm text-white/80 mt-1">读者</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold drop-shadow-md">100w+</div>
            <div className="text-sm text-white/80 mt-1">阅读量</div>
          </div>
        </div>
      </div>

      {/* 升级版三层柔和波浪 - 更自然的起伏 */}
      <div className="wave-container">
        {/* 第一层波浪 - 最淡最慢，最远处，起伏最平缓 */}
        <div className="wave-layer wave-layer-1">
          <svg
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
          >
            <path
              fill="#fff5f7"
              d="M0,140 C80,100 160,180 240,130 C320,80 400,175 480,120 C560,65 640,170 720,115 C800,60 880,175 960,120 C1040,65 1120,170 1200,115 C1280,60 1360,165 1440,128 L1440,260 L0,260 Z"
            />
          </svg>
        </div>
        {/* 第二层波浪 - 中等，起伏稍大 */}
        <div className="wave-layer wave-layer-2">
          <svg
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
          >
            <path
              fill="#fff5f7"
              d="M0,160 C100,110 180,220 300,150 C420,80 500,215 620,140 C740,65 820,210 940,135 C1060,60 1140,205 1260,128 C1340,80 1400,190 1440,145 L1440,260 L0,260 Z"
            />
          </svg>
        </div>
        {/* 第三层波浪 - 最清晰，最近处，起伏最大 */}
        <div className="wave-layer wave-layer-3">
          <svg
            viewBox="0 0 1440 260"
            preserveAspectRatio="none"
          >
            <path
              fill="#fff5f7"
              d="M0,190 C120,140 200,250 360,180 C520,110 600,245 760,175 C920,105 1000,240 1160,170 C1280,120 1380,230 1440,180 L1440,260 L0,260 Z"
            />
          </svg>
        </div>
      </div>

      {/* 向下滚动箭头 */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white transition-colors animate-bounce-arrow"
        aria-label="向下滚动"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </section>
  );
}
