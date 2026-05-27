'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { isAuthenticated, clearAuthCookie } from '@/lib/simpleAuth'

interface AuthContextType {
  isLoggedIn: boolean
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsLoggedIn(isAuthenticated())
    setMounted(true)
  }, [])

  const logout = () => {
    clearAuthCookie()
    setIsLoggedIn(false)
    window.location.href = '/login'
  }

  // 服务端渲染或首次挂载时直接显示内容
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSimpleAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useSimpleAuth must be used within SimpleAuthProvider')
  return context
}
