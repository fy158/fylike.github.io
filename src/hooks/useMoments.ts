/**
 * 点点滴滴页面通用 Hooks
 * 提供所有功能的 API 调用
 */

import { useState, useEffect, useCallback } from 'react';

// ============ 心情天气 ============
export interface MoodWeatherData {
  id: string;
  moodId: string;
  label: string;
  icon: string;
  note?: string;
  color: string;
  date: string;
  createdAt: string;
}

export function useMoodWeather() {
  const [currentMood, setCurrentMood] = useState<MoodWeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTodayMood = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const res = await fetch(`/api/mood-weather?date=${today}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentMood(data);
      }
    } catch (error) {
      console.error('获取今日心情失败:', error);
    }
  }, []);

  const saveMood = async (mood: Omit<MoodWeatherData, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/mood-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mood),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentMood(data);
        return data;
      }
    } catch (error) {
      console.error('保存心情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMood = async (id: string) => {
    try {
      const res = await fetch(`/api/mood-weather?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCurrentMood(null);
      }
    } catch (error) {
      console.error('删除心情失败:', error);
    }
  };

  useEffect(() => {
    fetchTodayMood();
  }, [fetchTodayMood]);

  return { currentMood, saveMood, deleteMood, loading, refresh: fetchTodayMood };
}

// ============ 情绪记录 ============
export interface EmotionRecordData {
  id: string;
  emotionId: string;
  emotion: string;
  icon: string;
  level: number;
  note?: string;
  createdAt: string;
}

