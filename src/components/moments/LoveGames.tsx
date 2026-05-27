/**
 * 恋爱互动小游戏组件
 * 包含多种互动小游戏：猜心游戏、爱情问答、真心话大冒险等
 */

'use client';

import { useState, useEffect } from 'react';

interface Game {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const games: Game[] = [
  { id: 'guess-heart', name: '猜心游戏', icon: '💝', description: '猜猜对方心里在想什么' },
  { id: 'love-quiz', name: '爱情问答', icon: '❓', description: '回答关于我们的问题' },
  { id: 'truth-dare', name: '真心话大冒险', icon: '🎯', description: '随机抽取真心话或大冒险' },
  { id: 'love-meter', name: '爱情温度计', icon: '🌡️', description: '测试今天的爱情温度' },
];

// 爱情问答题目
const loveQuestions = [
  { q: '我们第一次见面是在哪里？', hint: '想想那个特别的地方' },
  { q: '对方最喜欢的食物是什么？', hint: '想想ta平时最爱吃什么' },
  { q: '我们第一次约会做了什么？', hint: '回忆那美好的一天' },
  { q: '对方最怕什么？', hint: '每个人都有害怕的东西' },
  { q: '我们最难忘的回忆是什么？', hint: '想想印象最深的事' },
  { q: '对方最喜欢什么颜色？', hint: '观察ta平时的穿着' },
  { q: '我们在一起多久了？', hint: '数数那些美好的日子' },
  { q: '对方最大的优点是什么？', hint: 'ta身上最闪亮的地方' },
];

// 真心话大冒险题目
const truthQuestions = [
  '说出对方让你最感动的三件事',
  '描述一下你理想中和ta的未来',
  '说出一个你从未告诉过ta的小秘密',
  '如果可以回到过去，你想改变什么？',
  '说出ta让你最心动的瞬间',
  '你觉得ta什么时候最可爱？',
];

const dareQuestions = [
  '给对方发一条甜蜜的消息',
  '模仿对方的一个招牌动作',
  '唱一首情歌给ta听',
  '说出十个爱ta的理由',
  '做一个搞怪的表情让ta笑',
  '给对方一个大大的拥抱',
];

export default function LoveGames() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  
  // 猜心游戏状态
  const [guessNumber, setGuessNumber] = useState('');
  const [guessResult, setGuessResult] = useState<string | null>(null);
  const [targetNumber] = useState(() => Math.floor(Math.random() * 10) + 1);
  
  // 爱情问答状态
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  // 真心话大冒险状态
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<'truth' | 'dare' | null>(null);
  
  // 爱情温度计状态
  const [loveTemp, setLoveTemp] = useState<number | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const handleGuessHeart = () => {
    const guess = parseInt(guessNumber);
    if (guess === targetNumber) {
      setGuessResult('🎉 太棒了！你真的懂ta的心！');
    } else if (Math.abs(guess - targetNumber) <= 2) {
      setGuessResult('😊 很接近了，你们心有灵犀！');
    } else {
      setGuessResult(`😅 答案是 ${targetNumber}，再试试看？`);
    }
  };

  const handleLoveMeter = () => {
    // 随机生成一个 80-100 之间的温度
    const temp = Math.floor(Math.random() * 21) + 80;
    setLoveTemp(temp);
  };

