/**
 * 打字机效果组件
 * 循环显示多段文字，带有闪烁光标效果
 */

'use client';

import { useState, useEffect } from 'react';

interface TypewriterProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function Typewriter({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = '',
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 客户端挂载后再开始动画
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const currentText = texts[textIndex];

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (!isDeleting) {
      // 打字阶段
      if (charIndex <= currentText.length) {
        setDisplayText(currentText.slice(0, charIndex));
        const timer = setTimeout(() => {
          setCharIndex((c) => c + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // 打完了，暂停
        setIsPaused(true);
        return;
      }
    } else {
      // 删除阶段
      if (charIndex > 0) {
        setDisplayText(currentText.slice(0, charIndex));
        const timer = setTimeout(() => {
          setCharIndex((c) => c - 1);
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        // 删完了，切换到下一段
        setDisplayText('');
        setTextIndex((prev) => (prev + 1) % texts.length);
        setIsDeleting(false);
        return;
      }
    }
  }, [charIndex, isDeleting, isPaused, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration, mounted]);

  if (!mounted) {
    return <span className={className}></span>;
  }

  return (
    <span className={className}>
      {displayText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
}
