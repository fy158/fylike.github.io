/**
 * 甜蜜清单组件
 * 记录想一起做的事情
 */

'use client';

import { useState, useEffect } from 'react';
import { useSweetBucketList } from '@/hooks/useMoments';

const categories = [
  { id: 'place', label: '📍 想去的地方', color: 'from-blue-400 to-cyan-400' },
  { id: 'food', label: '🍜 想吃的美食', color: 'from-orange-400 to-red-400' },
  { id: 'plan', label: '💫 心愿计划', color: 'from-purple-400 to-pink-400' },
  { id: 'other', label: '✨ 其他', color: 'from-green-400 to-emerald-400' },
];

export default function SweetBucketList() {
  const [isDark, setIsDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('place');
  const [newDescription, setNewDescription] = useState('');

  const { items, addItem, toggleComplete, updateItem, deleteItem, loading } = useSweetBucketList();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const success = await addItem({
      title: newTitle,
      category: newCategory as 'place' | 'food' | 'plan' | 'other',
      description: newDescription,
      completed: false,
    });
    if (success) {
      setShowAdd(false);
      setNewTitle('');
      setNewDescription('');
      setNewCategory('place');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!newTitle.trim()) return;
    const success = await updateItem(id, {
      title: newTitle,
      category: newCategory as 'place' | 'food' | 'plan' | 'other',
      description: newDescription,
    });
    if (success) {
      setEditingId(null);
      setNewTitle('');
      setNewDescription('');
    }
  };

  const startEdit = (item: typeof items[0]) => {
    setEditingId(item.id);
    setNewTitle(item.title);
    setNewCategory(item.category);
    setNewDescription(item.description || '');
    setShowAdd(true);
  };

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-indigo-300' : 'text-indigo-700'}`}>
          ✨ 甜蜜清单
        </h3>
        <button
          onClick={() => setShowAdd(true)}
          disabled={loading}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm hover:scale-105 transition-transform disabled:opacity-50"
        >
          + 添加
        </button>
      </div>

      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1 rounded-full text-xs transition-all ${
            activeCategory === 'all' 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
              : isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'
          }`}
        >
          全部
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs transition-all ${
              activeCategory === cat.id 
                ? `bg-gradient-to-r ${cat.color} text-white` 
                : isDark ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-600'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 添加/编辑弹窗 */}
      {showAdd && (
        <div className={`mb-4 p-4 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="想做的事情..."
            className={`w-full mb-3 px-3 py-2 rounded-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className={`w-full mb-3 px-3 py-2 rounded-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="详细描述..."
            className={`w-full mb-3 px-3 py-2 rounded-xl resize-none ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={() => editingId ? handleUpdate(editingId) : handleAdd()}
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white disabled:opacity-50"
            >
              {editingId ? '更新' : '保存'}
            </button>
            <button 
              onClick={() => { setShowAdd(false); setEditingId(null); }} 
              className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 清单列表 */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredItems.length > 0 ? filteredItems.map((item) => (
          <div key={item.id} className={`p-3 rounded-xl flex items-center gap-3 ${isDark ? 'bg-white/5' : 'bg-white'} ${item.completed ? 'opacity-50' : ''}`}>
            <button
              onClick={() => toggleComplete(item.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                item.completed 
                  ? 'bg-gradient-to-r from-green-400 to-emerald-400 border-transparent' 
                  : 'border-gray-300 hover:border-indigo-400'
              }`}
            >
              {item.completed && '✓'}
            </button>
            <div className="flex-1">
              <h4 className={`font-medium ${item.completed ? 'line-through' : ''} ${isDark ? 'text-white' : 'text-gray-800'}`}>
                {item.title}
              </h4>
              {item.description && (
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
              )}
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(item)} className={`p-1 rounded text-xs ${isDark ? 'hover:bg-blue-900/50 text-blue-400' : 'hover:bg-blue-100 text-blue-500'}`}>编辑</button>
              <button onClick={() => deleteItem(item.id)} className={`p-1 rounded text-xs ${isDark ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-500'}`}>删除</button>
            </div>
          </div>
        )) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>还没有清单项，添加第一个吧</div>
        )}
      </div>
    </div>
  );
}
