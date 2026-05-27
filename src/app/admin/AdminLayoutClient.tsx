'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const navItems = [
  { href: '/admin', label: '仪表盘', icon: '📊' },
  { href: '/admin/articles', label: '文章管理', icon: '📝' },
  { href: '/admin/blessings', label: '祝福管理', icon: '💌' },
  { href: '/admin/wishes', label: '愿望管理', icon: '✨' },
]

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/')
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
          <p className="text-pink-400 text-sm">加载中...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-pink-600 via-pink-500 to-purple-600 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo 区域 */}
          <div className="p-6 border-b border-white/20">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
                💕
              </div>
              <div>
                <h1 className="font-bold text-lg leading-tight">甜心恋语</h1>
                <p className="text-pink-200 text-xs">管理后台</p>
              </div>
            </Link>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/25 shadow-lg shadow-pink-900/20 text-white'
                      : 'text-pink-100 hover:bg-white/15 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* 底部用户信息 */}
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center gap-3 px-4 py-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-pink-200 truncate">管理员</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="flex-1 text-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs transition-colors"
              >
                返回前台
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 hover:bg-red-500/60 text-xs transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-pink-50 transition-colors"
              >
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-lg font-semibold text-gray-800">
                {navItems.find((item) => item.href === pathname)?.label || '管理后台'}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 hidden sm:block">
                欢迎，{session.user.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white text-sm font-medium">
                {session.user.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