  const handleTruthDare = (type: 'truth' | 'dare') => {
    const questions = type === 'truth' ? truthQuestions : dareQuestions;
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentTask(questions[randomIndex]);
    setTaskType(type);
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % loveQuestions.length);
    setShowAnswer(false);
  };

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/30 border border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'
    }`}>
      <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
        🎮 恋爱互动游戏
      </h3>

      {!activeGame ? (
        // 游戏选择列表
        <div className="grid grid-cols-2 gap-3">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game.id)}
              className={`p-4 rounded-2xl text-left transition-all duration-300 hover:scale-105 ${
                isDark 
                  ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                  : 'bg-white hover:bg-pink-50 border border-pink-100 shadow-sm'
              }`}
            >
              <div className="text-2xl mb-2">{game.icon}</div>
              <div className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{game.name}</div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{game.description}</div>
            </button>
          ))}
        </div>
      ) : (
        // 游戏内容区域
        <div className="space-y-4">
          {/* 返回按钮 */}
          <button
            onClick={() => {
              setActiveGame(null);
              setGuessResult(null);
              setGuessNumber('');
              setCurrentTask(null);
              setLoveTemp(null);
            }}
            className={`text-sm flex items-center gap-1 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ← 返回游戏列表
          </button>

          {/* 猜心游戏 */}
          {activeGame === 'guess-heart' && (
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white'}`}>
              <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>
                💝 猜心游戏
              </h4>
              <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                ta心里想了一个 1-10 的数字，你能猜中吗？
              </p>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guessNumber}
                  onChange={(e) => setGuessNumber(e.target.value)}
                  placeholder="输入数字"
                  className={`w-24 px-3 py-2 rounded-xl text-center ${
                    isDark ? 'bg-gray-800 text-white border border-gray-600' : 'bg-gray-100 text-gray-800 border border-gray-300'
                  }`}
                />
                <button
                  onClick={handleGuessHeart}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 transition-transform"
                >
                  猜一猜
                </button>
              </div>
              {guessResult && (
                <p className={`mt-4 text-lg font-medium ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>
                  {guessResult}
                </p>
              )}
            </div>
          )}

          {/* 爱情问答 */}
          {activeGame === 'love-quiz' && (
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white'}`}>
              <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>
                ❓ 爱情问答
              </h4>
              <div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-pink-900/30' : 'bg-pink-100'}`}>
                <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {loveQuestions[currentQuestion].q}
                </p>
              </div>
              {showAnswer && (
                <p className={`mb-4 italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  💡 提示：{loveQuestions[currentQuestion].hint}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAnswer(true)}
                  className={`px-4 py-2 rounded-xl ${
                    isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  看提示
                </button>
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-105 transition-transform"
                >
                  下一题
                </button>
              </div>
            </div>
          )}

          {/* 真心话大冒险 */}
          {activeGame === 'truth-dare' && (
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white'}`}>
              <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>
                🎯 真心话大冒险
              </h4>
              {!currentTask ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTruthDare('truth')}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all hover:scale-105 ${
                      isDark ? 'bg-blue-600/50 text-white' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    💬 真心话
                  </button>
                  <button
                    onClick={() => handleTruthDare('dare')}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all hover:scale-105 ${
                      isDark ? 'bg-red-600/50 text-white' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    🔥 大冒险
                  </button>
                </div>
              ) : (
                <div className={`p-4 rounded-xl ${taskType === 'truth' ? (isDark ? 'bg-blue-900/30' : 'bg-blue-50') : (isDark ? 'bg-red-900/30' : 'bg-red-50')}`}>
                  <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {taskType === 'truth' ? '💬 ' : '🔥 '}{currentTask}
                  </p>
                  <button
                    onClick={() => setCurrentTask(null)}
                    className={`mt-4 px-4 py-2 rounded-xl text-sm ${
                      isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    再抽一次
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 爱情温度计 */}
          {activeGame === 'love-meter' && (
            <div className={`p-6 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white'}`}>
              <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-pink-300' : 'text-pink-600'}`}>
                🌡️ 爱情温度计
              </h4>
              {loveTemp === null ? (
                <div className="text-center">
                  <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    测测今天的爱情温度吧！
                  </p>
                  <button
                    onClick={handleLoveMeter}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-lg font-medium hover:scale-105 transition-transform"
                  >
                    开始测量
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? '#333' : '#e5e7eb'} strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" 
                        stroke="url(#tempGradient)" strokeWidth="8" 
                        strokeDasharray={`${loveTemp * 2.83} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="tempGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-3xl font-bold ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
                        {loveTemp}°
                      </span>
                    </div>
                  </div>
                  <p className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {loveTemp >= 95 ? '🔥 热恋中！爱情燃烧吧！' :
                     loveTemp >= 85 ? '💕 甜蜜蜜，幸福满满' :
                     '❤️ 温馨浪漫，细水长流'}
                  </p>
                  <button
                    onClick={() => setLoveTemp(null)}
                    className={`mt-4 px-4 py-2 rounded-xl text-sm ${
                      isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    再测一次
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
