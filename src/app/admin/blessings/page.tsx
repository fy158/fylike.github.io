'use client'

import { useEffect, useState, useCallback } from 'react'

interface Blessing {
  id: string
  author: string
  content: string
  avatarColor: string
  isVIP: boolean
  authorId: string | null
  createdAt: string
  replies: { id: string; author: string; content: string; toUser: string | null; createdAt: string }[]
  user: { id: string; username: string; avatar: string } | null
}

function ListSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-pink-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-24" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function BlessingsPage() {
  const [blessings, setBlessings] = useState<Blessing[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchBlessings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/blessings')
      if (!res.ok) throw new Error('获取祝福失败')
      const data = await res.json()
      setBlessings(data)
    } catch {
      showToast('获取祝福列表失败', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBlessings()
  }, [fetchBlessings])

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/blessings/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('删除失败')
      showToast('祝福已删除', 'success')
      setDeleteId(null)
      fetchBlessings()
    } catch {
      showToast('删除祝福失败', 'error')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
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
        <h2 className="text-xl font-bold text-gray-800">祝福管理</h2>
        <p className="text-sm text-gray-500 mt-1">共 {blessings.length} 条祝福</p>
      </div>

      {/* 祝福列表 */}
      {loading ? (
        <ListSkeleton />
      ) : blessings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-pink-100">
          <div className="text-4xl mb-4">💌</div>
          <p className="text-gray-400">暂无祝福</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blessings.map((blessing) => (
            <div
              key={blessing.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {/* 头像 */}
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${blessing.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {blessing.author.charAt(0)}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-800">{blessing.author}</span>
                    {blessing.isVIP && (
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-medium">
                        VIP
                      </span>
                    )}
                    {blessing.user && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 text-xs">
                        已注册
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{formatDate(blessing.createdAt)}</span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{blessing.content}</p>

                  {/* 回复列表 */}
                  {blessing.replies.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedId(expandedId === blessing.id ? null : blessing.id)}
                        className="text-xs text-pink-500 hover:text-pink-600 transition-colors"
                      >
                        {expandedId === blessing.id ? '收起回复' : `查看 ${blessing.replies.length} 条回复`}
                      </button>
                      {expandedId === blessing.id && (
                        <div className="mt-2 space-y-2 pl-3 border-l-2 border-pink-100">
                          {blessing.replies.map((reply) => (
                            <div key={reply.id} className="text-sm">
                              <span className="font-medium text-gray-700">{reply.author}</span>
                              {reply.toUser && (
                                <span className="text-gray-400"> 回复 {reply.toUser}</span>
                              )}
                              <span className="text-gray-600 ml-1">{reply.content}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 操作 */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => setDeleteId(blessing.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
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
              <p className="text-sm text-gray-500 mb-6">删除后将无法恢复，确定要删除这条祝福吗？</p>
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
