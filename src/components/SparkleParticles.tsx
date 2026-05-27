'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  drift: number;
  hue: number;
  twinkleSpeed: number;
  twinklePhase: number;
  shape: 'star' | 'circle' | 'diamond';
}

export default function SparkleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const animFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);

  const createSparkle = useCallback((): Sparkle => ({
    id: nextIdRef.current++,
    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
    y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
    size: Math.random() * 4 + 1,
    opacity: Math.random() * 0.7 + 0.3,
    speed: Math.random() * 0.3 + 0.1,
    drift: (Math.random() - 0.5) * 0.5,
    hue: Math.random() * 60 + 240, // blue-purple range (240-300)
    twinkleSpeed: Math.random() * 0.03 + 0.01,
    twinklePhase: Math.random() * Math.PI * 2,
    shape: (['star', 'circle', 'diamond'] as const)[Math.floor(Math.random() * 3)],
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // 初始化粒子
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    sparklesRef.current = Array.from({ length: count }, createSparkle);

    const drawStar = (cx: number, cy: number, size: number) => {
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (Math.PI * i) / spikes - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    const drawDiamond = (cx: number, cy: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx + size * 0.6, cy);
      ctx.lineTo(cx, cy + size);
      ctx.lineTo(cx - size * 0.6, cy);
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparklesRef.current.forEach((s) => {
        // 更新位置
        s.y -= s.speed;
        s.x += s.drift + Math.sin(s.y * 0.01) * 0.2;
        s.twinklePhase += s.twinkleSpeed;

        // 超出屏幕则重置
        if (s.y < -10) {
          s.y = canvas.height + 10;
          s.x = Math.random() * canvas.width;
        }
        if (s.x < -10) s.x = canvas.width + 10;
        if (s.x > canvas.width + 10) s.x = -10;

        // 闪烁效果
        const twinkle = (Math.sin(s.twinklePhase) + 1) / 2;
        const alpha = s.opacity * (0.3 + twinkle * 0.7);
        const currentSize = s.size * (0.7 + twinkle * 0.3);

        // 绘制光晕
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, currentSize * 3);
        gradient.addColorStop(0, `hsla(${s.hue}, 80%, 80%, ${alpha * 0.4})`);
        gradient.addColorStop(1, `hsla(${s.hue}, 80%, 80%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(s.x, s.y, currentSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // 绘制主体
        ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${alpha})`;
        if (s.shape === 'star') {
          drawStar(s.x, s.y, currentSize);
        } else if (s.shape === 'diamond') {
          drawDiamond(s.x, s.y, currentSize);
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, currentSize, 0, Math.PI * 2);
        }
        ctx.fill();

        // 十字光芒（大粒子才有）
        if (currentSize > 2.5) {
          ctx.strokeStyle = `hsla(${s.hue}, 90%, 90%, ${alpha * 0.5})`;
          ctx.lineWidth = 0.5;
          const len = currentSize * 2.5;
          ctx.beginPath();
          ctx.moveTo(s.x - len, s.y);
          ctx.lineTo(s.x + len, s.y);
          ctx.moveTo(s.x, s.y - len);
          ctx.lineTo(s.x, s.y + len);
          ctx.stroke();
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [createSparkle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
