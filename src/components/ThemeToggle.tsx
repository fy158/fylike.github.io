/**
 * 黑夜白天切换组件
 * 毛玻璃风格，柔和融入页面设计
 */

'use client';

import { useEffect, useCallback, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsAnimating(true);
    const html = document.documentElement;
    const newIsDark = !html.classList.contains('dark');

    if (newIsDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setIsDark(newIsDark);
    setTimeout(() => setIsAnimating(false), 600);
  }, []);

  // SSR 时渲染占位，避免布局偏移
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-[10000] w-11 h-11 rounded-full backdrop-blur-md bg-white/30 border border-white/40 hover:bg-white/50 hover:border-white/60 transition-all duration-500 ease-out flex items-center justify-center hover:scale-110 cursor-pointer group shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
      aria-label={isDark ? '切换到白天模式' : '切换到黑夜模式'}
      title={isDark ? '切换到白天模式' : '切换到黑夜模式'}
    >
      <span
        className={`inline-block transition-all ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}
        style={{ transitionDuration: '600ms' }}
      >
        {isDark ? (
          <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </span>
    </button>
  );
}
