// 简单认证系统 - 账号 桃小淘 / 密码 410313
const VALID_USER = { username: '桃小淘', password: '410313' }
const AUTH_KEY = 'taoxiaotao_auth'

export function validateCredentials(username: string, password: string): boolean {
  return username === VALID_USER.username && password === VALID_USER.password
}

export function setAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_KEY}=true; path=/; max-age=86400`
    localStorage.setItem(AUTH_KEY, 'true')
  }
}

export function clearAuthCookie(): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${AUTH_KEY}=; path=/; max-age=0`
    localStorage.removeItem(AUTH_KEY)
  }
}

export function isAuthenticated(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes(`${AUTH_KEY}=true`) || localStorage.getItem(AUTH_KEY) === 'true'
}
