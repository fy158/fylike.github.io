/**
 * 点点滴滴页面
 * 恋爱互动小游戏、心情天气、每日心情标记、情绪记录、恋爱日记、纪念日日历、甜蜜清单、悄悄话信箱
 * 需要密码验证才能进入
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';
import PasswordGate from '@/components/PasswordGate';

// 导入所有功能组件
import LoveGames from '@/components/moments/LoveGames';
import MoodWeather from '@/components/moments/MoodWeather';
import DailyMoodCalendar from '@/components/moments/DailyMoodCalendar';
import EmotionTracker from '@/components/moments/EmotionTracker';
import LoveDiary from '@/components/moments/LoveDiary';
import AnniversaryCalendar from '@/components/moments/AnniversaryCalendar';
import SweetBucketList from '@/components/moments/SweetBucketList';
import SecretMailbox from '@/components/moments/SecretMailbox';

function MomentsContent() {
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
    <main className={`min-h-screen transition-colors duration-1000 ${
      isDark ? 'bg-[#0a0e27]' : 'bg-gradient-to-b from-pink-50 via-rose-50 to-purple-50'
    }`}>
      {/* 全局特效 */}
      <SakuraPetals />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />

      {/* 头部 */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27]/80 border-white/10' : 'bg-white/80 border-pink-100'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/love" className={`flex items-center gap-2 transition-colors ${
            isDark ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-500'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回恋爱纪念</span>
          </Link>
          <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            💕 点点滴滴
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem('moments-unlocked');
              window.location.reload();
            }}
            className={`text-xs px-2 py-1 rounded-lg ${
              isDark ? 'bg-white/10 text-gray-400 hover:bg-white/20' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            退出验证
          </button>
        </div>
      </header>

      {/* 主内容 */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 顶部欢迎区域 */}
        <div className={`text-center mb-8 p-8 rounded-3xl ${
          isDark 
            ? 'bg-gradient-to-r from-pink-900/40 via-purple-900/40 to-rose-900/40' 
            : 'bg-gradient-to-r from-pink-100 via-purple-100 to-rose-100'
        }`}>
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>
            属于我们的小天地
          </h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            记录每一个温暖瞬间，见证我们的爱情故事
          </p>
        </div>

        {/* 功能模块网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左列 */}
          <div className="space-y-6">
            {/* 恋爱互动游戏 */}
            <LoveGames />
            
            {/* 心情天气 */}
            <MoodWeather />
            
            {/* 情绪记录 */}
            <EmotionTracker />
            
            {/* 纪念日日历 */}
            <AnniversaryCalendar />
          </div>

          {/* 右列 */}
          <div className="space-y-6">
            {/* 每日心情标记 */}
            <DailyMoodCalendar />
            
            {/* 恋爱日记 */}
            <LoveDiary />
            
            {/* 甜蜜清单 */}
            <SweetBucketList />
            
            {/* 悄悄话信箱 */}
            <SecretMailbox />
          </div>
        </div>
        {/* 跳转链接区域 */}
        <div className="mt-12 text-center">
          <Link
            href="/love/unfinished-letter"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white text-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 group"
          >
            <span className="text-2xl">💌</span>
            <span>更多惊喜在等着你</span>
            <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 页脚 */}
      <footer className={`text-center py-8 mt-8 border-t transition-colors duration-500 ${
        isDark ? 'bg-[#0a0e27] border-white/10 text-gray-500' : 'bg-white border-pink-100 text-gray-500'
      }`}>
        <p>Made with <span className="text-red-400">♥</span> for 桃子 & 茶杯狐</p>
        <p className="text-sm mt-2">这是属于我们两个人的私密空间 💕</p>
      </footer>
    </main>
  );
}

export default function MomentsPage() {
  return (
    <PasswordGate correctPassword="410313" title="💕 点点滴滴" subtitle="这是属于我们两个人的私密空间">
      <MomentsContent />
    </PasswordGate>
  );
}
