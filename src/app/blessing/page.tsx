'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import MusicPlayer from '@/components/MusicPlayer';
import SakuraPetals from '@/components/SakuraPetals';
import MouseFollower from '@/components/MouseFollower';

// 等级系统 - 修仙风格但保持粉紫色调
const LEVELS = [
  { name: '初心', color: '#94a3b8', borderColor: 'border-slate-300', textColor: 'text-slate-500', minCount: 0 },
  { name: '甜蜜', color: '#f472b6', borderColor: 'border-pink-300', textColor: 'text-pink-500', minCount: 1 },
  { name: '幸福', color: '#ec4899', borderColor: 'border-pink-400', textColor: 'text-pink-600', minCount: 3 },
  { name: '永恒', color: '#d946ef', borderColor: 'border-fuchsia-400', textColor: 'text-fuchsia-600', minCount: 5 },
  { name: '神仙眷侣', color: '#a855f7', borderColor: 'border-purple-400', textColor: 'text-purple-600', minCount: 10 },
];

function getLevel(count: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (count >= LEVELS[i].minCount) return LEVELS[i];
  }
  return LEVELS[0];
}

interface Reply {
  id: string;
  author: string;
  content: string;
  date: string;
  to?: string;
}

interface Blessing {
  id: string;
  author: string;
  content: string;
  date: string;
  replies: Reply[];
  avatarColor: string;
  isVIP?: boolean;
}