export function useEmotionRecords() {
  const [records, setRecords] = useState<EmotionRecordData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await fetch('/api/emotion-records');
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (error) {
      console.error('获取情绪记录失败:', error);
    }
  }, []);

  const addRecord = async (record: Omit<EmotionRecordData, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/emotion-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        await fetchRecords();
        return true;
      }
    } catch (error) {
      console.error('添加情绪记录失败:', error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateRecord = async (id: string, record: Partial<EmotionRecordData>) => {
    try {
      const res = await fetch(`/api/emotion-records?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        await fetchRecords();
        return true;
      }
    } catch (error) {
      console.error('更新情绪记录失败:', error);
    }
    return false;
  };

  const deleteRecord = async (id: string) => {
    try {
      const res = await fetch(`/api/emotion-records?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchRecords();
        return true;
      }
    } catch (error) {
      console.error('删除情绪记录失败:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, addRecord, updateRecord, deleteRecord, loading, refresh: fetchRecords };
}

// ============ 每日心情 ============
export interface DailyMoodData {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  note?: string;
}

export function useDailyMoods() {
  const [moods, setMoods] = useState<DailyMoodData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMoods = useCallback(async (year?: number, month?: number) => {
    try {
      let url = '/api/daily-moods';
      if (year && month) {
        url += `?year=${year}&month=${month}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMoods(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('获取每日心情失败:', error);
    }
  }, []);

  const saveMood = async (mood: Omit<DailyMoodData, 'id'>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/daily-moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mood),
      });
      if (res.ok) {
        const data = await res.json();
        setMoods(prev => {
          const filtered = prev.filter(m => m.date !== mood.date);
          return [data, ...filtered];
        });
        return data;
      }
    } catch (error) {
      console.error('保存每日心情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMood = async (id: string) => {
    try {
      const res = await fetch(`/api/daily-moods?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMoods(prev => prev.filter(m => m.id !== id));
        return true;
      }
    } catch (error) {
      console.error('删除每日心情失败:', error);
    }
    return false;
  };

  return { moods, saveMood, deleteMood, loading, refresh: fetchMoods };
}

// ============ 恋爱日记 ============
export interface LoveDiaryData {
  id: string;
  title: string;
  content: string;
  mood?: string;
  date: string;
  createdAt: string;
}

export function useLoveDiary() {
  const [entries, setEntries] = useState<LoveDiaryData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/love-diary');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (error) {
      console.error('获取恋爱日记失败:', error);
    }
  }, []);

  const addEntry = async (entry: Omit<LoveDiaryData, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/love-diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        await fetchEntries();
        return true;
      }
    } catch (error) {
      console.error('添加日记失败:', error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateEntry = async (id: string, entry: Partial<LoveDiaryData>) => {
    try {
      const res = await fetch(`/api/love-diary?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        await fetchEntries();
        return true;
      }
    } catch (error) {
      console.error('更新日记失败:', error);
    }
    return false;
  };

  const deleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/love-diary?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchEntries();
        return true;
      }
    } catch (error) {
      console.error('删除日记失败:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, addEntry, updateEntry, deleteEntry, loading, refresh: fetchEntries };
}

// ============ 纪念日 ============
export interface AnniversaryData {
  id: string;
  title: string;
  date: string;
  description?: string;
  icon: string;
  color: string;
  isRecurring: boolean;
  nextDate?: string;
  daysUntil?: number;
}

export function useAnniversaries() {
  const [anniversaries, setAnniversaries] = useState<AnniversaryData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAnniversaries = useCallback(async (upcoming = false) => {
    try {
      const url = upcoming ? '/api/anniversaries?upcoming=true' : '/api/anniversaries';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAnniversaries(data);
      }
    } catch (error) {
      console.error('获取纪念日失败:', error);
    }
  }, []);

  const addAnniversary = async (anniversary: Omit<AnniversaryData, 'id' | 'nextDate' | 'daysUntil'>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/anniversaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anniversary),
      });
      if (res.ok) {
        await fetchAnniversaries();
        return true;
      }
    } catch (error) {
      console.error('添加纪念日失败:', error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const updateAnniversary = async (id: string, anniversary: Partial<AnniversaryData>) => {
    try {
      const res = await fetch(`/api/anniversaries?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anniversary),
      });
      if (res.ok) {
        await fetchAnniversaries();
        return true;
      }
    } catch (error) {
      console.error('更新纪念日失败:', error);
    }
    return false;
  };

  const deleteAnniversary = async (id: string) => {
    try {
      const res = await fetch(`/api/anniversaries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAnniversaries();
        return true;
      }
    } catch (error) {
      console.error('删除纪念日失败:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchAnniversaries(true);
  }, [fetchAnniversaries]);

  return { anniversaries, addAnniversary, updateAnniversary, deleteAnniversary, loading, refresh: fetchAnniversaries };
}

// ============ 甜蜜清单 ============
export interface SweetBucketListData {
  id: string;
  title: string;
  category: 'place' | 'food' | 'plan' | 'other';
  description?: string;
  completed: boolean;
  completedAt?: string;
  targetDate?: string;
  createdAt: string;
}

export function useSweetBucketList() {
  const [items, setItems] = useState<SweetBucketListData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = useCallback(async (category?: string) => {
    try {
      let url = '/api/sweet-bucket-list';
      if (category) url += `?category=${category}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error('获取甜蜜清单失败:', error);
    }
  }, []);

  const addItem = async (item: Omit<SweetBucketListData, 'id' | 'createdAt' | 'completedAt'>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/sweet-bucket-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await fetchItems();
        return true;
      }
    } catch (error) {
      console.error('添加清单项失败:', error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const toggleComplete = async (id: string) => {
    try {
      const res = await fetch(`/api/sweet-bucket-list?id=${id}`, { method: 'PATCH' });
      if (res.ok) {
        await fetchItems();
        return true;
      }
    } catch (error) {
      console.error('切换完成状态失败:', error);
    }
    return false;
  };

  const updateItem = async (id: string, item: Partial<SweetBucketListData>) => {
    try {
      const res = await fetch(`/api/sweet-bucket-list?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        await fetchItems();
        return true;
      }
    } catch (error) {
      console.error('更新清单项失败:', error);
    }
    return false;
  };

  const deleteItem = async (id: string) => {
    try {
      const res = await fetch(`/api/sweet-bucket-list?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchItems();
        return true;
      }
    } catch (error) {
      console.error('删除清单项失败:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, addItem, toggleComplete, updateItem, deleteItem, loading, refresh: fetchItems };
}

// ============ 悄悄话信箱 ============
export interface SecretMessageData {
  id: string;
  content: string;
  author: string;
  isRead: boolean;
  readAt?: string;
  reply?: string;
  replyAt?: string;
  createdAt: string;
}

export function useSecretMessages() {
  const [messages, setMessages] = useState<SecretMessageData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/secret-messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('获取悄悄话失败:', error);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch('/api/secret-messages?unread=true&limit=1');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('获取未读数失败:', error);
    }
  }, []);

  const sendMessage = async (content: string, author = '匿名') => {
    setLoading(true);
    try {
      const res = await fetch('/api/secret-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, author }),
      });
      if (res.ok) {
        await fetchMessages();
        return true;
      }
    } catch (error) {
      console.error('发送悄悄话失败:', error);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/secret-messages?id=${id}`, { method: 'PATCH' });
      if (res.ok) {
        await fetchMessages();
        await fetchUnreadCount();
        return true;
      }
    } catch (error) {
      console.error('标记已读失败:', error);
    }
    return false;
  };

  const replyMessage = async (id: string, reply: string) => {
    try {
      const res = await fetch(`/api/secret-messages?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply }),
      });
      if (res.ok) {
        await fetchMessages();
        return true;
      }
    } catch (error) {
      console.error('回复失败:', error);
    }
    return false;
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/secret-messages?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchMessages();
        return true;
      }
    } catch (error) {
      console.error('删除悄悄话失败:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [fetchMessages, fetchUnreadCount]);

  return { 
    messages, 
    unreadCount, 
    sendMessage, 
    markAsRead, 
    replyMessage, 
    deleteMessage, 
    loading, 
    refresh: fetchMessages 
  };
}
