/**
 * 轮播图组件
 * 自动轮播 + 手动切换，使用独立轮播数据
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

const carouselSlides = [
  {
    image: '/images/carousel1.jpg',
    title: '薰衣草花海下的星空',
    subtitle: '在最美的风景里，遇见最美的你',
    category: '风景',
  },
  {
    image: '/images/carousel2.jpg',
    title: '夜樱之约',
    subtitle: '樱花树下的约定，我会永远记得',
    category: '动漫',
  },
  {
    image: '/images/carousel3.jpg',
    title: '花海中的约定',
    subtitle: '和你一起走过的每一段路，都是最美的旅程',
    category: '风景',
  },
  {
    image: '/images/carousel4.jpg',
    title: '雪夜的温暖',
    subtitle: '有你的冬天，再冷也不觉得寒冷',
    category: '动漫',
  },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentIndex + 1) % carouselSlides.length);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentIndex - 1 + carouselSlides.length) % carouselSlides.length);
  }, [currentIndex, goToSlide]);

  // 自动轮播 4秒
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {carouselSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* 背景图 */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          {/* 渐变遮罩 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          {/* 文字内容 */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-6 max-w-3xl">
              <span className="inline-block px-4 py-1 bg-pink-500/80 text-white text-sm rounded-full mb-4 backdrop-blur-sm">
                {slide.category}
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* 左右箭头 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all flex items-center justify-center"
        aria-label="上一张"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/40 transition-all flex items-center justify-center"
        aria-label="下一张"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 圆点指示器 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {carouselSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`切换到第${index + 1}张`}
          />
        ))}
      </div>
    </section>
  );
}
