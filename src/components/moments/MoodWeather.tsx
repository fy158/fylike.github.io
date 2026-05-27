/**
 * 心情天气组件
 * 用天气图标表示当前心情状态
 */

'use client';

import { useState, useEffect } from 'react';
import { useMoodWeather } from '@/hooks/useMoments';

interface MoodOption {
  id: string;
  icon: string;
  label: string;
  color: string;
}

const moodOptions: MoodOption[] = [
  { id: 'sunny', icon: '☀️', label: '超级开心', color: 'from-yellow-400 to-orange-400' },
  { id: 'partly-cloudy', icon: '⛅', label: '心情不错', color: 'from-blue-400 to-cyan-400' },
  { id: 'cloudy', icon: '☁️', label: '有点平淡', color: 'from-gray-400 to-gray-500' },
  { id: 'rainy', icon: '🌧️', label: '有点低落', color: 'from-blue-500 to-indigo-500' },
  { id: 'stormy', icon: '⛈️', label: '心情不好', color: 'from-purple-600 to-gray-700' },
  { id: 'rainbow', icon: '🌈', label: '充满希望', color: 'from-pink-400 via-purple-400 to-blue-400' },
];

export default function MoodWeather() {
  const [isDark, setIsDark] = useState(false);
  const [note, setNote] = useState('');
  const { currentMood, saveMood, deleteMood, loading } = useMoodWeather();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  // 同步 note 到 currentMood
  useEffect(() => {
    if (currentMood?.note) {
      setNote(currentMood.note);
    }
  }, [currentMood]);

  const handleSaveMood = async (mood: MoodOption) => {
    const today = new Date().toISOString().split('T')[0];
    await saveMood({
      moodId: mood.id,
      label: mood.label,
      icon: mood.icon,
      color: mood.color,
      note,
      date: today,
    });
  };

  const handleSaveNote = async () => {
    if (currentMood) {
      const today = new Date().toISOString().split('T')[0];
      await saveMood({
        moodId: currentMood.moodId,
        label: currentMood.label,
        icon: currentMood.icon,
        color: currentMood.color,
        note,
        date: today,
      });
    }
  };

  const handleDelete = async () => {
    if (currentMood?.id) {
      await deleteMood(currentMood.id);
      setNote('');
    }
  };

  const currentMoodOption = currentMood 
    ? moodOptions.find(m => m.id === currentMood.moodId)
    : null;

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-cyan-900/40 to-blue-900/30 border border-cyan-500/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
          🌤️ 心情天气
        </h3>
        {currentMood && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`text-xs px-2 py-1 rounded-lg transition-colors ${
              isDark 
                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            清除
          </button>
        )}
      </div>

      {/* 当前心情显示 */}
      {currentMoodOption && (
        <div className={`mb-4 p-4 rounded-2xl text-center bg-gradient-to-r ${currentMoodOption.color} relative`}>
          <div className="text-4xl mb-2">{currentMoodOption.icon}</div>
          <div className="text-white font-medium">{currentMoodOption.label}</div>
          <div className="text-white/70 text-sm">今日心情</div>
          {currentMood?.note && (
            <div className="mt-2 text-white/80 text-sm italic">&ldquo;{currentMood.note}&rdquo;</div>
          )}
        </div>
      )}

      {/* 心情选择 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {moodOptions.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleSaveMood(mood)}
            disabled={loading}
            className={`p-3 rounded-xl text-center transition-all duration-300 hover:scale-105 disabled:opacity-50 ${
              currentMood?.moodId === mood.id
                ? `bg-gradient-to-r ${mood.color} text-white shadow-lg`
                : isDark
                  ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                  : 'bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="text-2xl mb-1">{mood.icon}</div>
            <div className="text-xs">{mood.label}</div>
          </button>
        ))}
      </div>

      {/* 心情备注 */}
      <div className="space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onBlur={handleSaveNote}
          placeholder="写下今天的心情..."
          disabled={loading}
          className={`w-full p-3 rounded-xl text-sm resize-none transition-colors ${
            isDark ? 'bg-white/5 text-white placeholder-gray-500' : 'bg-white text-gray-700 placeholder-gray-400'
          }`}
          rows={2}
        />
      </div>
    </div>
  );
}
