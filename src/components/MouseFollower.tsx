/**
 * 鼠标跟随特效组件
 * 鼠标移动时随机生成: 爱心、小星星、闪光点
 * 上浮+淡出效果，节流80ms，最多同时20个粒子
 */

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  type: 'heart' | 'star' | 'sparkle';
  color: string;
  size: number;
}

const MAX_PARTICLES = 20;
const PARTICLE_COLORS = [
  '#ff6b9d',  // 粉色
  '#ff85a1',  // 浅粉
  '#e91e63',  // 玫瑰红
  '#ffd700',  // 金色
  '#ffb347',  // 橙金
  '#9b59b6',  // 紫色
  '#ff69b4',  // 热粉
  '#da70d6',  // 兰花紫
];

let particleIdCounter = 0;

// 爱心SVG路径
const heartPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

// 五角星SVG路径
const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

function ParticleElement({ particle, onComplete }: { particle: Particle; onComplete: (id: number) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(particle.id);
    }, 1200); // 动画持续时间
    return () => clearTimeout(timer);
  }, [particle.id, onComplete]);

  const animationClass = particle.type === 'heart' ? 'mouse-heart' : particle.type === 'star' ? 'mouse-star' : 'mouse-sparkle';

  return (
    <div
      className={animationClass}
      style={{
        left: `${particle.x}px`,
        top: `${particle.y}px`,
        position: 'absolute',
        pointerEvents: 'none',
      }}
    >
      {particle.type === 'sparkle' ? (
        <div
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size}px ${particle.color}, 0 0 ${particle.size * 2}px ${particle.color}`,
          }}
        />
      ) : (
        <svg
          width={particle.size}
          height={particle.size}
          viewBox="0 0 24 24"
          fill={particle.color}
        >
          <path d={particle.type === 'heart' ? heartPath : starPath} />
        </svg>
      )}
    </div>
  );
}

export default function MouseFollower() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const removeParticle = useCallback((id: number) => {
    particlesRef.current = particlesRef.current.filter(p => p.id !== id);
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  const createParticle = useCallback((x: number, y: number) => {
    if (particlesRef.current.length >= MAX_PARTICLES) return;

    const id = particleIdCounter++;
    const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    const types: ('heart' | 'star' | 'sparkle')[] = ['heart', 'star', 'sparkle'];
    const type = types[Math.floor(Math.random() * types.length)];
    const size = type === 'sparkle'
      ? Math.random() * 6 + 4   // 4-10px
      : Math.random() * 12 + 10; // 10-22px

    const particle: Particle = { id, x, y, type, color, size };
    particlesRef.current.push(particle);
    setParticles(prev => [...prev, particle]);
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const throttleDelay = 80; // 80ms 节流

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleDelay) return;
      lastTime = now;

      createParticle(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [createParticle]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden"
      aria-hidden="true"
    >
      <style>{`
        @keyframes float-up-heart {
          0% {
            transform: translate(-50%, -50%) scale(0.5) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -80px) scale(1) rotate(10deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -150px) scale(0.3) rotate(-10deg);
            opacity: 0;
          }
        }
        @keyframes float-up-star {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -60px) scale(1) rotate(180deg);
            opacity: 0.7;
          }
          100% {
            transform: translate(-50%, -120px) scale(0.2) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes float-up-sparkle {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          30% {
            transform: translate(-50%, -30px) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -80px) scale(0);
            opacity: 0;
          }
        }
        .mouse-heart {
          animation: float-up-heart 1.2s ease-out forwards;
        }
        .mouse-star {
          animation: float-up-star 1s ease-out forwards;
        }
        .mouse-sparkle {
          animation: float-up-sparkle 0.8s ease-out forwards;
        }
      `}</style>
      {particles.map(particle => (
        <ParticleElement
          key={particle.id}
          particle={particle}
          onComplete={removeParticle}
        />
      ))}
    </div>
  );
}
