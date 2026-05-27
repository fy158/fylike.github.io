'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

interface Article {
  id: string
  title: string
  content: string
  excerpt: string | null
  categoryName: string
  coverImage: string
  views: number
  createdAt: string
  author: { id: string; username: string; avatar: string }
}

interface Category {
  id: string
  name: string
  slug: string
  count: number
  articlesCount: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface FormData {
  title: string
  content: string
  excerpt: string
  categoryName: string
  coverImage: string
}

const emptyForm: FormData = {
  title: '',
  content: '',
  excerpt: '',
  categoryName: '',
  coverImage: '/images/story-default.jpg',
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-pink-100">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/4" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="flex gap-2">
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            <div className="h-8 w-16 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ArticlesPage() {
  const { data: session } = useSession()
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchArticles = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/articles?page=${page}&limit=10`)
      if (!res.ok) throw new Error('获取文章失败')
      const data = await res.json()
      setArticles(data.articles)
      setPagination(data.pagination)
    } catch {
      showToast('获取文章列表失败', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [fetchArticles, fetchCategories])

  // Open create modal
  const handleCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  // Open edit modal
  const handleEdit = (article: Article) => {
    setEditingId(article.id)
    setForm({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || '',
      categoryName: article.categoryName,
      coverImage: article.coverImage,
    })
    setShowModal(true)
  }

  // Submit create/edit
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim() || !form.categoryName.trim()) {
      showToast('请填写标题、内容和分类', 'error')
      return
    }

    setSubmitting(true)
    try {
      const url = editingId ? `/api/articles/${editingId}` : '/api/articles'
      const method = editingId ? 'PUT' : 'POST'

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (!editingId && session?.user?.id) {
        headers['authorId'] = session.user.id
      }

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '操作失败')
      }

      showToast(editingId ? '文章更新成功' : '文章创建成功', 'success')
      setShowModal(false)
      fetchArticles(pagination.page)
    } catch (err) {
      showToast(err instanceof Error ? err.message : '操作失败', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete article
  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/articles/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('删除失败')
      showToast('文章已删除', 'success')
      setDeleteId(null)
      fetchArticles(pagination.page)
    } catch {
      showToast('删除文章失败', 'error')
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

      {/* 顶部操作栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">文章管理</h2>
          <p className="text-sm text-gray-500 mt-1">共 {pagination.total} 篇文章</p>
        </div>
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:from-pink-600 hover:to-purple-600 transition-all shadow-md shadow-pink-200 hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建文章
        </button>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <TableSkeleton />
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-pink-100">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-gray-400">暂无文章</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-pink-500 hover:text-pink-600 text-sm font-medium"
          >
            创建第一篇文章
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
          {/* 表头 */}
          <div className="hidden md:grid md:grid-cols-[1fr_120px_80px_120px_160px] gap-4 px-6 py-3 bg-pink-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>标题</span>
            <span>分类</span>
            <span>浏览</span>
            <span>日期</span>
            <span className="text-right">操作</span>
          </div>

          {/* 文章行 */}
          {articles.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-1 md:grid-cols-[1fr_120px_80px_120px_160px] gap-2 md:gap-4 px-6 py-4 border-t border-pink-50 hover:bg-pink-50/30 transition-colors"
            >
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-gray-800 truncate">{article.title}</h4>
                <p className="text-xs text-gray-400 mt-1 md:hidden">
                  {article.categoryName} · {article.views}次浏览 · {formatDate(article.createdAt)}
                </p>
              </div>
              <div className="hidden md:flex items-center">
                <span className="inline-flex px-2.5 py-1 rounded-lg bg-pink-50 text-pink-600 text-xs font-medium">
                  {article.categoryName}
                </span>
              </div>
              <div className="hidden md:flex items-center text-sm text-gray-500">
                {article.views}
              </div>
              <div className="hidden md:flex items-center text-sm text-gray-400">
                {formatDate(article.createdAt)}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(article)}
                  className="px-3 py-1.5 text-xs font-medium text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                >
                  编辑
                </button>
                <button
                  onClick={() => setDeleteId(article.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))}

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-pink-100">
              <p className="text-sm text-gray-500">
                第 {pagination.page} / {pagination.totalPages} 页
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchArticles(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-pink-200 text-pink-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  上一页
                </button>
                <button
                  onClick={() => fetchArticles(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-pink-200 text-pink-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 创建/编辑 Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !submitting && setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-pink-100 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingId ? '编辑文章' : '新建文章'}
              </h3>
              <button
                onClick={() => !submitting && setShowModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* 标题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  标题 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="请输入文章标题"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                />
              </div>

              {/* 分类 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  分类 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                  placeholder="请输入分类名称"
                  list="category-list"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                />
                <datalist id="category-list">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                  ))}
                </datalist>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {categories.slice(0, 6).map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setForm({ ...form, categoryName: cat.name })}
                        className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                          form.categoryName === cat.name
                            ? 'bg-pink-500 text-white'
                            : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 摘要 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">摘要</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  placeholder="请输入文章摘要（可选）"
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all resize-none"
                />
              </div>

              {/* 内容 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  内容 <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="请输入文章内容（支持 HTML 或纯文本）"
                  rows={10}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all resize-y font-mono"
                />
              </div>

              {/* 封面图 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">封面图 URL</label>
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  placeholder="/images/story-default.jpg"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none text-sm transition-all"
                />
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-pink-100 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={() => !submitting && setShowModal(false)}
                disabled={submitting}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 shadow-md"
              >
                {submitting ? '提交中...' : editingId ? '保存修改' : '创建文章'}
              </button>
            </div>
          </div>
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
              <p className="text-sm text-gray-500 mb-6">删除后将无法恢复，确定要删除这篇文章吗？</p>
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
