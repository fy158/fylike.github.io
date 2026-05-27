/**
 * Footer 组件 - 升级版
 * 底部版权信息、快速链接、联系方式
 * 使用平滑滚动锚点跳转 + 悬停动画
 */

'use client';

import { useState } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const quickLinks = [
    { label: '首页', href: '#home', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
    { label: '文章', href: '#articles', icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
    { label: '分类', href: '#categories', icon: 'M12 2l-5.5 9h11z M12 5.84L13.93 9h-3.87z M17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5z M5 21.5h8v-8H5v8z' },
    { label: '许愿池', href: '#wishpool', icon: 'M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.8 2.8 2 3.5v2c0 .6-.4 1-1 1H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2h-2.5c-.6 0-1-.4-1-1v-2c1.2-.7 2-2 2-3.5C16.5 4 14.5 2 12 2z' },
    { label: '相册', href: '#gallery', icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer id="about" className="bg-white/80 backdrop-blur-sm border-t border-pink-100/50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* 博客信息 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-pink-500 animate-heartbeat" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <h3 className="text-xl font-bold gradient-text">甜心恋语</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              一个记录爱情故事、分享恋爱心得的温暖角落。
              相信记录的力量，让每一份心动都被珍藏。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
              快速链接
            </h4>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    onMouseEnter={() => setHoveredLink(link.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-300
                      ${hoveredLink === link.label
                        ? 'text-pink-500 bg-pink-50 translate-x-1'
                        : 'text-gray-500 hover:text-pink-500'
                      }
                    `}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-300 ${hoveredLink === link.label ? 'scale-110' : ''}`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={link.icon} />
                    </svg>
                    {link.label}
                    <svg
                      className={`w-3 h-3 ml-auto transition-all duration-300 ${hoveredLink === link.label ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              联系我们
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                contact@tianxinlianyu.com
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                上海市
              </li>
            </ul>

            {/* 社交媒体图标 */}
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-pink-500 hover:from-pink-500 hover:to-pink-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-pink-500 hover:from-pink-500 hover:to-pink-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center text-pink-500 hover:from-pink-500 hover:to-pink-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div className="border-t border-pink-100/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              {currentYear} 甜心恋语. All rights reserved.
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-pink-500 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                沪ICP备XXXXXXXX号
              </a>
              <span className="hidden md:inline">|</span>
              <a href="#" className="hover:text-pink-500 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
                公安网备XXXXXXXX号
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
