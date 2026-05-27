/**
 * 纪念日日历组件
 * 展示重要纪念日
 */

'use client';

import { useState, useEffect } from 'react';
import { useAnniversaries } from '@/hooks/useMoments';

const iconOptions = [
  { icon: '🎂', label: '生日' },
  { icon: '💕', label: '恋爱' },
  { icon: '💍', label: '结婚' },
  { icon: '🎉', label: '庆祝' },
  { icon: '🌸', label: '春天' },
  { icon: '🌻', label: '夏天' },
  { icon: '🍂', label: '秋天' },
  { icon: '❄️', label: '冬天' },
];

const colorOptions = [
  { value: 'from-pink-400 to-rose-400', label: '粉红' },
  { value: 'from-purple-400 to-indigo-400', label: '紫色' },
  { value: 'from-blue-400 to-cyan-400', label: '蓝色' },
  { value: 'from-green-400 to-emerald-400', label: '绿色' },
  { value: 'from-yellow-400 to-orange-400', label: '橙色' },
  { value: 'from-red-400 to-pink-400', label: '红色' },
];

export default function AnniversaryCalendar() {
  const [isDark, setIsDark] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('🎉');
  const [newColor, setNewColor] = useState('from-pink-400 to-rose-400');
  const [newIsRecurring, setNewIsRecurring] = useState(true);

  const { anniversaries, addAnniversary, updateAnniversary, deleteAnniversary, loading } = useAnniversaries();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newDate) return;

    const success = await addAnniversary({
      title: newTitle,
      date: newDate,
      description: newDescription,
      icon: newIcon,
      color: newColor,
      isRecurring: newIsRecurring,
    });

    if (success) {
      resetForm();
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newTitle.trim() || !newDate) return;

    const success = await updateAnniversary(id, {
      title: newTitle,
      date: newDate,
      description: newDescription,
      icon: newIcon,
      color: newColor,
      isRecurring: newIsRecurring,
    });

    if (success) {
      resetForm();
    }
  };

  const startEdit = (item: typeof anniversaries[0]) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewDate(item.date.split('T')[0]);
    setNewDescription(item.description || '');
    setNewIcon(item.icon);
    setNewColor(item.color);
    setNewIsRecurring(item.isRecurring);
    setShowAdd(true);
  };

  const resetForm = () => {
    setShowAdd(false);
    setEditingId(null);
    setNewTitle('');
    setNewDate('');
    setNewDescription('');
    setNewIcon('🎉');
    setNewColor('from-pink-400 to-rose-400');
    setNewIsRecurring(true);
  };

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-amber-900/40 to-orange-900/30 border border-amber-500/30' : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
          🎉 纪念日日历
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          disabled={loading}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm hover:scale-105 transition-transform disabled:opacity-50"
        >
          + 添加
        </button>
      </div>

      {/* 添加/编辑弹窗 */}
      {showAdd && (
        <div className={`mb-4 p-4 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="纪念日名称..."
            className={`w-full mb-3 px-3 py-2 rounded-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className={`w-full mb-3 px-3 py-2 rounded-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="描述..."
            className={`w-full mb-3 px-3 py-2 rounded-xl resize-none ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
            rows={2}
          />
          <div className="mb-3">
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>图标</label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((opt) => (
                <button
                  key={opt.icon}
                  onClick={() => setNewIcon(opt.icon)}
                  className={`p-2 rounded-lg text-xl transition-all ${newIcon === opt.icon ? 'ring-2 ring-amber-400 scale-110' : ''} ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                  title={opt.label}
                >
                  {opt.icon}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className={`text-sm mb-2 block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>颜色</label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setNewColor(opt.value)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${opt.value} transition-all ${newColor === opt.value ? 'ring-2 ring-white scale-110' : ''}`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>
          <div className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={newIsRecurring}
              onChange={(e) => setNewIsRecurring(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isRecurring" className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>每年重复</label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-50"
            >
              {editingId ? '更新' : '保存'}
            </button>
            <button onClick={resetForm} className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}>
              取消
            </button>
          </div>
        </div>
      )}

      {/* 纪念日列表 */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {anniversaries.length > 0 ? anniversaries.map((item) => (
          <div key={item.id} className={`p-3 rounded-xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-white'}`}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-r ${item.color}`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{item.title}</h4>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.daysUntil === 0 ? '就是今天！' : `还有 ${item.daysUntil} 天`}
              </p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(item)} className={`p-1 rounded text-xs ${isDark ? 'hover:bg-blue-900/50 text-blue-400' : 'hover:bg-blue-100 text-blue-500'}`}>编辑</button>
              <button onClick={() => deleteAnniversary(item.id)} className={`p-1 rounded text-xs ${isDark ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-500'}`}>删除</button>
            </div>
          </div>
        )) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>还没有纪念日，添加第一个吧</div>
        )}
      </div>
    </div>
  );
}
