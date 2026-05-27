/**
 * 情绪记录组件
 * 直观展示情绪变化趋势
 */

'use client';

import { useState, useEffect } from 'react';
import { useEmotionRecords } from '@/hooks/useMoments';

interface EmotionOption {
  id: string;
  icon: string;
  label: string;
}

const emotionOptions: EmotionOption[] = [
  { id: 'happy', icon: '😊', label: '开心' },
  { id: 'love', icon: '🥰', label: '爱意' },
  { id: 'calm', icon: '😌', label: '平静' },
  { id: 'sad', icon: '😢', label: '难过' },
  { id: 'angry', icon: '😤', label: '生气' },
  { id: 'anxious', icon: '😰', label: '焦虑' },
];

const levelColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-emerald-400'];

export default function EmotionTracker() {
  const [isDark, setIsDark] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newLevel, setNewLevel] = useState(3);
  const [newEmotion, setNewEmotion] = useState('happy');
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { records, addRecord, updateRecord, deleteRecord, loading } = useEmotionRecords();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const handleAdd = async () => {
    const emotion = emotionOptions.find(e => e.id === newEmotion);
    if (!emotion) return;

    const success = await addRecord({
      emotionId: emotion.id,
      emotion: emotion.label,
      icon: emotion.icon,
      level: newLevel,
      note: newNote,
    });

    if (success) {
      setShowAdd(false);
      setNewLevel(3);
      setNewEmotion('happy');
      setNewNote('');
    }
  };

  const handleUpdate = async (id: string) => {
    const emotion = emotionOptions.find(e => e.id === newEmotion);
    if (!emotion) return;

    const success = await updateRecord(id, {
      emotionId: emotion.id,
      emotion: emotion.label,
      icon: emotion.icon,
      level: newLevel,
      note: newNote,
    });

    if (success) {
      setEditingId(null);
      setNewLevel(3);
      setNewEmotion('happy');
      setNewNote('');
    }
  };

  const startEdit = (record: typeof records[0]) => {
    setEditingId(record.id);
    setNewEmotion(record.emotionId);
    setNewLevel(record.level);
    setNewNote(record.note || '');
  };

  const getEmotionIcon = (id: string) => {
    return emotionOptions.find(e => e.id === id)?.icon || '😊';
  };

  const getLevelColor = (level: number) => {
    return levelColors[level - 1] || 'bg-gray-400';
  };

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-teal-900/40 to-green-900/30 border border-teal-500/30' : 'bg-gradient-to-br from-teal-50 to-green-50 border border-teal-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
          📊 情绪记录
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          disabled={loading}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 text-white text-sm hover:scale-105 transition-transform disabled:opacity-50"
        >
          + 记录
        </button>
      </div>

      {/* 添加/编辑记录弹窗 */}
      {(showAdd || editingId) && (
        <div className={`mb-4 p-4 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <div className="mb-3">
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>情绪类型</label>
            <div className="flex flex-wrap gap-2">
              {emotionOptions.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setNewEmotion(e.id)}
                  className={`p-2 rounded-lg text-xl transition-all ${
                    newEmotion === e.id ? 'ring-2 ring-teal-400 scale-110' : ''
                  } ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                >
                  {e.icon}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>情绪强度: {newLevel}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={newLevel}
              onChange={(e) => setNewLevel(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="mb-3">
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>备注</label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="写下当时的想法..."
              className={`w-full p-2 rounded-lg text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'}`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-green-500 text-white disabled:opacity-50"
            >
              {editingId ? '更新' : '保存'}
            </button>
            <button
              onClick={() => {
                setShowAdd(false);
                setEditingId(null);
                setNewNote('');
              }}
              className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 情绪图表 */}
      {records.length > 0 ? (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {records.slice(0, 10).map((record) => (
            <div key={record.id} className="flex items-center gap-3 group">
              <span className="text-xl">{getEmotionIcon(record.emotionId)}</span>
              <div className="flex-1 h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getLevelColor(record.level)}`}
                  style={{ width: `${record.level * 20}%` }}
                />
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {new Date(record.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </span>
              {/* 操作按钮 */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(record)}
                  className="p-1 rounded text-xs bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                >
                  编辑
                </button>
                <button
                  onClick={() => deleteRecord(record.id)}
                  className="p-1 rounded text-xs bg-red-500/20 text-red-500 hover:bg-red-500/30"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          还没有记录，点击上方按钮开始记录吧
        </div>
      )}
    </div>
  );
}
