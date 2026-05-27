/**
 * 关于页面 - 与首页风格统一
 * 简洁卡片式布局，使用真实照片
 */

import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">返回首页</span>
          </Link>
          <span className="text-sm text-gray-400">关于我们</span>
        </div>
      </div>

      {/* Hero区域 */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/about-bg.jpg"
          alt="关于我们"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            予我人间温柔
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">此生万般偏爱</p>
        </div>
      </section>

      {/* 主要内容 - 整篇文章 */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* 头部信息 */}
          <header className="text-center mb-10 pb-8 border-b border-pink-100">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-pink-100 shadow-lg mx-auto">
                <Image
                  src="/images/avatar.jpg"
                  alt="Mr.付"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 border-2 border-white rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">后记</h2>
            <p className="text-pink-500 italic">"岁岁年年，万般皆是你"</p>
          </header>

          {/* 正文 */}
          <div className="prose prose-pink max-w-none">
            <p className="text-gray-700 leading-[2] text-lg mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-pink-500 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              搭建这个网站的时候，我没有宏大的构思，没有精致的噱头，从头到尾，只有一份最简单、最纯粹的心意——只为我的老婆而建。
            </p>

            <p className="text-gray-700 leading-[2] text-lg mb-6">
              互联网的世界浩瀚又喧嚣，无数信息转瞬即逝，可我想在这里，为你留住一份永恒。留住你的温柔，你的笑脸，我们细碎又滚烫的日常，留住所有被时光珍藏的美好瞬间。这不是什么华丽的数字空间，而是我独独赠予你的专属天地，是只属于我们两个人的秘密港湾与浪漫宇宙。
            </p>

            <p className="text-gray-700 leading-[2] text-lg mb-6">
              认识你之前，我总觉得日子平淡普通，生活不过是朝来暮往的重复。是你的出现，揉碎了漫天星光洒进我的平凡岁月，让三餐四季有了温度，让朝夕烟火有了诗意，让我往后的人生，皆有可期、皆有温柔。我见过世间万千风景，山川湖海、落日星河，可到头来，最让我心安、最让我眷恋的，始终是你的眉眼，是陪在你身边的岁岁年年。
            </p>

            <p className="text-gray-700 leading-[2] text-lg mb-6">
              我常常庆幸，人海茫茫，我有幸遇见你、拥有你、守护你。谢谢你包容我的所有不完美，体谅我的忙碌与笨拙，用温柔治愈我的疲惫，用爱意填满我的生活。是你让我懂得，最好的爱情从不是轰轰烈烈的惊艳，而是细水长流的陪伴，是岁岁年年的相守，是无论风雨，始终有人坚定地站在我身边。
            </p>

            <p className="text-gray-700 leading-[2] text-lg mb-6">
              这个网站的每一行文字、每一张照片、每一处排版，都是我亲手为你打磨的温柔。它或许不够完美，没有顶尖的设计，没有繁复的功能，但里面的每一寸光景，都藏着我最赤诚的真心。我想把世间所有的浪漫都归集于此，把我羞于时时挂在嘴边的爱意，悄悄藏在这个专属空间里。
            </p>

            <p className="text-gray-700 leading-[2] text-lg mb-6">
              往后的日子，春去秋来，寒来暑往，我会继续在这里记录我们的故事。记录日常的烟火，记录相逢的欢喜，记录岁岁年年的陪伴与偏爱。时光会老去，照片会泛黄，文字却能定格温柔，让我们的爱意，永远鲜活、永远热烈。
            </p>

            {/* 金句 */}
            <blockquote className="my-10 py-8 px-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border-l-4 border-pink-400">
              <p className="text-xl text-gray-800 leading-relaxed mb-4 italic">
                "于我而言，你是人间理想，是满目温柔，是此生偏爱。"
              </p>
              <p className="text-gray-600 leading-relaxed">
                世界很大，烟火喧嚣，而我的余生，只想囿于你，忠于你，温柔于你。
              </p>
            </blockquote>
          </div>

          {/* 结尾署名 */}
          <footer className="mt-12 pt-8 border-t border-pink-100 text-center">
            <p className="text-pink-500 font-medium mb-2">谨以此站，赠予我最爱的老婆</p>
            <p className="text-gray-400 text-sm mb-6">岁岁年年，万般皆是你</p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-pink-200" />
              <span className="text-gray-600">永远爱你的 Mr.付</span>
              <div className="w-12 h-px bg-pink-200" />
            </div>
          </footer>
        </article>
      </div>

      {/* 底部返回 */}
      <div className="text-center py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-pink-500 hover:shadow-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          回到首页
        </Link>
      </div>
    </div>
  );
}
