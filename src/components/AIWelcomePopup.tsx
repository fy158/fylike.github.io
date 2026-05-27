'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AIWelcomePopupProps {
  robotImage?: string;
  message?: string;
  duration?: number;
}

export default function AIWelcomePopup({
  robotImage = '/images/ai-covers/ai-robot.webp',
  message = '欢迎来到 AI 创意工坊！✨',
  duration = 2500,
}: AIWelcomePopupProps) {
  const [phase, setPhase] = useState<'entering' | 'showing' | 'minimized' | 'avatar-only'>('entering');
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 进入动画后显示完整弹窗
    const showTimer = setTimeout(() => {
      setPhase('showing');
    }, 100);

    // duration 后缩小到左侧
    const minimizeTimer = setTimeout(() => {
      setPhase('minimized');
    }, duration);

    // 缩小后再过2秒，欢迎语消失，只保留头像
    const hideMessageTimer = setTimeout(() => {
      setPhase('avatar-only');
    }, duration + 2000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(minimizeTimer);
      clearTimeout(hideMessageTimer);
    };
  }, [duration]);

  // 点击跳转到 AI 聊天页面
  const handleClick = () => {
    router.push('/ai-map');
  };

  // 只保留头像状态 - 悬停显示"要和我聊聊天吗？"
  if (phase === 'avatar-only') {
    return (
      <div 
        className="fixed left-4 bottom-24 z-40 pointer-events-auto cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleClick}
      >
        {/* 机器人小头像 */}
        <div className="relative group">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/50 shadow-lg shadow-purple-500/30 bg-gradient-to-br from-purple-900/50 to-blue-900/50 transition-transform duration-300 group-hover:scale-110">
            <img
              src={robotImage}
              alt="AI Robot"
              className="w-full h-full object-cover"
            />
          </div>
          {/* 呼吸光环 */}
          <div className="absolute -inset-1 rounded-full border border-purple-400/50 animate-ping" style={{ animationDuration: '2s' }} />
          
          {/* 悬停气泡 - "要和我聊聊天吗？" */}
          <div 
            className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
              hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-pink-200 dark:border-pink-800 whitespace-nowrap">
              {/* 气泡三角 */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/95 dark:bg-gray-800/95 rotate-45 border-l border-b border-pink-200 dark:border-pink-800" />
              <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500">
                要和我聊聊天吗？💬
              </p>
              {/* 点击提示 */}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                点击进入 AI 地图助手
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 缩小状态 - 头像 + 欢迎语
  if (phase === 'minimized') {
    return (
      <div className="fixed left-4 bottom-24 z-40 flex items-center gap-2 pointer-events-auto">
        {/* 机器人小头像 */}
        <div className="relative group cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleClick}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/50 shadow-lg shadow-purple-500/30 bg-gradient-to-br from-purple-900/50 to-blue-900/50 transition-transform duration-300 group-hover:scale-110">
            <img
              src={robotImage}
              alt="AI Robot"
              className="w-full h-full object-cover"
            />
          </div>
          {/* 呼吸光环 */}
          <div className="absolute -inset-1 rounded-full border border-purple-400/50 animate-ping" style={{ animationDuration: '2s' }} />
          
          {/* 悬停气泡 */}
          <div 
            className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 transition-all duration-300 ${
              hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`}
          >
            <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-pink-200 dark:border-pink-800 whitespace-nowrap">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white/95 dark:bg-gray-800/95 rotate-45 border-l border-b border-pink-200 dark:border-pink-800" />
              <p className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500">
                要和我聊聊天吗？
              </p>
            </div>
          </div>
        </div>

        {/* 欢迎语 - 气泡形式 */}
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-pink-200 dark:border-pink-800">
          {/* 气泡三角 */}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-white/90 dark:bg-gray-800/90 rotate-45 border-l border-b border-pink-200 dark:border-pink-800" />
          <p className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500">
            {message}
          </p>
        </div>
      </div>
    );
  }

  // 进入/显示状态 - 全屏居中
  return (
    <div
      className={`fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${
        phase === 'showing' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* 背景遮罩 */}
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          phase === 'showing' ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* 弹窗主体 */}
      <div
        className={`relative flex flex-col items-center gap-4 transition-all duration-700 ${
          phase === 'showing' ? 'scale-100' : 'scale-50'
        }`}
        style={{
          animation: phase === 'showing' ? 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
        }}
      >
        {/* 光环效果 */}
        <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse" />

        {/* 机器人图片 */}
        <div className="relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl shadow-purple-500/30 bg-gradient-to-br from-purple-900/50 to-blue-900/50">
            <img
              src={robotImage}
              alt="AI Robot"
              className="w-full h-full object-cover"
            />
          </div>
          {/* 旋转光环 */}
          <div className="absolute -inset-2 rounded-full border-2 border-transparent border-t-purple-400 border-r-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute -inset-4 rounded-full border border-transparent border-b-pink-400 border-l-blue-400 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />
        </div>

        {/* 欢迎文字气泡 */}
        <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl px-6 py-4 shadow-2xl max-w-sm">
          {/* 气泡三角 */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/95 dark:bg-gray-900/95 rotate-45" />
          
          <div className="relative">
            <p className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 text-center">
              {message}
            </p>
          </div>
        </div>

        {/* 底部小星星装饰 */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="text-yellow-400 animate-ping"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '1.5s',
                fontSize: '8px',
              }}
            >
              ✦
            </span>
          ))}
        </div>
      </div>

      {/* 内联动画关键帧 */}
      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(40px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) translateY(-5px);
          }
          70% {
            transform: scale(0.95) translateY(2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
