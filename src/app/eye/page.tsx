/**
 * 小付的秘密 - 艺术感眼球跟随鼠标
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 单个眼睛组件
const Eye = ({ offsetX, offsetY }: { offsetX: number; offsetY: number }) => {
  return (
    <div className="relative w-32 h-32 md:w-44 md:h-44">
      {/* 外发光 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 blur-xl" />

      {/* 眼白 - 玻璃质感 */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-slate-50 to-slate-100 shadow-2xl border border-white/50 overflow-hidden">
        {/* 玻璃高光 */}
        <div className="absolute top-2 left-4 w-12 h-6 bg-white/60 rounded-full blur-sm rotate-[-20deg]" />
        <div className="absolute top-4 right-6 w-6 h-3 bg-white/40 rounded-full blur-sm rotate-[30deg]" />
      </div>

      {/* 虹膜 */}
      <div
        className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden"
        style={{
          left: `calc(50% - 2.5rem + ${offsetX}px)`,
          top: `calc(50% - 2.5rem + ${offsetY}px)`,
        }}
      >
        {/* 虹膜渐变 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600" />

        {/* 虹膜纹理 */}
        <div className="absolute inset-0 rounded-full opacity-30">
          <div className="absolute inset-1 rounded-full border-2 border-white/50" />
          <div className="absolute inset-2 rounded-full border border-white/30" />
          <div className="absolute inset-3 rounded-full border border-white/20" />
        </div>

        {/* 放射状纹理 */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}
              y2={50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}
              stroke="white"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* 瞳孔 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-slate-900 via-black to-slate-800">
          {/* 瞳孔高光 */}
          <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-full opacity-90" />
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
};

export default function EyeFollower() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [leftEyeOffset, setLeftEyeOffset] = useState({ x: 0, y: 0 });
  const [rightEyeOffset, setRightEyeOffset] = useState({ x: 0, y: 0 });
  const [windowHeight, setWindowHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      setMousePos({ x: mouseX, y: mouseY });

      // 获取容器位置
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerCenterX = rect.left + rect.width / 2;
      const containerCenterY = rect.top + rect.height / 2;

      // 基于两眼中心点统一计算方向（保证对称）
      const dx = mouseX - containerCenterX;
      const dy = mouseY - containerCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // 统一偏移量，两眼完全一致，保证对称
      const maxOffset = 22;
      const sensitivity = 6; // 越小越灵敏
      const offset = Math.min(distance / sensitivity, maxOffset);

      const offsetX = Math.cos(angle) * offset;
      const offsetY = Math.sin(angle) * offset;

      setLeftEyeOffset({ x: offsetX, y: offsetY });
      setRightEyeOffset({ x: offsetX, y: offsetY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* 渐变光晕 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* 鼠标上移提示文字 - 有趣俏皮 */}
      <div
        className={`absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-500 ${
          windowHeight > 0 && mousePos.y < windowHeight * 0.35 && mousePos.y > 0
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4'
        }`}
      >
        <div className="relative">
          {/* 气泡背景 */}
          <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-md border border-white/20 shadow-lg shadow-purple-500/10">
            <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 whitespace-nowrap">
              👀 瞎划拉啥呢？
            </p>
          </div>
          {/* 小三角 */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-md border-r border-b border-white/20 rotate-45" />
        </div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* 眼睛容器 */}
        <div ref={containerRef} className="flex items-center gap-10 md:gap-16">
          <Eye offsetX={leftEyeOffset.x} offsetY={leftEyeOffset.y} />
          <Eye offsetX={rightEyeOffset.x} offsetY={rightEyeOffset.y} />
        </div>

        {/* 装饰线条 */}
        <div className="mt-20 flex items-center gap-4">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-cyan-500/50" />
          <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
          <div className="w-32 h-px bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-cyan-500/50" />
          <div className="w-2 h-2 rounded-full bg-purple-500/50" />
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-purple-500/50" />
        </div>

        {/* 提示文字 */}
        <p className="mt-8 text-slate-500 text-xs tracking-widest">
          移动鼠标试试
        </p>

        {/* 跳转百宝箱按钮 */}
        <Link
          href="/links"
          className="mt-12 inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300 hover:border-cyan-300/60 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all duration-300 group"
        >
          <span className="text-lg">🧭</span>
          <span className="text-sm tracking-wider">小付的百宝箱</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>

      {/* 返回按钮 */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group z-20"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="text-sm tracking-wider">返回</span>
      </Link>

      {/* 坐标显示 */}
      <div className="absolute bottom-8 right-8 text-slate-600 text-xs font-mono z-20">
        <span className="text-cyan-500">X</span> {Math.round(mousePos.x).toString().padStart(4, '0')}{' '}
        <span className="text-purple-500">Y</span> {Math.round(mousePos.y).toString().padStart(4, '0')}
      </div>

      {/* 自定义动画样式 */}
      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