const AVATAR_COLORS = [
  'from-pink-400 to-rose-400',
  'from-purple-400 to-pink-400',
  'from-blue-400 to-purple-400',
  'from-green-400 to-teal-400',
  'from-orange-400 to-red-400',
  'from-indigo-400 to-blue-400',
  'from-yellow-400 to-orange-400',
  'from-cyan-400 to-blue-400',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// 更多初始数据
const initialBlessings: Blessing[] = [
  {
    id: '1', author: '灵宝', isVIP: true,
    content: '祝你钱包鼓得像刚吹饱的气球，快乐多到手机相册装不下，奶茶永远第二杯半价！',
    date: '2026-05-17',
    replies: [
      { id: 'r1', author: 'Elara', content: '哈哈哈哈同问！我已经把收红包的二维码贴手机壳背面三天了', date: '2026-05-17', to: '灵宝' },
      { id: 'r2', author: '灵宝', content: '要不咱组队去蹲官方？说不定能蹭到几个红包', date: '2026-05-17', to: 'Elara' },
    ],
    avatarColor: 'from-pink-400 to-rose-400',
  },
  { id: '2', author: 'fx159357', content: '美美哒，祝福你们永远幸福！', date: '2025-11-25', replies: [], avatarColor: 'from-purple-400 to-pink-400' },
  { id: '3', author: 'labixiaoxin', content: '幸福永远，百年好合！', date: '2025-10-25', replies: [{ id: 'r3', author: 'Sara', content: '谢谢祝福！', date: '2025-10-26' }], avatarColor: 'from-blue-400 to-purple-400' },
  { id: '4', author: '竟汐', isVIP: true, content: '竟汐的眼里只有望榆 全世界最好的望榆', date: '2025-10-01', replies: [], avatarColor: 'from-green-400 to-teal-400' },
  { id: '5', author: 'axmaple', content: '₍˄·͈༝·͈˄*₎◞ ̑̑ 太甜了！', date: '2025-09-15', replies: [], avatarColor: 'from-orange-400 to-red-400' },
  { id: '6', author: 'bob1', content: '长长久久，百年好合(๑˃́ꇴ˂̀๑)', date: '2025-08-20', replies: [{ id: 'r4', author: '春风不解风情', content: '祝福你们！', date: '2025-08-21' }], avatarColor: 'from-indigo-400 to-blue-400' },
  { id: '7', author: '春风不解风情', content: '愿你们的爱情像春天一样温暖，像夏天一样热烈！', date: '2025-05-09', replies: [], avatarColor: 'from-yellow-400 to-orange-400' },
  { id: '8', author: 'lumenglover', content: '百年好合，早生贵子！', date: '2025-04-22', replies: [], avatarColor: 'from-cyan-400 to-blue-400' },
  { id: '9', author: 'ssh123', content: '666，这波操作太秀了！', date: '2025-03-15', replies: [], avatarColor: 'from-pink-400 to-purple-400' },
  { id: '10', author: 'Sara', content: '写下你的祝福吧~ 期待看到更多美好的祝福！', date: '2025-12-28', replies: [{ id: 'r5', author: '小明', content: '来了来了！', date: '2025-12-29' }], avatarColor: 'from-rose-400 to-pink-400' },
  { id: '11', author: '小雨', content: '祝你们甜甜蜜蜜，每天都像在谈恋爱！', date: '2025-11-10', replies: [], avatarColor: 'from-pink-400 to-rose-400' },
  { id: '12', author: '阳光', isVIP: true, content: '看到你们这么幸福，我也相信爱情了！', date: '2025-10-05', replies: [{ id: 'r6', author: '星星', content: '是啊是啊！', date: '2025-10-06' }], avatarColor: 'from-purple-400 to-pink-400' },
  { id: '13', author: '月亮', content: '愿你们像月亮和星星一样，永远相伴！', date: '2025-09-20', replies: [], avatarColor: 'from-blue-400 to-purple-400' },
  { id: '14', author: '花花', content: '祝福祝福！要一直幸福下去哦！', date: '2025-08-15', replies: [], avatarColor: 'from-green-400 to-teal-400' },
  { id: '15', author: '小草', content: '愿你们的爱情像小草一样坚韧，生生不息！', date: '2025-07-30', replies: [{ id: 'r7', author: '大树', content: '说得好！', date: '2025-07-31' }], avatarColor: 'from-orange-400 to-red-400' },
];

// ========== 弹幕组件 - 高密度、半透明深色 ==========
function DanmakuBar({ blessings }: { blessings: Blessing[] }) {
  const [mounted, setMounted] = useState(false);
  
  // 预生成静态弹幕数据（避免 hydration 不匹配）
  const staticItems = useMemo(() => {
    return blessings.slice(0, 6).map((b, i) => ({
      id: `static-${b.id}-${i}`,
      blessing: b,
      lane: i % 5,
      duration: 12 + (i % 5),
      delay: i * 1.2,
    }));
  }, [blessings]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-pink-800/30 backdrop-blur-sm" />
    );
  }

  return (
    <div className="relative h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-pink-800/30 backdrop-blur-sm">
      {staticItems.map((item) => (
        <div
          key={item.id}
          className="absolute whitespace-nowrap"
          style={{
            top: `${10 + item.lane * 16}%`,
            animationName: 'danmaku-scroll',
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationIterationCount: 'infinite',
          }}
        >
          <div className="inline-flex items-center gap-2 bg-black/50 dark:bg-black/60 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/10">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${item.blessing.avatarColor} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
              {item.blessing.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-white/95 text-sm font-medium">
              {item.blessing.author}：{item.blessing.content.length > 18 ? item.blessing.content.slice(0, 18) + '…' : item.blessing.content}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ========== 回复组件 - 直接嵌套显示 ==========
function ReplySection({
  replies, blessingId, onReply, author,
}: {
  replies: Reply[]; blessingId: string;
  onReply: (id: string, content: string, to?: string) => void;
  author: string;
}) {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | undefined>(undefined);
  const [showInput, setShowInput] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    onReply(blessingId, text.trim(), replyTo);
    setText('');
    setReplyTo(undefined);
    setShowInput(false);
  };

  const highlightMention = (content: string) => {
    const parts = content.split(/(@\S+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-blue-500 font-medium">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="mt-4">
      {/* 回复列表 - 直接嵌套显示 */}
      {replies.length > 0 && (
        <div className="space-y-3 pl-4 border-l-2 border-pink-200/50 dark:border-pink-800/30">
          {replies.map((r, index) => (
            <div 
              key={r.id} 
              className="flex gap-3 animate-reply-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(r.author)} flex items-center justify-center text-white font-bold text-xs flex-shrink-0`}>
                {r.author.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">{r.author}</span>
                  {r.to && <span className="text-blue-500 text-xs font-medium">@{r.to}</span>}
                  <span className="text-xs text-gray-300 dark:text-gray-600">{r.date}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                  {highlightMention(r.content)}
                </p>
                <button
                  onClick={() => { setReplyTo(r.author); setShowInput(true); }}
                  className="text-xs text-pink-400 hover:text-pink-500 mt-1 transition-colors"
                >
                  回复
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 回复输入框 */}
      {showInput && (
        <div className="mt-4 flex gap-2 animate-fade-in">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={replyTo ? `回复 ${replyTo}...` : '写下回复...'}
            className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-[#1a1a2e] border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
            autoFocus
          />
          <button
            onClick={submit}
            disabled={!text.trim()}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            发送
          </button>
          <button 
            onClick={() => { setText(''); setReplyTo(undefined); setShowInput(false); }}
            className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            取消
          </button>
        </div>
      )}

      {/* 回复按钮 */}
      {!showInput && (
        <button
          onClick={() => setShowInput(true)}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-full text-xs font-medium hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
          {replies.length > 0 ? `回复 (${replies.length})` : '回复'}
        </button>
      )}
    </div>
  );
}

// ========== 主页面 ==========
export default function BlessingPage() {
  const [blessings, setBlessings] = useState<Blessing[]>(initialBlessings);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (newlyAddedId) {
      const t = setTimeout(() => setNewlyAddedId(null), 2000);
      return () => clearTimeout(t);
    }
  }, [newlyAddedId]);

  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    const newBlessing: Blessing = {
      id: String(Date.now()),
      author: author.trim(),
      content: content.trim(),
      date: today(),
      replies: [],
      avatarColor: getAvatarColor(author.trim()),
    };
    setBlessings(prev => [newBlessing, ...prev]);
    setNewlyAddedId(newBlessing.id);
    setAuthor('');
    setContent('');
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2500);
  };

  const handleReply = (blessingId: string, content: string, to?: string) => {
    setBlessings(prev => prev.map(b => b.id === blessingId ? {
      ...b,
      replies: [...b.replies, { id: `r-${Date.now()}`, author: author.trim() || '匿名', content, date: today(), to }],
    } : b));
  };

  // 统计每个作者的祝福数
  const authorCounts = useRef<Record<string, number>>({});
  blessings.forEach(b => { authorCounts.current[b.author] = (authorCounts.current[b.author] || 0) + 1; });

  // 撒花效果
  const ConfettiEffect = () => {
    if (!showConfetti) return null;
    const colors = ['#ff6b9d', '#c084fc', '#f472b6', '#fb7185', '#e879f9'];
    return (
      <div className="fixed inset-0 pointer-events-none z-50">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animationDelay: `${Math.random() * 0.4}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`,
            }}
          >
            <div
              className="rounded-full animate-spin-slow"
              style={{
                width: 5 + Math.random() * 7,
                height: 5 + Math.random() * 7,
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  // 高亮@提及
  const highlightMention = (content: string) => {
    const parts = content.split(/(@\S+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-blue-500 font-medium">{part}</span>;
      }
      return part;
    });
  };

  return (
    <main className="min-h-screen bg-[#fff5f7] dark:bg-[#1a1a2e] transition-colors duration-500">
      <SakuraPetals />
      <MouseFollower />
      <ThemeToggle />
      <MusicPlayer />
      <ConfettiEffect />

      {/* ====== 页面内容 ====== */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-24 relative z-10">

        {/* 标题区 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">
            💕 祝福板
          </h1>
          <p className="text-gray-400 dark:text-gray-500 text-base">
            留下你们的祝福，见证这份美好
          </p>
        </div>

        {/* 弹幕区 - 高密度深色半透明 */}
        <div className="mb-10">
          <DanmakuBar blessings={blessings} />
        </div>

        {/* 写祝福表单 - 毛玻璃效果 */}
        <div className="mb-10 bg-white/80 dark:bg-[#16213e]/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-pink-100/50 dark:border-pink-900/20">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-xl">💌</span>
            <span className="text-base font-semibold text-gray-700 dark:text-gray-200">写下祝福</span>
            <div className="flex-1" />
            <span className="text-sm text-gray-400">
              共 <span className="text-pink-500 font-bold">{blessings.length}</span> 条祝福
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="昵称"
                maxLength={20}
                className="w-32 flex-shrink-0 px-4 py-3 rounded-xl bg-pink-50/60 dark:bg-[#1a1a2e] border border-pink-100/50 dark:border-gray-700/50 text-base text-gray-700 dark:text-gray-200 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你的祝福... 试试 @用户名 提及TA"
                rows={3}
                maxLength={200}
                className="flex-1 px-4 py-3 rounded-xl bg-pink-50/60 dark:bg-[#1a1a2e] border border-pink-100/50 dark:border-gray-700/50 text-base text-gray-700 dark:text-gray-200 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all resize-none leading-relaxed"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{content.length}/200</span>
              <button
                type="submit"
                disabled={!author.trim() || !content.trim()}
                className={`px-6 py-2.5 rounded-full text-base font-medium text-white transition-all duration-300 ${
                  author.trim() && content.trim()
                    ? 'bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 shadow-md shadow-pink-200/50 hover:shadow-lg active:scale-95'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                发送 ✨
              </button>
            </div>
          </form>
        </div>

        {/* 祝福列表 - 白色卡片风格 */}
        <div className="space-y-4">
          {blessings.map((blessing, index) => {
            const level = getLevel(authorCounts.current[blessing.author] || 0);
            return (
              <div
                key={blessing.id}
                className={`
                  bg-white dark:bg-[#1e2130] rounded-2xl p-6 shadow-sm
                  border border-gray-100 dark:border-gray-800
                  transition-all duration-300 hover:shadow-md
                  ${newlyAddedId === blessing.id ? 'animate-blessing-fade-in ring-2 ring-pink-300/50' : 'animate-card-enter'}
                `}
                style={{ animationDelay: `${Math.min(index, 5) * 0.08}s` }}
              >
                <div className="flex gap-4">
                  {/* 头像 */}
                  <div className="flex-shrink-0 relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${blessing.avatarColor} flex items-center justify-center text-white font-bold text-base shadow-md`}>
                      {blessing.author.charAt(0).toUpperCase()}
                    </div>
                    {blessing.isVIP && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-sm">
                        VIP
                      </div>
                    )}
                  </div>

                  {/* 内容区 */}
                  <div className="flex-1 min-w-0">
                    {/* 用户名 + 等级 + 日期 */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-gray-800 dark:text-gray-200 text-base">
                        {blessing.author}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${level.borderColor} ${level.textColor} bg-white dark:bg-transparent`}>
                        {level.name}
                      </span>
                      <span className="text-sm text-gray-300 dark:text-gray-600">{blessing.date}</span>
                    </div>

                    {/* 祝福正文 */}
                    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed break-words">
                      {highlightMention(blessing.content)}
                    </p>

                    {/* 回复区域 */}
                    <ReplySection
                      replies={blessing.replies}
                      blessingId={blessing.id}
                      onReply={handleReply}
                      author={author}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {blessings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">💌</p>
            <p className="text-gray-400 dark:text-gray-500 text-base">还没有祝福，快来写下第一条吧~</p>
          </div>
        )}
      </div>

      {/* 动画样式 */}
      <style>{`
        @keyframes danmaku-scroll {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        @keyframes blessing-fade-in {
          0% { opacity: 0; transform: translateY(-15px) scale(0.98); }
          50% { opacity: 1; transform: translateY(5px) scale(1.01); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes card-enter {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes reply-slide-in {
          0% { opacity: 0; transform: translateX(-15px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes confetti-fall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(100vh) rotate(720deg); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-danmaku-scroll { 
          animation: danmaku-scroll linear forwards; 
          will-change: transform;
        }
        .animate-blessing-fade-in { 
          animation: blessing-fade-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; 
        }
        .animate-card-enter { 
          animation: card-enter 0.5s ease-out forwards; 
          opacity: 0;
        }
        .animate-reply-slide-in {
          animation: reply-slide-in 0.4s ease-out forwards;
          opacity: 0;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-confetti-fall { 
          animation: confetti-fall 2.5s ease-in forwards; 
        }
        .animate-spin-slow { 
          animation: spin-slow 1s linear infinite; 
        }
        .gradient-text {
          background: linear-gradient(135deg, #ec4899, #f43f5e, #ec4899);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </main>
  );
}
