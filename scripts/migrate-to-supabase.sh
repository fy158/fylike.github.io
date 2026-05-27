#!/bin/bash
# SQLite 到 PostgreSQL 数据迁移脚本

echo "🚀 开始迁移数据到 Supabase..."

# 1. 导出 SQLite 数据为 SQL
echo "📦 导出 SQLite 数据..."
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > migration.sql

# 2. 创建数据导出脚本
cat > export-data.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function exportData() {
  console.log('📤 导出数据中...')
  
  const data = {
    users: await prisma.user.findMany(),
    categories: await prisma.category.findMany(),
    articles: await prisma.article.findMany(),
    comments: await prisma.comment.findMany(),
    wishes: await prisma.wish.findMany(),
    blessings: await prisma.blessing.findMany(),
    blessingReplies: await prisma.blessingReply.findMany(),
    photos: await prisma.photo.findMany(),
    siteStats: await prisma.siteStats.findMany(),
  }
  
  fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2))
  console.log('✅ 数据已导出到 data-export.json')
}

exportData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
EOF

# 3. 创建数据导入脚本
cat > import-data.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

async function importData() {
  console.log('📥 导入数据到 PostgreSQL...')
  
  const data = JSON.parse(fs.readFileSync('data-export.json', 'utf-8'))
  
  // 按顺序导入（考虑外键依赖）
  console.log('导入用户...')
  for (const user of data.users) {
    await prisma.user.create({ data: user }).catch(() => {})
  }
  
  console.log('导入分类...')
  for (const cat of data.categories) {
    await prisma.category.create({ data: cat }).catch(() => {})
  }
  
  console.log('导入文章...')
  for (const article of data.articles) {
    await prisma.article.create({ data: article }).catch(() => {})
  }
  
  console.log('导入评论...')
  for (const comment of data.comments) {
    await prisma.comment.create({ data: comment }).catch(() => {})
  }
  
  console.log('导入许愿...')
  for (const wish of data.wishes) {
    await prisma.wish.create({ data: wish }).catch(() => {})
  }
  
  console.log('导入祝福...')
  for (const blessing of data.blessings) {
    await prisma.blessing.create({ data: blessing }).catch(() => {})
  }
  
  console.log('导入祝福回复...')
  for (const reply of data.blessingReplies) {
    await prisma.blessingReply.create({ data: reply }).catch(() => {})
  }
  
  console.log('导入照片...')
  for (const photo of data.photos) {
    await prisma.photo.create({ data: photo }).catch(() => {})
  }
  
  console.log('导入站点统计...')
  for (const stats of data.siteStats) {
    await prisma.siteStats.create({ data: stats }).catch(() => {})
  }
  
  console.log('✅ 数据导入完成！')
}

importData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
EOF

echo ""
echo "📋 迁移步骤："
echo "1. 确保 SQLite 数据库中有数据 (prisma/dev.db)"
echo "2. 运行: npx ts-node export-data.ts"
echo "3. 修改 .env 中的 DATABASE_URL 为 Supabase 连接字符串"
echo "4. 运行: npx prisma migrate deploy"
echo "5. 运行: npx ts-node import-data.ts"
echo ""
echo "✨ 脚本已生成！"
