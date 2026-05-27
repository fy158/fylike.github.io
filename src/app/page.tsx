/**
 * 首页组件
 * 整合所有功能模块
 */

import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import Sidebar from '@/components/Sidebar';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import ProfileCard from '@/components/ProfileCard';
import CategorySection from '@/components/CategorySection';
import ArticleGrid from '@/components/ArticleGrid';
import WishPool from '@/components/WishPool';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fff5f7]">
      {/* 玫瑰花瓣飘落动画 - 全局 */}
      <SakuraPetals />

      {/* 鼠标跟随特效动画 */}
      <MouseFollower />

      {/* 主题切换按钮 */}
      <ThemeToggle />

      {/* 音乐播放器 */}
      <MusicPlayer />

      {/* 左侧导航栏 */}
      <Sidebar />

      {/* Hero 区域 */}
      <Hero />

      {/* 轮播图 */}
      <Carousel />

      {/* 主内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* 左侧边栏 - 个人中心卡片 */}
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>

          {/* 右侧内容区 */}
          <div className="lg:col-span-3 space-y-12">
            {/* 文章分类 */}
            <CategorySection />

            {/* 精选文章 */}
            <ArticleGrid />
          </div>
        </div>
      </div>

      {/* 许愿池 */}
      <WishPool />

      {/* 甜蜜相册 */}
      <Gallery />

      {/* 页脚 */}
      <Footer />
    </main>
  );
}
