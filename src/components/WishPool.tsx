/**
 * 许愿池组件
 * 用户可以写下愿望，愿望以卡片形式展示
 * 从 API 获取和提交数据
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Wish {
  id: string;
  content: string;
  author: string;
  likes: number;
  borderColor: string;
  emoji: string;
  createdAt: string;
}

const BORDER_COLORS = [
  'linear-gradient(135deg, #ff6b9d, #c084fc)',
  'linear-gradient(135deg, #f472b6, #818cf8)',
  'linear-gradient(135deg, #fb7185, #60a5fa)',
  'linear-gradient(135deg, #e879f9, #f472b6)',
  'linear-gradient(135deg, #c084fc, #fb7185)',
  'linear-gradient(135deg, #f9a8d4, #a78bfa)',
];

const DECORATION_EMOJIS = ['🌟', '💫', '✨', '💝', '🌹', '🌸', '💕', '🎀'];

// 确定性分配：基于 id 的 hash 来选择颜色和 emoji
function getBorderColorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return BORDER_COLORS[Math.abs(hash) % BORDER_COLORS.length];
}

function getEmojiForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return DECORATION_EMOJIS[Math.abs(hash) % DECORATION_EMOJIS.length];
}

function getRandomBorderColor(): string {
  return BORDER_COLORS[Math.floor(Math.random() * BORDER_COLORS.length)];
}

function getRandomEmoji(): string {
  return DECORATION_EMOJIS[Math.floor(Math.random() * DECORATION_EMOJIS.length)];
}

export default function WishPool() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newWish, setNewWish] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const sparkleIdRef = useRef(0);

  // 从 API 加载愿望
  useEffect(() => {
    const fetchWishes = async () => {
      try {
        // 添加超时控制
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(`/api/wishes?_t=${Date.now()}`, { 
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          const data = await res.json();
          // 为每个愿望补充 borderColor 和 emoji
          const enriched = data.map((w: { id: string; content: string; author: string; likes: number; createdAt: string }) => ({
            ...w,
            borderColor: getBorderColorForId(w.id),
            emoji: getEmojiForId(w.id),
          }));
          setWishes(enriched);
        }
      } catch (error) {
        console.error('获取愿望失败:', error);
        // 出错时设置空数组，避免一直显示 loading
        setWishes([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWishes();
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newWish.trim(),
          author: authorName.trim() || '匿名用户',
        }),
      });

      if (res.ok) {
        const created = await res.json();
        const wish: Wish = {
          ...created,
          borderColor: getRandomBorderColor(),
          emoji: getRandomEmoji(),
        };
        setWishes(prev => [wish, ...prev]);
        setNewWish('');
        setAuthorName('');

        setShowSuccess(true);
        const newSparkles = Array.from({ length: 8 }, () => ({
          id: sparkleIdRef.current++,
          x: Math.random() * 100,
          y: Math.random() * 100,
        }));
        setSparkles(newSparkles);

        setTimeout(() => {
          setShowSuccess(false);
          setSparkles([]);
        }, 2000);
      }
    } catch (error) {
      console.error('提交愿望失败:', error);
    }

    setIsSubmitting(false);
  }, [newWish, authorName]);

  const handleLike = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'POST',
      });
      if (res.ok) {
        setWishes(prev => prev.map(wish =>
          wish.id === id ? { ...wish, likes: wish.likes + 1 } : wish
        ));
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setWishes(prev => prev.filter(wish => wish.id !== id));
      }
    } catch (error) {
      console.error('删除失败:', error);
    }
  }, []);

  if (isLoading) {
    return (
      <section id="wishpool" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              <span className="gradient-text">许愿池</span>
            </h2>
            <p className="text-gray-500">写下你的心愿，让美好发生</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-md p-5 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="wishpool" className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
            {/* 外圈光晕动画 */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300/40 to-purple-400/40 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-pink-200/30 to-purple-300/30 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.3s' }} />
            {/* 许愿瓶图标 */}
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-100/80 to-purple-100/80 shadow-lg shadow-pink-300/30 flex items-center justify-center overflow-hidden">
              <img 
                src="/images/wish-bottle.png" 
                alt="许愿瓶" 
                className="w-16 h-16 object-contain drop-shadow-md animate-float"
              />
            </div>
            {/* 小星星装饰 */}
            <div className="absolute -top-1 -right-1 text-yellow-300 text-sm animate-pulse">✨</div>
            <div className="absolute -bottom-1 -left-1 text-pink-300 text-sm animate-pulse" style={{ animationDelay: '0.5s' }}>💫</div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="gradient-text">许愿池</span>
          </h2>
          <p className="text-gray-500">写下你的心愿，让美好发生</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-pink-50 dark:bg-[#1a1a2e] rounded-full">
            <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              已收集 <strong className="text-pink-500">{wishes.length}</strong> 个美好愿望
            </span>
          </div>
        </div>

        {/* 成功提示动画 */}
        {showSuccess && (
          <div className="fixed inset-0 z-[10001] pointer-events-none flex items-center justify-center">
            {sparkles.map(s => (
              <div
                key={s.id}
                className="absolute animate-sparkle text-2xl"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                ✨
              </div>
            ))}
            <div className="bg-white dark:bg-[#16213e] rounded-2xl shadow-2xl px-8 py-6 text-center animate-fade-in">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">愿望已送达！</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">愿你的心愿早日实现</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 许愿输入区域 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                许下心愿
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                    你的心愿
                  </label>
                  <textarea
                    value={newWish}
                    onChange={(e) => setNewWish(e.target.value)}
                    placeholder="写下你的美好愿望..."
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none resize-none h-32 transition-all"
                    maxLength={200}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {newWish.length}/200
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    昵称（选填）
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="匿名用户"
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    maxLength={20}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!newWish.trim() || isSubmitting}
                  className={`
                    w-full py-3 rounded-xl font-medium text-white
                    transition-all duration-300 flex items-center justify-center gap-2
                    ${newWish.trim() && !isSubmitting
                      ? 'bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 shadow-lg shadow-pink-300'
                      : 'bg-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      发送中...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                      许下心愿
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* 愿望展示区域 */}
          <div className="lg:col-span-2">
            {wishes.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {/* 固定展示的愿望 */}
                <div
                  className="wish-card bg-white rounded-xl shadow-md p-5 relative overflow-hidden group"
                  style={{
                    borderLeft: `4px solid transparent`,
                    borderImage: 'linear-gradient(135deg, #f472b6, #818cf8)',
                    borderImageSlice: 1,
                  }}
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full opacity-50" />
                  <div className="absolute top-3 right-3 text-lg opacity-60">✨</div>
                  <div className="relative">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      &ldquo;每一个愿望都是一颗星星，终将照亮你的夜空&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>许愿池</span>
                      </div>
                      <div className="flex items-center gap-1 text-pink-400">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>∞</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="wish-card bg-white rounded-xl shadow-md p-5 relative overflow-hidden group"
                  style={{
                    borderLeft: `4px solid transparent`,
                    borderImage: 'linear-gradient(135deg, #c084fc, #fb7185)',
                    borderImageSlice: 1,
                  }}
                >
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-50 rounded-full opacity-50" />
                  <div className="absolute top-3 right-3 text-lg opacity-60">💫</div>
                  <div className="relative">
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      &ldquo;愿你所求皆如愿，所行皆坦途&rdquo;
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span>许愿池</span>
                      </div>
                      <div className="flex items-center gap-1 text-pink-400">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span>∞</span>
                      </div>
                    </div>
                  </div>
                </div>

                {wishes.map((wish, index) => (
                  <div
                    key={wish.id}
                    className="wish-card bg-white rounded-xl shadow-md p-5 relative overflow-hidden group"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      borderLeft: `4px solid transparent`,
                      borderImage: wish.borderColor,
                      borderImageSlice: 1,
                    }}
                  >
                    {/* 装饰背景 */}
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full opacity-50" />

                    {/* 装饰emoji */}
                    <div className="absolute top-3 right-3 text-lg opacity-60">
                      {wish.emoji}
                    </div>

                    {/* 删除按钮 - 悬停显示 */}
                    <button
                      onClick={() => handleDelete(wish.id)}
                      className="absolute top-3 left-3 w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs"
                      title="删除"
                    >
                      ✕
                    </button>

                    <div className="relative">
                      {/* 愿望内容 */}
                      <p className="text-gray-700 mb-4 leading-relaxed">
                        &ldquo;{wish.content}&rdquo;
                      </p>

                      {/* 底部信息 */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <span>{wish.author}</span>
                        </div>

                        {/* 点赞按钮 */}
                        <button
                          onClick={() => handleLike(wish.id)}
                          className="flex items-center gap-1 text-pink-400 hover:text-pink-600 transition-colors group/like"
                        >
                          <svg className="w-5 h-5 group-hover/like:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span>{wish.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💫</div>
                <p className="text-gray-500">还没有愿望，快来许下第一个吧！</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
