/**
 * 左侧导航栏组件
 * 固定定位，使用 Next.js Link 实现丝滑页面切换
 * 支持移动端汉堡菜单
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: '首页',
    href: '/',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'love',
    label: '恋爱纪念',
    href: '/love',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
  },
  {
    id: 'album',
    label: '时光相册',
    href: '/album',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'blessing',
    label: '祝福板',
    href: '/blessing',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: '关于',
    href: '/about',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'eye',
    label: '小付的秘密',
    href: '/eye',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    id: 'ai-generated',
    label: 'AI生成',
    href: '/ai-generated',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 根据路径确定当前激活项
  const getActiveItem = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/love')) return 'love';
    if (pathname.startsWith('/album')) return 'album';
    if (pathname.startsWith('/blessing')) return 'blessing';
    if (pathname.startsWith('/stories')) return 'articles';
    if (pathname.startsWith('/category')) return 'category';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/eye')) return 'eye';
    if (pathname.includes('wishpool')) return 'wishpool';
    return 'home';
  };

  const activeItem = mounted ? getActiveItem() : 'home';

  // 点击导航项后关闭移动端菜单
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* 桌面端侧边栏 */}
      <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {navItems.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className={`
              relative w-12 h-12 rounded-full flex items-center justify-center
              transition-all duration-300 ease-out cursor-pointer
              group
              ${activeItem === item.id
                ? 'bg-gradient-to-br from-pink-400 to-pink-600 text-white shadow-lg shadow-pink-300 scale-110'
                : 'bg-white/80 dark:bg-[#16213e]/80 backdrop-blur-sm text-pink-500 hover:bg-pink-50 dark:hover:bg-[#1a1a2e] hover:shadow-md hover:scale-105'
              }
            `}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            {/* 激活状态光晕 */}
            {activeItem === item.id && (
              <span className="absolute inset-0 rounded-full bg-pink-400/30 animate-ping" />
            )}
            
            {item.icon}

            {/* Tooltip */}
            <span
              className={`
                absolute left-14 px-3 py-1.5 rounded-lg text-sm font-medium
                bg-pink-500 text-white whitespace-nowrap
                transition-all duration-300
                ${hoveredItem === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
              `}
            >
              {item.label}
              <span className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-pink-500 rotate-45" />
            </span>
          </Link>
        ))}
        
        {/* 底部装饰 */}
        <div className="mt-2 w-12 h-1 rounded-full bg-gradient-to-r from-pink-300 to-pink-500 opacity-50" />
      </nav>

      {/* 移动端汉堡菜单按钮 */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden w-12 h-12 rounded-full bg-white/90 dark:bg-[#16213e]/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-pink-500 hover:bg-pink-50 transition-all duration-300"
        aria-label="打开菜单"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* 移动端菜单遮罩 */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 移动端侧边栏抽屉 */}
      <nav className={`
        fixed left-0 top-0 h-full w-64 z-50 md:hidden
        bg-white/95 dark:bg-[#0a0e27]/95 backdrop-blur-xl shadow-2xl
        transition-transform duration-300 ease-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* 关闭按钮 */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500"
          aria-label="关闭菜单"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 菜单标题 */}
        <div className="p-6 pt-16 border-b border-pink-100 dark:border-pink-900/30">
          <h2 className="text-xl font-bold text-pink-500">导航菜单</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">选择你要去的页面</p>
        </div>

        {/* 导航项列表 */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={handleNavClick}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-xl
                transition-all duration-200
                ${activeItem === item.id
                  ? 'bg-gradient-to-r from-pink-400 to-pink-600 text-white shadow-md'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                }
              `}
            >
              <span className={`w-10 h-10 rounded-full flex items-center justify-center ${activeItem === item.id ? 'bg-white/20' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-500'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {activeItem === item.id && (
                <span className="ml-auto">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* 底部装饰 */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="h-1 rounded-full bg-gradient-to-r from-pink-300 to-pink-500 opacity-50" />
        </div>
      </nav>
    </>
  );
}
