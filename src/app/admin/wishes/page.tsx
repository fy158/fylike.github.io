'use client'

import { useEffect, useState, useCallback } from 'react'

interface Wish {
  id: string
  content: string
  author: string
  authorId: string | null
  likes: number
  emoji: string
  borderColor: string
  createdAt: string
  user: { id: string; username: string; avatar: string } | null
}

function ListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-pink-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded w-20" />
              <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WishesPage() {
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchWishes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/wishes')
      if (!res.ok) throw new Error('获取愿望失败')
      const data = await res.json()
      setWishes(data)
    } catch {
      showToast('获取愿望列表失败', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchWishes()
  }, [fetchWishes])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/wishes/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('删除失败')
      showToast('愿望已删除', 'success')
      setDeleteId(null)
      fetchWishes()
    } catch {
      showToast('删除愿望失败', 'error')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[60] px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* 顶部 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">愿望管理</h2>
        <p className="text-sm text-gray-500 mt-1">共 {wishes.length} 个愿望</p>
      </div>

      {/* 愿望列表 */}
      {loading ? (
        <ListSkeleton />
      ) : wishes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-pink-100">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-gray-400">暂无愿望</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
            >
              {/* 顶部：emoji + 作者 */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${wish.borderColor} flex items-center justify-center text-lg shadow-sm`}>
                  {wish.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{wish.author}</p>
                  {wish.user && (
                    <span className="text-xs text-blue-500">已注册用户</span>
                  )}
                </div>
              </div>

              {/* 内容 */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                {wish.content}
              </p>

              {/* 底部信息 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{formatDate(wish.createdAt)}</span>
                  <span className="inline-flex items-center gap-1 text-xs text-pink-500">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {wish.likes}
                  </span>
                </div>
                <button
                  onClick={() => setDeleteId(wish.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 删除确认 Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">确认删除</h3>
              <p className="text-sm text-gray-500 mb-6">删除后将无法恢复，确定要删除这个愿望吗？</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
