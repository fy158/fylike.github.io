'use client'

import { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  // 暂时禁用认证检查，直接显示内容
  return <>{children}</>
}
