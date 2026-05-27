// 照片存储 - 纯客户端，通过 API 调用
// 上传走 /api/upload，数据走 /api/photos

export interface CloudPhoto {
  id: string
  url: string
  title: string
  date: string
  category: string
  createdAt: number
}

// 压缩图片到指定大小（单位：KB）
async function compressImage(file: File, maxSizeKB: number = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      
      let width = img.width
      let height = img.height
      const maxDimension = 1920 // 最大边长
      
      // 如果图片太大，先缩小尺寸
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }
      
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建 canvas'))
        return
      }
      
      ctx.drawImage(img, 0, 0, width, height)
      
      // 先尝试高质量
      let quality = 0.9
      let result = canvas.toDataURL('image/jpeg', quality)
      
      // 如果还太大，逐步降低质量
      while (result.length > maxSizeKB * 1024 && quality > 0.1) {
        quality -= 0.1
        result = canvas.toDataURL('image/jpeg', quality)
      }
      
      // 如果 JPEG 压缩后还是太大，继续缩小尺寸
      while (result.length > maxSizeKB * 1024 && width > 100) {
        width = Math.round(width * 0.8)
        height = Math.round(height * 0.8)
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        result = canvas.toDataURL('image/jpeg', 0.7)
      }
      
      resolve(result)
    }
    
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = url
  })
}

// 上传照片：先压缩，再上传图片到服务器，再保存记录到数据库
export async function uploadPhotoToCloud(file: File, title: string, category: string): Promise<CloudPhoto> {
  // 1. 压缩图片（压缩到 1MB 以内，确保不超过 Vercel 4.5MB 限制）
  const compressedBase64 = await compressImage(file, 1000)
  
  // 2. 上传图片到服务器（Vercel Blob）
  const uploadRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: compressedBase64,
      filename: `photo-${Date.now()}.jpg`
    })
  })
  if (!uploadRes.ok) throw new Error('图片上传失败')
  const { url } = await uploadRes.json()

  // 3. 保存记录到数据库
  const photo: CloudPhoto = {
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    url,
    title: title || `${category} · ${new Date().toLocaleDateString('zh-CN')}`,
    date: new Date().toISOString().split('T')[0],
    category,
    createdAt: Date.now(),
  }

  const saveRes = await fetch('/api/photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(photo)
  })
  if (!saveRes.ok) throw new Error('保存照片记录失败')

  return photo
}

// 从数据库获取所有照片
export async function getAllCloudPhotos(): Promise<CloudPhoto[]> {
  const response = await fetch('/api/photos')
  if (!response.ok) return []
  return response.json()
}

// 删除照片
export async function deleteCloudPhoto(id: string): Promise<void> {
  await fetch(`/api/photos/${id}`, { method: 'DELETE' })
}

// 按分类获取照片
export async function getCloudPhotosByCategory(category: string): Promise<CloudPhoto[]> {
  const photos = await getAllCloudPhotos()
  return photos.filter(p => p.category === category)
}