import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

// POST /api/upload - 上传图片到 Vercel Blob
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, filename } = body

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: '缺少图片数据' }, { status: 400 })
    }

    // 解析 base64 图片
    const matches = image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json({ error: '无效的图片格式' }, { status: 400 })
    }

    const ext = matches[1]
    const base64Data = matches[2]
    const buffer = Buffer.from(base64Data, 'base64')

    // 生成文件名
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const finalFilename = filename || `upload-${timestamp}-${random}.${ext}`

    // 上传到 Vercel Blob
    const blob = await put(finalFilename, buffer, {
      access: 'public',
      contentType: `image/${ext}`,
    })

    return NextResponse.json({ url: blob.url }, { status: 201 })
  } catch (error) {
    console.error('上传图片失败:', error)
    return NextResponse.json({ error: '上传图片失败' }, { status: 500 })
  }
}
