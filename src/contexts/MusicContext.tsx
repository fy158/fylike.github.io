/**
 * 全局音乐播放上下文
 * 使用 Web Audio API + HTML <audio> 元素，支持可视化效果
 */

'use client';

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  analyserData: Uint8Array | null;
  audioContext: AudioContext | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [analyserData, setAnalyserData] = useState<Uint8Array | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // 初始化 Web Audio API
  const initAudioContext = useCallback(() => {
    if (isInitializedRef.current) return true;
    
    try {
      const audio = audioRef.current;
      if (!audio) return false;

      // 创建 AudioContext
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) {
        console.warn('Web Audio API not supported');
        return false;
      }

      const audioContext = new AudioContextClass();
      audioContextRef.current = audioContext;

      // 创建分析器
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // 连接音频源
      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      sourceRef.current = source;

      isInitializedRef.current = true;
      return true;
    } catch (err) {
      console.warn('Audio context init failed:', err);
      return false;
    }
  }, []);

  // 更新可视化数据
  const updateAnalyser = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser || !isPlaying) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    setAnalyserData(dataArray);

    animationFrameRef.current = requestAnimationFrame(updateAnalyser);
  }, [isPlaying]);

  const userPausedRef = useRef(false);

  // 播放/暂停切换
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // 确保 AudioContext 已初始化并恢复
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      userPausedRef.current = true; // 用户主动暂停
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      userPausedRef.current = false; // 用户主动播放
      // 首次播放时初始化
      initAudioContext();
      
      try {
        await audio.play();
        setIsPlaying(true);
        updateAnalyser();
      } catch (err) {
        console.warn('音频播放失败:', err);
      }
    }
  }, [isPlaying, initAudioContext, updateAnalyser]);

  // 用户首次交互后自动播放（仅一次，且用户未主动暂停过）
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryAutoplay = async () => {
      // 如果用户已主动暂停过，不再自动播放
      if (userPausedRef.current) return;
      if (audio.paused) {
        initAudioContext();
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        try {
          await audio.play();
          setIsPlaying(true);
          updateAnalyser();
        } catch {
          // 被阻止，继续等待下次交互
        }
      }
    };

    // 页面加载后先尝试一次
    tryAutoplay();

    // 监听用户交互 - 仅在未被用户暂停过时自动播放
    const handler = () => {
      if (!userPausedRef.current) {
        tryAutoplay();
      }
    };
    const events = ['click', 'touchstart', 'pointerdown', 'keydown'] as const;
    events.forEach(evt => {
      document.addEventListener(evt, handler, { once: true, passive: true, capture: true });
    });

    return () => {
      events.forEach(evt => {
        document.removeEventListener(evt, handler, { capture: true });
      });
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initAudioContext, updateAnalyser]);

  // 清理
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <MusicContext.Provider value={{ 
      isPlaying, 
      togglePlay, 
      analyserData,
      audioContext: audioContextRef.current 
    }}>
      <audio
        ref={audioRef}
        src="/music/bleeding-love.mp3"
        loop
        preload="auto"
        crossOrigin="anonymous"
        style={{ display: 'none' }}
      />
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
