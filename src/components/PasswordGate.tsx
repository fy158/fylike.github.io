/**
 * 密码验证门组件
 * 用于保护私密页面，需要输入正确密码才能进入
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PasswordGateProps {
  correctPassword: string;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PasswordGate({ 
  correctPassword, 
  children, 
  title = '私密空间',
  subtitle = '请输入密码进入'
}: PasswordGateProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查是否已经验证过（使用 sessionStorage）
    const unlocked = sessionStorage.getItem('moments-unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }

    // 监听主题变化
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === correctPassword) {
      setIsUnlocked(true);
      sessionStorage.setItem('moments-unlocked', 'true');
      setError('');
    } else {
      setError('密码错误，请重试');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-1000">
      {/* 背景装饰 */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        isDark 
          ? 'bg-gradient-to-br from-[#0a0e27] via-[#1a1040] to-[#0d1b2a]' 
          : 'bg-gradient-to-br from-pink-100 via-rose-50 to-purple-100'
      }`}>
        {/* 漂浮爱心 */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute animate-float ${isDark ? 'text-pink-500/10' : 'text-pink-300/30'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* 密码输入卡片 */}
      <div className={`relative z-10 w-full max-w-md mx-4 ${isShaking ? 'animate-shake' : ''}`}>
        <div className={`rounded-3xl p-8 shadow-2xl backdrop-blur-xl border-2 transition-all duration-500 ${
          isDark 
            ? 'bg-[#1a1a2e]/90 border-pink-500/30 shadow-pink-500/20' 
            : 'bg-white/90 border-pink-200 shadow-pink-200/50'
        }`}>
          {/* 锁图标 */}
          <div className="flex justify-center mb-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              isDark ? 'bg-pink-600/30' : 'bg-pink-100'
            }`}>
              <svg className={`w-10 h-10 ${isDark ? 'text-pink-400' : 'text-pink-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-14V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v2H7a2 2 0 00-2 2v2h12V6a2 2 0 00-2-2h-2z" />
              </svg>
            </div>
          </div>

          {/* 标题 */}
          <h2 className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>
            {title}
          </h2>
          <p className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {subtitle}
          </p>

          {/* 密码输入表单 */}
          <form onSubmit={handleSubmit}>
            <div className="relative mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className={`w-full px-4 py-3 rounded-xl border-2 text-center text-lg tracking-widest transition-all duration-300 focus:outline-none ${
                  isDark 
                    ? 'bg-[#0d1b2a] border-pink-500/30 text-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20' 
                    : 'bg-white border-pink-200 text-gray-700 focus:border-pink-400 focus:ring-2 focus:ring-pink-200'
                }`}
                autoFocus
              />
              {/* 密码可见性装饰 */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                {[...password].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${isDark ? 'bg-pink-400' : 'bg-pink-500'}`} />
                ))}
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <p className="text-red-500 text-center text-sm mb-4 animate-pulse">
                {error}
              </p>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 ${
                isDark 
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400'
              }`}
            >
              解锁进入
            </button>
          </form>

          {/* 提示 */}
          <p className={`text-center mt-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            💡 这是属于我们两个人的私密空间
          </p>

          {/* 返回首页 */}
          <div className="text-center mt-4">
            <Link
              href="/love"
              className={`inline-flex items-center gap-1 text-sm transition-colors ${
                isDark ? 'text-gray-500 hover:text-pink-400' : 'text-gray-400 hover:text-pink-500'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回恋爱纪念
            </Link>
          </div>

          {/* 测试提示 */}
          <p className={`text-center mt-4 text-xs ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            测试密码: 410313
          </p>
        </div>
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </main>
  );
}
