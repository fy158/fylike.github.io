'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';

const START_DATE = new Date('2025-04-27T00:00:00');

interface TimeDiff {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

function calcTimeDiff(): TimeDiff {
  const now = new Date();
  const diffMs = now.getTime() - START_DATE.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let years = now.getFullYear() - START_DATE.getFullYear();
  let months = now.getMonth() - START_DATE.getMonth();
  let days = now.getDate() - START_DATE.getDate();
  let hours = now.getHours() - START_DATE.getHours();
  let minutes = now.getMinutes() - START_DATE.getMinutes();
  let seconds = now.getSeconds() - START_DATE.getSeconds();

  if (seconds < 0) { seconds += 60; minutes--; }
  if (minutes < 0) { minutes += 60; hours--; }
  if (hours < 0) { hours += 24; days--; }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) { months += 12; years--; }

  return { years, months, days, hours, minutes, seconds, totalDays };
}

export default function LovePage() {
  const [timeDiff, setTimeDiff] = useState<TimeDiff>({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0, totalDays: 0 });
  const [isDark, setIsDark] = useState(false);
  const [stats, setStats] = useState({ moments: 0, photos: 0, blessings: 0 });

  useEffect(() => {
    setTimeDiff(calcTimeDiff());
    const timer = setInterval(() => setTimeDiff(calcTimeDiff()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 获取统计数据
  useEffect(() => {
    async function fetchStats() {
      try {
        // 获取站点统计（文章数、祝福数）
        const statsRes = await fetch('/api/stats');
        const statsData = await statsRes.json();
        const moments = statsData.articles || 0;
        const blessings = statsData.blessings || 0;

        // 获取照片数量
        const photosRes = await fetch('/api/photos');
        const photosData = await photosRes.json();
        const photos = Array.isArray(photosData) ? photosData.length : 0;

        setStats({ moments, photos, blessings });
      } catch (error) {
        console.error('获取统计数据失败:', error);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const timeUnits = [
    { label: '年', value: timeDiff.years },
    { label: '月', value: timeDiff.months },
    { label: '日', value: timeDiff.days },
    { label: '时', value: timeDiff.hours },
    { label: '分', value: timeDiff.minutes },
    { label: '秒', value: timeDiff.seconds },
  ];

  return (
    <main className="min-h-screen overflow-hidden transition-colors duration-1000">
      <SakuraPetals />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />

      <style>{`
        @keyframes heartbeat-3d {
          0%, 100% { transform: perspective(200px) scale(1) rotateY(0deg); }
          8% { transform: perspective(200px) scale(1.25) rotateY(-5deg) rotateX(3deg); }
          16% { transform: perspective(200px) scale(1.05) rotateY(5deg) rotateX(-2deg); }
          24% { transform: perspective(200px) scale(1.3) rotateY(-3deg) rotateX(5deg); }
          32% { transform: perspective(200px) scale(1.0) rotateY(0deg) rotateX(0deg); }
          40% { transform: perspective(200px) scale(1.15) rotateY(4deg) rotateX(-3deg); }
          48% { transform: perspective(200px) scale(1.0) rotateY(0deg) rotateX(0deg); }
        }

        @keyframes heart-glow-3d {
          0%, 100% { filter: drop-shadow(0 0 6px rgba(255, 60, 80, 0.5)) drop-shadow(0 2px 4px rgba(200, 30, 60, 0.3)); }
          24% { filter: drop-shadow(0 0 25px rgba(255, 40, 60, 0.9)) drop-shadow(0 4px 8px rgba(200, 30, 60, 0.5)); }
          48% { filter: drop-shadow(0 0 15px rgba(255, 60, 80, 0.7)) drop-shadow(0 3px 6px rgba(200, 30, 60, 0.4)); }
        }

        @keyframes heart-shadow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          24% { transform: scale(1.3); opacity: 0.1; }
          48% { transform: scale(1.15); opacity: 0.2; }
        }

        @keyframes pulse-ring-1 {
          0% { transform: scale(0.6); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes pulse-ring-2 {
          0% { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(2.0); opacity: 0; }
        }

        @keyframes wave-1 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes wave-2 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes wave-3 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes moon-glow {
          0%, 100% { box-shadow: 0 0 60px 30px rgba(255, 249, 196, 0.4), 0 0 100px 50px rgba(255, 249, 196, 0.2); }
          50% { box-shadow: 0 0 80px 40px rgba(255, 249, 196, 0.5), 0 0 120px 60px rgba(255, 249, 196, 0.25); }
        }

        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes dash-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* 流星动画 - 从左下往右上飞，模拟真实流星 */
        @keyframes meteor-1 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-45deg) scale(0.3); 
            opacity: 0;
          }
          8% { 
            opacity: 1;
            transform: translateX(30px) translateY(-30px) rotate(-45deg) scale(1);
          }
          85% { 
            opacity: 0.8;
            transform: translateX(280px) translateY(-280px) rotate(-45deg) scale(0.7);
          }
          100% { 
            transform: translateX(350px) translateY(-350px) rotate(-45deg) scale(0.2); 
            opacity: 0; 
          }
        }
        @keyframes meteor-2 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-40deg) scale(0.3); 
            opacity: 0; 
          }
          6% { 
            opacity: 1;
            transform: translateX(25px) translateY(-30px) rotate(-40deg) scale(1);
          }
          88% { 
            opacity: 0.7;
            transform: translateX(250px) translateY(-300px) rotate(-40deg) scale(0.6);
          }
          100% { 
            transform: translateX(300px) translateY(-360px) rotate(-40deg) scale(0.2); 
            opacity: 0; 
          }
        }
        @keyframes meteor-3 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-50deg) scale(0.3); 
            opacity: 0; 
          }
          7% { 
            opacity: 1;
            transform: translateX(35px) translateY(-28px) rotate(-50deg) scale(1);
          }
          86% { 
            opacity: 0.8;
            transform: translateX(320px) translateY(-270px) rotate(-50deg) scale(0.65);
          }
          100% { 
            transform: translateX(380px) translateY(-320px) rotate(-50deg) scale(0.2); 
            opacity: 0; 
          }
        }
        @keyframes meteor-4 {
          0% { 
            transform: translateX(0) translateY(0) rotate(-35deg) scale(0.3); 
            opacity: 0; 
          }
          5% { 
            opacity: 1;
            transform: translateX(20px) translateY(-28px) rotate(-35deg) scale(1);
          }
          90% { 
            opacity: 0.7;
            transform: translateX(200px) translateY(-280px) rotate(-35deg) scale(0.7);
          }
          100% { 
            transform: translateX(240px) translateY(-340px) rotate(-35deg) scale(0.2); 
            opacity: 0; 
          }
        }

        /* 思念闪光动画 */
        @keyframes miss-sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }

        /* 头像平面旋转 - 更丝滑的缓动曲线 */
        @keyframes avatar-spin-2d {
          0% { 
            transform: rotate(0deg) scale(1); 
          }
          50% {
            transform: rotate(180deg) scale(1.05); 
          }
          100% { 
            transform: rotate(360deg) scale(1); 
          }
        }

        /* 头像悬停时平滑旋转 - 使用更丝滑的贝塞尔曲线 */
        .avatar-spin {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        }
        .avatar-spin:hover {
          animation: avatar-spin-2d 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          box-shadow: 0 0 30px 10px rgba(255, 107, 157, 0.3);
        }
        .heart-3d { animation: heartbeat-3d 1.4s ease-in-out infinite; }
        .heart-glow-3d { animation: heart-glow-3d 1.4s ease-in-out infinite; }
        .heart-shadow { animation: heart-shadow 1.4s ease-in-out infinite; }
        .pulse-ring-1 { animation: pulse-ring-1 1.8s ease-out infinite; }
        .pulse-ring-2 { animation: pulse-ring-2 1.8s ease-out 0.4s infinite; }
        .wave-1 { animation: wave-1 7s linear infinite; }
        .wave-2 { animation: wave-2 11s linear infinite; }
        .wave-3 { animation: wave-3 15s linear infinite; }
        .twinkle { animation: twinkle 3s ease-in-out infinite; }
        .moon-glow { animation: moon-glow 4s ease-in-out infinite; }
        .float-gentle { animation: float-gentle 5s ease-in-out infinite; }
        .dash-rotate { animation: dash-rotate 10s linear infinite; }
        .meteor-1 { animation: meteor-1 3s linear infinite; }
        .meteor-2 { animation: meteor-2 4s linear infinite 1s; }
        .meteor-3 { animation: meteor-3 3.5s linear infinite 2s; }
        .meteor-4 { animation: meteor-4 5s linear infinite 0.5s; }
        .miss-sparkle { animation: miss-sparkle 3s ease-in-out infinite; }
      `}</style>

      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* 白天背景 */}
        {!isDark && (
          <div className="absolute inset-0 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-b from-[#ffe4e1] via-[#fff0f5] to-[#e6f3ff]" />
            <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-gradient-radial from-amber-200/50 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] bg-gradient-radial from-pink-200/60 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-[20%] left-[30%] w-[600px] h-[600px] bg-gradient-radial from-purple-100/50 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-[50%] right-[25%] w-[350px] h-[350px] bg-gradient-radial from-rose-100/60 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-0 right-[20%] w-[300px] h-[600px] bg-gradient-to-b from-amber-100/40 via-amber-50/15 to-transparent rotate-12 blur-2xl" />
            {/* 漂浮装饰元素 - 使用CSS绘制花朵代替emoji */}
            <div className="absolute top-[15%] left-[8%] opacity-40 float-gentle" style={{ animationDelay: '0s' }}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 shadow-sm" />
            </div>
            <div className="absolute top-[25%] right-[12%] opacity-35 float-gentle" style={{ animationDelay: '1s' }}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-300 to-pink-400 shadow-sm" />
            </div>
            <div className="absolute top-[60%] left-[5%] opacity-30 float-gentle" style={{ animationDelay: '2s' }}>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-300 to-orange-300 shadow-sm" />
            </div>
            <div className="absolute top-[70%] right-[8%] opacity-35 float-gentle" style={{ animationDelay: '0.5s' }}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 shadow-sm" />
            </div>
            <div className="absolute top-[40%] left-[80%] opacity-25 float-gentle" style={{ animationDelay: '1.5s' }}>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-300 to-pink-400 shadow-sm" />
            </div>
          </div>
        )}

        {/* 夜晚背景 */}
        {isDark && (
          <div className="absolute inset-0 transition-opacity duration-1000">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050714] via-[#0a0e27] to-[#0d1b2a]" />
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[300px] bg-gradient-radial from-indigo-600/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] bg-gradient-radial from-purple-600/15 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-[30%] left-[20%] w-[600px] h-[300px] bg-gradient-radial from-blue-600/15 to-transparent rounded-full blur-3xl" />
          </div>
        )}

        {/* 内容区域 */}
        <div className="relative z-10 flex flex-col items-center px-4 w-full max-w-4xl mx-auto pt-16 pb-24">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-12 tracking-wider transition-all duration-1000 ${
            isDark
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500'
          }`}>
            恋爱纪念
          </h1>

          {/* 双人头像 + 3D爱心 */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-14 mb-8 sm:mb-10 float-gentle">
            {/* 左侧头像 - 桃子 - 平面旋转 */}
            <div className="relative flex flex-col items-center flex-shrink-0">
              <div className={`avatar-spin w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 transition-all duration-700 cursor-pointer ${
                isDark ? 'border-pink-400/60 shadow-2xl shadow-pink-500/30' : 'border-pink-300/80 shadow-2xl shadow-pink-300/50'
              }`}>
                <img src="/images/avatar-taozi.jpg" alt="桃子" className="w-full h-full object-cover" />
              </div>
              <span className={`mt-3 text-lg sm:text-xl font-medium tracking-wider transition-colors duration-700 ${
                isDark ? 'text-pink-300' : 'text-pink-500'
              }`}>桃子</span>
            </div>

            {/* 中间 3D 立体爱心 */}
            <div className="relative flex-shrink-0 w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-red-400/30 pulse-ring-1" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-pink-400/20 pulse-ring-2" />
              </div>
              <svg className="absolute inset-0 w-full h-full dash-rotate" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" strokeDasharray="8 6" strokeLinecap="round" />
              </svg>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-4 sm:w-14 sm:h-5 bg-red-900/20 rounded-full blur-md heart-shadow" />
              <div className="relative heart-3d heart-glow-3d" style={{ transformStyle: 'preserve-3d' }}>
                <svg className="w-16 h-16 sm:w-20 sm:h-20 relative z-10" viewBox="0 0 24 24" style={{ transformStyle: 'preserve-3d' }}>
                  <defs>
                    <radialGradient id="heart3d" cx="40%" cy="35%" r="60%">
                      <stop offset="0%" stopColor="#ff6b8a" />
                      <stop offset="40%" stopColor="#e63946" />
                      <stop offset="80%" stopColor="#c9184a" />
                      <stop offset="100%" stopColor="#a4133c" />
                    </radialGradient>
                    <radialGradient id="heartHighlight" cx="35%" cy="30%" r="30%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </radialGradient>
                    <linearGradient id="heartShadow" x1="0%" y1="60%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgba(0,0,0,0)" />
                      <stop offset="100%" stopColor="rgba(100,0,20,0.3)" />
                    </linearGradient>
                  </defs>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartShadow)" transform="translate(0, 1)" />
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heart3d)" />
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#heartHighlight)" />
                </svg>
              </div>
            </div>

            {/* 右侧头像 - 茶杯狐 - 平面旋转 */}
            <div className="relative flex flex-col items-center flex-shrink-0">
              <div className={`avatar-spin w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 transition-all duration-700 cursor-pointer ${
                isDark ? 'border-teal-400/60 shadow-2xl shadow-teal-500/30' : 'border-teal-300/80 shadow-2xl shadow-teal-300/50'
              }`}>
                <img src="/images/avatar-chabei.jpg" alt="茶杯狐" className="w-full h-full object-cover" />
              </div>
              <span className={`mt-3 text-lg sm:text-xl font-medium tracking-wider transition-colors duration-700 ${
                isDark ? 'text-teal-300' : 'text-teal-500'
              }`}>茶杯狐</span>
            </div>
          </div>

          {/* 相遇日期 */}
          <div className="text-center mb-6 sm:mb-8">
            <p className={`text-base sm:text-lg transition-colors duration-700 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              从 <span className={`font-semibold transition-colors duration-700 ${isDark ? 'text-indigo-300' : 'text-pink-500'}`}>2025年4月27日</span> 相遇
            </p>
            <p className={`mt-2 text-2xl sm:text-3xl font-bold transition-all duration-700 ${
              isDark ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300' : 'text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500'
            }`}>
              已相伴 {timeDiff.totalDays} 天
            </p>
          </div>

          {/* 计时器 */}
          <div className="text-center w-full">
            <h2 className={`text-lg sm:text-xl md:text-2xl font-light mb-6 sm:mb-8 tracking-widest transition-colors duration-700 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              这是我们一起走过的时光
            </h2>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className={`flex flex-col items-center rounded-2xl px-4 py-3 sm:px-6 sm:py-4 min-w-[60px] sm:min-w-[80px] border backdrop-blur-md shadow-lg transition-all duration-700 ${
                    isDark ? 'bg-white/5 border-indigo-500/20 shadow-indigo-500/10' : 'bg-white/80 border-pink-200/50 shadow-pink-200/30'
                  }`}
                >
                  <span className={`text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums transition-all duration-700 ${
                    isDark ? 'text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-300' : 'text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-500'
                  }`}>
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className={`text-sm sm:text-base mt-1 tracking-wider transition-colors duration-700 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{unit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 向下滚动提示 - 移动端显示 */}
          <div className="sm:hidden mt-8 animate-bounce">
            <svg className={`w-6 h-6 transition-colors duration-700 ${isDark ? 'text-indigo-400/60' : 'text-pink-400/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* 高波浪分隔线 */}
        <div className="absolute bottom-0 left-0 w-full h-40 sm:h-52 md:h-60 overflow-hidden">
          <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-3" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0,100 C180,140 360,60 540,100 C720,140 900,60 1080,100 C1260,140 1350,80 1440,100 L1440,200 L0,200 Z" className={isDark ? 'fill-[#1a1040]/60' : 'fill-[#fce4ec]/60'} />
          </svg>
          <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-2" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ animationDelay: '-3s' }}>
            <path d="M0,120 C240,60 480,160 720,100 C960,40 1200,160 1440,120 L1440,200 L0,200 Z" className={isDark ? 'fill-[#1a1040]/80' : 'fill-[#f8bbd0]/50'} />
          </svg>
          <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-1" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ animationDelay: '-1s' }}>
            <path d="M0,140 C360,180 720,100 1080,140 C1260,160 1350,120 1440,140 L1440,200 L0,200 Z" className={isDark ? 'fill-[#0d1b2a]' : 'fill-[#fff5f7]'} />
          </svg>
        </div>
      </section>

      {/* 功能卡片区域 */}
      <section className={`relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 transition-colors duration-1000 ${isDark ? 'bg-[#0d1b2a]' : 'bg-[#fff5f7]'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* 卡片1: 点点滴滴 */}
          <Link href="/love/moments" className="group block">
            <div className={`relative h-full min-h-[200px] rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 hover:-rotate-1 ${
              isDark 
                ? 'bg-gradient-to-br from-amber-900/40 to-orange-900/30 border-2 border-amber-700/30' 
                : 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200'
            }`}>
              <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                isDark ? 'bg-amber-600/80' : 'bg-amber-400'
              }`}>
                {/* 太阳/爱心混合图标 */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" fill={isDark ? '#fcd34d' : '#f59e0b'} />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" stroke={isDark ? '#fcd34d' : '#f59e0b'} strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${isDark ? 'text-amber-200' : 'text-amber-700'}`}>
                  点点滴滴
                </h3>
                <div className={`w-12 h-1 rounded-full mb-4 ${isDark ? 'bg-amber-500/50' : 'bg-amber-400'}`} />
                <p className={`text-sm leading-relaxed ${isDark ? 'text-amber-100/70' : 'text-amber-800/70'}`}>
                  记录我们生活中的每一个温暖瞬间，那些平凡却闪光的日常
                </p>
                <div className={`mt-4 text-xs ${isDark ? 'text-amber-300/50' : 'text-amber-600/60'}`}>
                  共收录 {stats.moments} 个美好时刻
                </div>
              </div>
            </div>
          </Link>

          {/* 卡片2: 时光相册 */}
          <Link href="/album" className="group block">
            <div className={`relative h-full min-h-[200px] rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 hover:rotate-1 ${
              isDark 
                ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/30 border-2 border-purple-700/30' 
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200'
            }`}>
              <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                isDark ? 'bg-purple-600/80' : 'bg-purple-400'
              }`}>
                {/* 相机图标 */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" fill={isDark ? '#c084fc' : '#9333ea'} />
                  <circle cx="12" cy="12" r="4" fill={isDark ? '#fcd34d' : '#f59e0b'} />
                  <circle cx="12" cy="12" r="2" fill={isDark ? '#1a1a2e' : '#fff'} />
                  <path d="M8 5V4a1 1 0 011-1h6a1 1 0 011 1v1" stroke={isDark ? '#e9d5ff' : '#c084fc'} strokeWidth="2" />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                  时光相册
                </h3>
                <div className={`w-12 h-1 rounded-full mb-4 ${isDark ? 'bg-purple-500/50' : 'bg-purple-400'}`} />
                <p className={`text-sm leading-relaxed ${isDark ? 'text-purple-100/70' : 'text-purple-800/70'}`}>
                  用照片定格属于我们的美好回忆，每一帧都是爱的见证
                </p>
                <div className={`mt-4 text-xs ${isDark ? 'text-purple-300/50' : 'text-purple-600/60'}`}>
                  共珍藏 {stats.photos} 张珍贵照片
                </div>
              </div>
            </div>
          </Link>

          {/* 卡片3: 祝福板 */}
          <Link href="/blessing" className="group block">
            <div className={`relative h-full min-h-[200px] rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:scale-105 hover:-rotate-1 ${
              isDark 
                ? 'bg-gradient-to-br from-rose-900/40 to-red-900/30 border-2 border-rose-700/30' 
                : 'bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-200'
            }`}>
              <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                isDark ? 'bg-rose-600/80' : 'bg-rose-400'
              }`}>
                {/* 爱心信笺图标 */}
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" fill={isDark ? '#fb7185' : '#f43f5e'} />
                  <path d="M4 4l8 6 8-6" fill={isDark ? '#fda4af' : '#fb7185'} />
                  <path d="M12 10c-1.5 1-3 2.5-3 4 0 1.5 1 2 2 2s2-.5 2-2c0-1.5-1.5-3-3-4z" fill={isDark ? '#fff' : '#fff'} />
                </svg>
              </div>
              <div className="mt-4">
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>
                  祝福板
                </h3>
                <div className={`w-12 h-1 rounded-full mb-4 ${isDark ? 'bg-rose-500/50' : 'bg-rose-400'}`} />
                <p className={`text-sm leading-relaxed ${isDark ? 'text-rose-100/70' : 'text-rose-800/70'}`}>
                  收集来自朋友们的满满祝福与爱意，让温暖传递给每一个人
                </p>
                <div className={`mt-4 text-xs ${isDark ? 'text-rose-300/50' : 'text-rose-600/60'}`}>
                  共收到 {stats.blessings} 份真挚祝福
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 底部波浪 */}
      <div className={`relative w-full h-32 sm:h-44 md:h-52 overflow-hidden transition-colors duration-1000 ${isDark ? 'bg-[#0d1b2a]' : 'bg-[#fff5f7]'}`}>
        <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-2" viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ animationDelay: '-2s' }}>
          <path d="M0,80 C360,140 720,20 1080,80 C1260,110 1350,50 1440,80 L1440,200 L0,200 Z" className={isDark ? 'fill-[#1a1040]/70' : 'fill-[#f8bbd0]/40'} />
        </svg>
        <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-1" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,120 C240,60 480,160 720,100 C960,40 1200,140 1440,120 L1440,200 L0,200 Z" className={isDark ? 'fill-[#0a0e27]' : 'fill-[#ffe4ec]'} />
        </svg>
      </div>

      {/* Footer */}
      <footer className={`text-center py-8 px-4 transition-colors duration-1000 ${isDark ? 'bg-[#0a0e27]' : 'bg-[#ffe4ec]'}`}>
        {/* 返回首页按钮 */}
        <Link
          href="/"
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
            isDark
              ? 'bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.6)]'
              : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_4px_20px_rgba(244,63,94,0.3)] hover:shadow-[0_4px_30px_rgba(244,63,94,0.5)]'
          }`}
        >
          {/* 房屋图标 */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          <span>返回首页</span>
        </Link>

        <p className={`text-sm mt-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          Made with <span className="text-red-400">♥</span> for 桃子 & 茶杯狐
        </p>
      </footer>
    </main>
  );
}
