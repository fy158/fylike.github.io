import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// POST - 上传文件（HTML或图片）到 Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (type === 'html') {
      if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
        return NextResponse.json(
          { error: '只支持 HTML 文件' },
          { status: 400 }
        )
      }
    } else if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: '只支持图片文件' },
          { status: 400 }
        )
      }
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop() || (type === 'html' ? 'html' : 'webp')
    const filename = `ai-generated/${type}/${timestamp}-${randomStr}.${ext}`

    // 上传到 Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type || (type === 'html' ? 'text/html' : 'image/webp'),
    })

    return NextResponse.json({ 
      success: true,
      url: blob.url,
      filename
    })

  } catch (error) {
    console.error('文件上传失败:', error)
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    )
  }
}
