'use client'

import { useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthContext } from './SimpleAuthProvider'

export default function UserNav() {
  const context = useContext(AuthContext)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  // 如果 context 不存在（服务端渲染时），显示默认登录按钮
  if (!context) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
        >
          登录
        </Link>
      </div>
    )
  }

  const { isLoggedIn, logout } = context

  const handleLogout = () => {
    logout()
    setShowMenu(false)
    router.push('/login')
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
        >
          登录
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
          🍑
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-200 hidden sm:inline max-w-[80px] truncate">
          桃小淘
        </span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                桃小淘
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                桃小淘用户
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              🚪 退出登录
            </button>
          </div>
        </>
      )}
    </div>
  )
}
