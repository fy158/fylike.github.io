/**
 * 全局音频可视化组件
 * 在页面顶部显示音乐波形条
 */

'use client';

import { useMusic } from '@/contexts/MusicContext';

export default function AudioVisualizer() {
  const { isPlaying, analyserData } = useMusic();

  if (!isPlaying) return null;

  const barCount = 32;
  
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[9998] flex items-end justify-center gap-[1px] pointer-events-none">
      {Array.from({ length: barCount }).map((_, i) => {
        const dataIndex = Math.floor((i / barCount) * (analyserData?.length || 32));
        const value = analyserData?.[dataIndex] || 0;
        const height = Math.max(2, (value / 255) * 16);
        
        return (
          <span
            key={i}
            className="w-[3px] rounded-full transition-all duration-75"
            style={{
              height: `${height}px`,
              background: `linear-gradient(to top, #ff6b9d, #ffb8d0)`,
              opacity: 0.6 + (height / 32) * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
