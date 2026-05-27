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

// 上传照片：先上传图片到服务器，再保存记录到数据库
export async function uploadPhotoToCloud(file: File, title: string, category: string): Promise<CloudPhoto> {
  // 1. 上传图片到服务器（Vercel Blob）
  const base64 = await fileToBase64(file)
  const uploadRes = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64,
      filename: `photo-${Date.now()}.${file.name.split('.').pop()}`
    })
  })
  if (!uploadRes.ok) throw new Error('图片上传失败')
  const { url } = await uploadRes.json()

  // 2. 保存记录到数据库
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
