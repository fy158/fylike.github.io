/**
 * 恋爱日记组件
 * 记录恋爱中的点点滴滴
 */

'use client';

import { useState, useEffect } from 'react';
import { useLoveDiary } from '@/hooks/useMoments';

export default function LoveDiary() {
  const [isDark, setIsDark] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { entries, addEntry, updateEntry, deleteEntry, loading } = useLoveDiary();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const success = await addEntry({
      title: newTitle,
      content: newContent,
      mood: newMood,
      date: new Date().toISOString(),
    });

    if (success) {
      setShowAdd(false);
      setNewTitle('');
      setNewContent('');
      setNewMood('');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const success = await updateEntry(id, {
      title: newTitle,
      content: newContent,
      mood: newMood,
    });

    if (success) {
      setEditingId(null);
      setNewTitle('');
      setNewContent('');
      setNewMood('');
    }
  };

  const startEdit = (entry: typeof entries[0]) => {
    setEditingId(entry.id);
    setNewTitle(entry.title);
    setNewContent(entry.content);
    setNewMood(entry.mood || '');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    love: '🥰',
    calm: '😌',
    sad: '😢',
    excited: '🤩',
    tired: '😴',
  };

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-rose-900/40 to-pink-900/30 border border-rose-500/30' : 'bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
          📖 恋爱日记
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          disabled={loading}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm hover:scale-105 transition-transform disabled:opacity-50"
        >
          + 写日记
        </button>
      </div>

      {/* 添加/编辑日记弹窗 */}
      {(showAdd || editingId) && (
        <div className={`mb-4 p-4 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="日记标题..."
            className={`w-full mb-3 px-3 py-2 rounded-xl ${
              isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="写下今天的故事..."
            className={`w-full mb-3 px-3 py-2 rounded-xl resize-none ${
              isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            rows={4}
          />
          <div className="mb-3">
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>心情</label>
            <div className="flex gap-2">
              {Object.entries(moodEmojis).map(([mood, emoji]) => (
                <button
                  key={mood}
                  onClick={() => setNewMood(mood)}
                  className={`p-2 rounded-lg text-xl transition-all ${
                    newMood === mood ? 'ring-2 ring-rose-400 scale-110' : ''
                  } ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white disabled:opacity-50"
            >
              {editingId ? '更新' : '保存'}
            </button>
            <button
              onClick={() => {
                setShowAdd(false);
                setEditingId(null);
                setNewTitle('');
                setNewContent('');
                setNewMood('');
              }}
              className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 日记列表 */}
      {entries.length > 0 ? (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 rounded-2xl transition-all ${
                isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white hover:bg-rose-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {entry.title}
                    </h4>
                    {entry.mood && moodEmojis[entry.mood] && (
                      <span className="text-lg">{moodEmojis[entry.mood]}</span>
                    )}
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatDate(entry.date)}
                  </p>
                </div>
                {/* 操作按钮 */}
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(entry)}
                    className={`p-1 rounded-lg text-xs ${isDark ? 'hover:bg-blue-900/50 text-blue-400' : 'hover:bg-blue-100 text-blue-500'}`}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className={`p-1 rounded-lg text-xs ${isDark ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-500'}`}
                  >
                    删除
                  </button>
                </div>
              </div>
              {expandedId === entry.id && (
                <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {entry.content}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          还没有日记，开始记录你们的故事吧 💕
        </div>
      )}
    </div>
  );
}
