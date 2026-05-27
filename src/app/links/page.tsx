/**
 * 链接导航页面 - 小付的百宝箱
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LinkItem {
  name: string;
  url: string;
}

interface LinkCategory {
  name: string;
  icon: string;
  color: string;
  links: LinkItem[];
}

const categories: LinkCategory[] = [
  {
    name: '🎬 视频平台',
    icon: '🎬',
    color: 'from-red-500 to-orange-500',
    links: [
      { name: 'B站', url: 'https://www.bilibili.com' },
      { name: '优酷', url: 'https://www.youku.com' },
      { name: '爱奇艺', url: 'https://www.iqiyi.com' },
      { name: '腾讯视频', url: 'https://v.qq.com' },
      { name: '芒果TV', url: 'https://www.mgtv.com' },
      { name: '央视纪实', url: 'https://jishi.cctv.com' },
      { name: '好好看影视', url: 'https://103.194.185.51:51123/' },
      { name: '影视', url: 'https://nsvod.cc' },
      { name: '影视', url: 'https://qqqys.com/' },
      { name: '近代影像资料库', url: 'https://www.lzp360.com/' },
      { name: '电影推荐', url: 'http://www.mvcat.com' },
      { name: '日漫', url: 'http://maigo.cc' },
      { name: 'B站付费课程', url: 'https://pan.quark.cn/s/0e6777c82fd3' },
    ],
  },
  {
    name: '🎵 音乐平台',
    icon: '🎵',
    color: 'from-green-500 to-emerald-500',
    links: [
      { name: '网易云音乐', url: 'https://music.163.com' },
      { name: 'QQ音乐', url: 'https://y.qq.com' },
      { name: '酷狗音乐', url: 'https://www.kugou.com' },
      { name: '酷我音乐', url: 'https://www.kuwo.cn' },
      { name: '咪咕音乐', url: 'https://music.migu.cn' },
      { name: '米兔音乐', url: 'http://www.qqmp3.ve' },
      { name: 'TED演讲', url: 'https://www.ted.com/' },
    ],
  },
  {
    name: '📚 学习资源',
    icon: '📚',
    color: 'from-blue-500 to-indigo-500',
    links: [
      { name: 'Hello算法', url: 'https://www.hello-algo.com/' },
      { name: '大学生资源网', url: 'https://www.dxzy163.com/' },
      { name: '考试酷', url: 'https://www.examcoo.com/index/detail/mid/1/' },
      { name: '虫部落', url: 'https://www.chongbuluo.com/' },
      { name: '中国国家数字图书馆', url: 'http://www.nlc.cn/' },
      { name: '英语学习', url: 'https://julebu.co/ref/LFA7QBS1' },
      { name: '英语绘本', url: 'https://www.uniteforliteracy.com/' },
      { name: '学习资源', url: 'http://xue100.panxuexue.com' },
      { name: '学习资源', url: 'http://qianxx.ysepan.com' },
      { name: '学习导航', url: 'https://blog.share888.top/nav/' },
      { name: '资源猴', url: 'http://www.ziyuanhou.com' },
      { name: '资源导航', url: 'https://blog.951u.cn/' },
      { name: '仿真网', url: 'https://www.yssim.cn/' },
      { name: '资源', url: 'http://fanxingbzk.com/' },
      { name: '搬书匠', url: 'http://www.banshujiang.cn/' },
      { name: '阅读', url: 'http://zlib.su' },
      { name: '记住', url: 'http://ji-zhu.com' },
      { name: '顷刻', url: 'https://qingk.com/share' },
      { name: '藏宝阁', url: 'https://link3.cc/xatx20' },
    ],
  },
  {
    name: '🎨 设计工具',
    icon: '🎨',
    color: 'from-purple-500 to-pink-500',
    links: [
      { name: '可画', url: 'https://www.canva.cn/' },
      { name: '第一PPT', url: 'http://www.1ppt.com/' },
      { name: '优品PPT', url: 'https://www.ypppt.com' },
      { name: 'PPT超市', url: 'https://www.pptsupermarket.com/' },
      { name: '顶尖创意', url: 'https://www.topys.cn/' },
      { name: '思维导图', url: 'https://gitmind.com/' },
      { name: '书法生成器', url: 'https://www.shufazi.cn/' },
      { name: '毛笔字体', url: 'https://www.maoken.com/all-fonts' },
      { name: '淡墨水', url: 'https://danmoshui.com/' },
      { name: '练字', url: 'https://xgzb.top/han' },
      { name: '二维码生成', url: 'https://www.erweicaihong.cn/' },
      { name: '梗图生成器', url: 'https://www.zuomeme.com' },
    ],
  },
  {
    name: '🔧 实用工具',
    icon: '🔧',
    color: 'from-cyan-500 to-teal-500',
    links: [
      { name: '格式转换', url: 'https://www.aconvert.com/' },
      { name: '文件转换', url: 'https://123apps.com/cn/' },
      { name: '俄罗斯搜索引擎', url: 'http://yandex.tm' },
      { name: '全球网站集合', url: 'http://www.world68.com/' },
      { name: '国家数据统计局', url: 'https://data.stats.gov.cn/' },
      { name: '打卡问卷统计', url: 'https://www.jiandaoyun.com' },
      { name: '台词截图+英语语境', url: 'http://zmt.agilestudio.cn/' },
      { name: '台词时间段', url: 'http://www.zhaotaici.cn/' },
      { name: '通过台词找影片素材', url: 'https://33.agilestudio.cn/' },
      { name: '合租平台', url: 'http://juzia.cn' },
    ],
  },
  {
    name: '🎮 趣味娱乐',
    icon: '🎮',
    color: 'from-yellow-500 to-amber-500',
    links: [
      { name: '富豪模拟器', url: 'http://yysv.cn' },
      { name: '摸鱼解压', url: 'https://www.milkywayidle.com/?ref=453419' },
      { name: '重力球', url: 'https://gravityball.top' },
      { name: '抄写', url: 'http://www.beautifulcarrot.com/' },
      { name: '桌游', url: 'http://game.hullqin.cn' },
      { name: '镜像炫光', url: 'http://weavesilk.com/' },
      { name: '化学科普游戏', url: 'http://littlealchemy.com/' },
      { name: '你猜我画', url: 'https://enazo.cn' },
      { name: '解压网', url: 'https://aidn.jp/mikutap/' },
      { name: 'English Games', url: 'https://neal.fun/' },
      { name: '徒步游戏', url: 'https://cyberhiking.com/' },
      { name: '壁纸', url: 'https://snake.timeline.ink/home' },
      { name: '美女写真', url: 'http://duotutu.com' },
    ],
  },
  {
    name: '✨ 文化探索',
    icon: '✨',
    color: 'from-rose-500 to-red-400',
    links: [
      { name: '纪妖/知妖', url: 'https://www.cbaigui.com/' },
      { name: '食用手册', url: 'https://cook.yunyoujun.cn/' },
      { name: '梦境分析', url: 'http://yume.ly/' },
      { name: '时光邮局', url: 'https://www.hi2future.com/' },
      { name: '折纸手工制作', url: 'https://www.aizhezhi.com/index.html' },
      { name: '去哪生活', url: 'https://guxiang.app/' },
      { name: '哈利波特', url: 'https://www.wizardingworld.com/' },
      { name: '银河系', url: 'https://stars.chromeexperiments.com/' },
      { name: '社会交流平台', url: 'http://www.zanyinjianghu.com' },
    ],
  },
];

export default function LinksPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.map(cat => ({
    ...cat,
    links: cat.links.filter(link =>
      link.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(cat => cat.links.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950">
      {/* 顶部区域 - 视频背景 */}
      <div className="relative overflow-hidden w-full aspect-[4/3] max-h-[500px] bg-[#b8e6d0]">
        {/* 视频背景 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/bear-background.mp4" type="video/mp4" />
        </video>
        
        {/* 半透明遮罩 */}
        <div className="absolute inset-0 bg-white/30 dark:bg-slate-900/40 pointer-events-none" />
        
        {/* 内容 - 垂直居中 */}
        <div className="relative max-w-6xl mx-auto px-4 h-full flex flex-col justify-center">
          {/* 返回按钮 */}
          <Link
            href="/eye"
            className="absolute top-4 left-4 inline-flex items-center gap-2 text-slate-500 hover:text-pink-500 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-sm">返回</span>
          </Link>

          {/* 标题 - 重新设计 */}
          <div className="text-center">
            {/* 标题文字 + 宝箱图标 */}
            <div className="relative inline-flex items-center gap-3 md:gap-4">
              {/* 宝箱图标 - 放在句首 */}
              <div className="relative w-12 h-12 md:w-16 md:h-16 animate-bounce-slow flex-shrink-0">
                <Image
                  src="/images/treasure-chest.png"
                  alt="百宝箱"
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
                {/* 发光效果 */}
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/30 to-transparent rounded-full blur-xl" />
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black tracking-wider">
                <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
                  小付的百宝箱
                </span>
              </h1>
            </div>
            
            {/* 装饰下划线 */}
            <div className="mt-2 mx-auto w-48 md:w-64 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full" />
            
            {/* 副标题 */}
            <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm md:text-base font-medium">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                精选实用网站 · 学习资源 · 趣味工具
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
              </span>
            </p>
          </div>

          {/* 搜索框 - 百度搜索 */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="搜索任何内容，回车即搜..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchTerm.trim()) {
                    window.location.href = `https://www.baidu.com/s?wd=${encodeURIComponent(searchTerm.trim())}`;
                  }
                }}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400 text-slate-700 dark:text-slate-200 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 分类标签 */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === null
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-200'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.name
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* 链接卡片 */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {(activeCategory ? filteredCategories.filter(c => c.name === activeCategory) : filteredCategories).map((category) => (
          <div key={category.name} className="mb-10">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              {category.name}
              <span className="text-xs font-normal text-slate-400 ml-1">{category.links.length}个</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {category.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-100/50 dark:hover:shadow-pink-900/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {link.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-pink-500 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">没有找到匹配的网站</p>
          </div>
        )}
      </div>

      {/* 底部 */}
      <div className="text-center pb-10">
        <p className="text-slate-400 text-xs">💡 点击卡片即可跳转到对应网站</p>
      </div>
    </div>
  );
}
