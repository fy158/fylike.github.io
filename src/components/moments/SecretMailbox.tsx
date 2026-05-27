/**
 * 悄悄话信箱组件
 * 发送和接收悄悄话
 */

'use client';

import { useState, useEffect } from 'react';
import { useSecretMessages } from '@/hooks/useMoments';

export default function SecretMailbox() {
  const [isDark, setIsDark] = useState(false);
  const [showWrite, setShowWrite] = useState(false);
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingId, setReplyingId] = useState<string | null>(null);

  const { messages, unreadCount, sendMessage, markAsRead, replyMessage, deleteMessage, loading } = useSecretMessages();

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  const handleSend = async () => {
    if (!content.trim()) return;
    const success = await sendMessage(content, author || '匿名');
    if (success) {
      setShowWrite(false);
      setContent('');
      setAuthor('');
    }
  };

  const handleReply = async (id: string) => {
    if (!replyContent.trim()) return;
    const success = await replyMessage(id, replyContent);
    if (success) {
      setReplyingId(null);
      setReplyContent('');
    }
  };

  return (
    <div className={`rounded-3xl p-6 transition-all duration-500 ${
      isDark ? 'bg-gradient-to-br from-rose-900/40 to-red-900/30 border border-rose-500/30' : 'bg-gradient-to-br from-rose-50 to-red-50 border border-rose-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-rose-300' : 'text-rose-700'}`}>
          💌 悄悄话信箱
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </h3>
        <button
          onClick={() => setShowWrite(true)}
          disabled={loading}
          className="px-3 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm hover:scale-105 transition-transform disabled:opacity-50"
        >
          ✉️ 写悄悄话
        </button>
      </div>

      {/* 写信弹窗 */}
      {showWrite && (
        <div className={`mb-4 p-4 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white'}`}>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="你的名字（可选）..."
            className={`w-full mb-3 px-3 py-2 rounded-xl ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你想说的话..."
            className={`w-full mb-3 px-3 py-2 rounded-xl resize-none ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
            rows={4}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-500 text-white disabled:opacity-50"
            >
              发送
            </button>
            <button 
              onClick={() => { setShowWrite(false); setContent(''); }} 
              className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {messages.length > 0 ? messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-4 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-white'} ${!msg.isRead ? 'ring-2 ring-rose-400/50' : ''}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💌</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>{msg.author}</span>
                {!msg.isRead && (
                  <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">新消息</span>
                )}
              </div>
              <div className="flex gap-1">
                {!msg.isRead && (
                  <button 
                    onClick={() => markAsRead(msg.id)} 
                    className="p-1 rounded text-xs bg-green-500/20 text-green-500 hover:bg-green-500/30"
                  >
                    已读
                  </button>
                )}
                <button 
                  onClick={() => deleteMessage(msg.id)} 
                  className={`p-1 rounded text-xs ${isDark ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-100 text-red-500'}`}
                >
                  删除
                </button>
              </div>
            </div>
            <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{msg.content}</p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {new Date(msg.createdAt).toLocaleString('zh-CN')}
            </p>
            
            {/* 回复 */}
            {msg.reply ? (
              <div className={`mt-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-rose-50'}`}>
                <p className={`text-xs ${isDark ? 'text-rose-300' : 'text-rose-600'} mb-1`}>💕 回复：</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{msg.reply}</p>
              </div>
            ) : (
              <div className="mt-3">
                {replyingId === msg.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="写下回复..."
                      className={`flex-1 px-3 py-2 rounded-xl text-sm ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                    />
                    <button 
                      onClick={() => handleReply(msg.id)} 
                      className="px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-500 text-white text-sm"
                    >
                      回复
                    </button>
                    <button 
                      onClick={() => { setReplyingId(null); setReplyContent(''); }} 
                      className={`px-3 py-2 rounded-lg text-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setReplyingId(msg.id)} 
                    className={`text-sm ${isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-500 hover:text-rose-600'}`}
                  >
                    💕 回复
                  </button>
                )}
              </div>
            )}
          </div>
        )) : (
          <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            还没有悄悄话，发送第一条吧 💕
          </div>
        )}
      </div>
    </div>
  );
}
