import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ user: null }, { status: 401 })
    }
    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      },
    })
  } catch (error) {
    console.error('获取会话失败:', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
