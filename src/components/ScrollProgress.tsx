/**
 * 滚动进度指示器组件 - 升级版
 * 显示页面滚动进度，比部署版更精致
 */

'use client';

import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setProgress(scrollProgress);
      setVisible(scrollTop > 100); // 滚动超过100px时显示
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 初始化

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`scroll-progress ${visible ? 'visible' : ''}`}
      style={{ 
        transform: `scaleX(${progress / 100})`,
      }}
    />
  );
}
