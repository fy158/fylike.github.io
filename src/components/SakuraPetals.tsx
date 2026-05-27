/**
 * 玫瑰花瓣飘落动画组件
 * 创建30片玫瑰花瓣，随机位置、大小、速度飘落
 * 使用爱心形状SVG模拟玫瑰花瓣
 */

'use client';

import { useEffect, useState } from 'react';

// 红色系颜色
const ROSE_COLORS = ['#e74c3c', '#c0392b', '#ff6b6b', '#ee5a24', '#ff4757', '#d63031'];

interface Petal {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  swayAmount: number;
}

// 爱心形状的花瓣 - 使用CSS绘制避免SVG渲染问题
function PetalHeart({ color, size }: { color: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: 'rotate(-45deg)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: size * 0.55,
          height: size * 0.8,
          background: color,
          borderRadius: `${size * 0.55}px ${size * 0.55}px 0 0`,
          left: size * 0.225,
          top: 0,
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: size * 0.8,
          height: size * 0.55,
          background: color,
          borderRadius: `0 ${size * 0.55}px ${size * 0.55}px 0`,
          left: size * 0.225,
          top: size * 0.225,
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        }}
      />
    </div>
  );
}

export default function SakuraPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 生成30片玫瑰花瓣
    const generatedPetals: Petal[] = Array.from({ length: 30 }, (_, i) => {
      // 前10片作为焦点花瓣，稍大(15-25px)
      const isFocus = i < 10;
      return {
        id: i,
        left: `${(i * 3.3) % 100}%`,
        size: isFocus
          ? Math.random() * 10 + 15  // 15-25px 焦点花瓣
          : Math.random() * 12 + 8,  // 8-20px 普通花瓣
        duration: Math.random() * 10 + 10, // 10-20s
        delay: Math.random() * 10, // 0-10s延迟
        opacity: isFocus
          ? Math.random() * 0.3 + 0.6  // 0.6-0.9 焦点花瓣更醒目
          : Math.random() * 0.4 + 0.3, // 0.3-0.7
        color: ROSE_COLORS[Math.floor(Math.random() * ROSE_COLORS.length)],
        swayAmount: Math.random() * 40 + 20, // 20-60px 左右摇摆幅度
      };
    });
    setPetals(generatedPetals);
  }, []);

  // 服务端渲染时不渲染任何内容，避免hydration不匹配
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes rose-fall {
          0% {
            transform: translateY(-10vh) translateX(0) rotate(0deg);
            opacity: var(--petal-opacity, 0.6);
          }
          25% {
            transform: translateY(25vh) translateX(var(--sway-amount, 30px)) rotate(90deg);
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--sway-amount, 30px) * -0.7)) rotate(180deg);
          }
          75% {
            transform: translateY(75vh) translateX(var(--sway-amount, 30px)) rotate(270deg);
          }
          100% {
            transform: translateY(110vh) translateX(calc(var(--sway-amount, 30px) * -0.5)) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute"
          style={{
            left: petal.left,
            animation: `rose-fall ${petal.duration}s linear ${petal.delay}s infinite`,
            opacity: petal.opacity,
            '--petal-opacity': petal.opacity,
            '--sway-amount': `${petal.swayAmount}px`,
          } as React.CSSProperties}
        >
          <PetalHeart color={petal.color} size={petal.size} />
        </div>
      ))}
    </div>
  );
}
