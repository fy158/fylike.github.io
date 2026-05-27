/**
 * AI 地图助手页面
 * 嵌入 AI 地图助手应用
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import MouseFollower from '@/components/MouseFollower';

export default function AIMapPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  return (
    <main className={`min-h-screen ${isDark ? 'bg-[#0a0e27]' : 'bg-gray-50'}`}>
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />

      {/* 顶部导航 */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27]/80 border-white/10' : 'bg-white/80 border-purple-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/ai-generated" className={`flex items-center gap-2 transition-colors ${
            isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回 AI 创意工坊</span>
          </Link>
          <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            🤖 AI 地图助手
          </h1>
          <div className="w-24" />
        </div>
      </header>

      {/* AI 地图 iframe */}
      <div className="h-[calc(100vh-64px)]">
        <iframe
          src="/ai-map/index.html"
          className="w-full h-full border-0"
          title="AI 地图助手"
          allow="geolocation"
        />
      </div>
    </main>
  );
}
