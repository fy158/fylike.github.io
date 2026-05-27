/**
 * 音乐播放控制按钮
 * 毛玻璃风格 + Web Audio API 可视化波形
 */

'use client';

import { useMusic } from '@/contexts/MusicContext';

export default function MusicPlayer() {
  const { isPlaying, togglePlay, analyserData } = useMusic();

  // 计算波形条高度
  const getBarHeight = (index: number) => {
    if (!isPlaying || !analyserData) return 4;
    const dataIndex = Math.floor((index / 5) * (analyserData.length / 2));
    const value = analyserData[dataIndex] || 0;
    return Math.max(4, (value / 255) * 24);
  };

  return (
    <button
      onClick={togglePlay}
      className={`
        fixed bottom-6 right-6 z-[9999] 
        w-12 h-12 rounded-full
        backdrop-blur-md 
        transition-all duration-500 ease-out
        flex items-center justify-center
        hover:scale-110 cursor-pointer
        group
        ${isPlaying
          ? 'bg-white/20 border border-white/30 hover:bg-white/30'
          : 'bg-white/30 border border-white/40 hover:bg-white/50 hover:border-white/60'
        }
        shadow-[0_2px_12px_rgba(0,0,0,0.08)]
      `}
      aria-label={isPlaying ? '暂停音乐' : '播放音乐'}
      title={isPlaying ? '暂停音乐' : '播放音乐'}
    >
      {/* 播放中的柔和呼吸光晕 */}
      {isPlaying && (
        <span className="absolute inset-0 rounded-full animate-music-pulse bg-pink-400/10" />
      )}

      {/* 播放图标或波形可视化 */}
      {isPlaying ? (
        /* 波形可视化 - 5条动态条 */
        <div className="flex items-end gap-[2px] h-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-pink-400 transition-all duration-75"
              style={{
                height: `${getBarHeight(i)}px`,
                opacity: analyserData ? 0.8 + (getBarHeight(i) / 48) : 0.6,
              }}
            />
          ))}
        </div>
      ) : (
        /* 播放图标 */
        <svg
          className="w-5 h-5 text-pink-400 transition-all duration-300 group-hover:text-pink-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}

      {/* 暂停状态指示点 */}
      {!isPlaying && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-300/60" />
      )}
    </button>
  );
}
