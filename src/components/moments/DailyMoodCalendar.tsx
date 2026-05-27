/**
 * 每日心情标记组件
 * 日历形式展示每天的心情
 */

'use client';

import { useState, useEffect } from 'react';
import { useDailyMoods } from '@/hooks/useMoments';

const moodOptions = [
  { id: 'happy', emoji: '😊', label: '开心', color: 'bg-yellow-400' },
  { id: 'excited', emoji: '🤩', label: '兴奋', color: 'bg-orange-400' },
  { id: 'calm', emoji: '😌', label: '平静', color: 'bg-green-400' },
  { id: 'tired', emoji: '😴', label: '疲惫', color: 'bg-blue-400' },
  { id: 'sad', emoji: '😢', label: '难过', color: 'bg-indigo-400' },
  { id: 'angry', emoji: '😤', label: '生气', color: 'bg-red-400' },
];

export default function DailyMoodCalendar() {
  const [isDark, setIsDark] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState('happy');
  const [note, setNote] = useState('');

  const { moods, saveMood, deleteMood, refresh } = useDailyMoods();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    refresh(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }, [currentDate, refresh]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const getMoodForDate = (dateStr: string) => {
    return moods.find(m => m.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    const existing = getMoodForDate(dateStr);
    if (existing) {
      setSelectedMood(existing.mood);
      setNote(existing.note || '');
    } else {
      setSelectedMood('happy');
      setNote('');
    }
  };

  const handleSave = async () => {
    if (!selectedDate) return;
    const mood = moodOptions.find(m => m.id === selectedMood);
    if (!mood) return;

    await saveMood({
      date: selectedDate,
      mood: selectedMood,
      emoji: mood.emoji,
      note,
    });
    setSelectedDate(null);
  };

  const handleDelete = async () => {
    if (!selectedDate) return;
    const existing = getMoodForDate(selectedDate);
    if (existing?.id) {
      await deleteMood(existing.id);
    }
    setSelectedDate(null);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-violet-900/40 to-purple-900/30 border border-violet-500/30' : 'bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-violet-300' : 'text-violet-700'}`}>
          📅 每日心情标记
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>←</button>
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {year}年{month + 1}月
          </span>
          <button onClick={nextMonth} className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>→</button>
        </div>
      </div>

      {/* 心情选择弹窗 */}
      {selectedDate && (
        <div className={`mb-4 p-4 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {selectedDate} 的心情
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {moodOptions.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`p-2 rounded-lg text-xl transition-all ${
                  selectedMood === m.id ? 'ring-2 ring-violet-400 scale-110' : ''
                } ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                title={m.label}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="备注（可选）..."
            className={`w-full mb-3 px-3 py-2 rounded-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white">
              保存
            </button>
            {getMoodForDate(selectedDate) && (
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500 text-white">
                删除
              </button>
            )}
            <button onClick={() => setSelectedDate(null)} className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
              取消
            </button>
          </div>
        </div>
      )}

      {/* 日历 */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className={`text-center text-xs py-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {day}
          </div>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const mood = getMoodForDate(dateStr);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                isToday ? 'ring-2 ring-violet-400' : ''
              } ${mood ? moodOptions.find(m => m.id === mood.mood)?.color + ' text-white' : isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-gray-50'}`}
            >
              <span className="text-xs">{day}</span>
              {mood && <span className="text-lg">{mood.emoji}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
