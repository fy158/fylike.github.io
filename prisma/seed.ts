import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  // 1. 确保默认用户存在
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
    },
  })
  console.log('✅ 默认用户创建完成')

  // 2. 创建分类（幂等）
  const categories = [
    { name: '爱情故事', slug: 'love-story', count: 128 },
    { name: '恋爱攻略', slug: 'love-guide', count: 86 },
    { name: '微情书', slug: 'love-letter', count: 256 },
    { name: '情感问答', slug: 'qa', count: 64 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ 分类创建完成')

  // 3. 创建示例文章（幂等：按标题查找，已存在则跳过）
  const articles = [
    {
      title: '在一起500天，他依然会每天说早安',
      content: '每天早上醒来，第一件事就是收到他的早安消息，这种被惦记的感觉真的很幸福...',
      excerpt: '每天早上醒来，第一件事就是收到他的早安消息...',
      categoryName: '爱情故事',
      coverImage: '/images/story-default.jpg',
      views: 16000,
    },
    {
      title: '第一次约会这样做，让他对你念念不忘',
      content: '第一次约会的细节决定了你们关系的走向，这些小技巧你一定要知道...',
      excerpt: '第一次约会的细节决定了你们关系的走向...',
      categoryName: '恋爱攻略',
      coverImage: '/images/story-default.jpg',
      views: 12000,
    },
    {
      title: '异地恋三年，我们终于修成正果',
      content: '从相隔千里到朝夕相伴，这三年的等待终于换来了今天的幸福...',
      excerpt: '从相隔千里到朝夕相伴，这三年的等待...',
      categoryName: '爱情故事',
      coverImage: '/images/story-default.jpg',
      views: 23000,
    },
    {
      title: '写给未来的你：我在等一个人',
      content: '我不知道你现在在哪里，但我知道，总有一天我们会相遇...',
      excerpt: '我不知道你现在在哪里，但我知道...',
      categoryName: '微情书',
      coverImage: '/images/story-default.jpg',
      views: 9900,
    },
  ]

  for (const article of articles) {
    const exists = await prisma.article.findFirst({ where: { title: article.title } })
    if (!exists) {
      await prisma.article.create({
        data: {
          ...article,
          authorId: defaultUser.id,
        },
      })
    }
  }
  console.log('✅ 示例文章创建完成')

  // 4. 创建示例许愿（幂等）
  const wishes = [
    { content: '希望我们能一直在一起，永远不分开 💕', author: '小桃子', emoji: '💖', borderColor: 'from-pink-400 to-rose-400', likes: 128 },
    { content: '愿我们的爱情像星星一样永恒 ✨', author: '星星眼', emoji: '⭐', borderColor: 'from-yellow-400 to-orange-400', likes: 99 },
    { content: '希望能和TA一起去环游世界 🌍', author: '旅行家', emoji: '🌈', borderColor: 'from-blue-400 to-purple-400', likes: 76 },
    { content: '愿每一个明天都比今天更幸福 🌸', author: '幸福使者', emoji: '🌸', borderColor: 'from-purple-400 to-pink-400', likes: 156 },
    { content: '希望我们能有属于自己的小家 🏠', author: '梦想家', emoji: '🏡', borderColor: 'from-green-400 to-teal-400', likes: 88 },
  ]

  for (const wish of wishes) {
    const exists = await prisma.wish.findFirst({ where: { content: wish.content } })
    if (!exists) {
      await prisma.wish.create({ data: wish })
    }
  }
  console.log('✅ 示例许愿创建完成')

  // 5. 创建示例祝福（幂等）
  const blessings = [
    { author: '小明', content: '祝你们永远幸福！💕', avatarColor: 'from-pink-400 to-rose-400', isVIP: false },
    { author: '小红', content: '太甜了！羡慕你们的爱情！🥰', avatarColor: 'from-red-400 to-pink-400', isVIP: true },
    { author: '闺蜜团', content: '要一直一直在一起哦！👭', avatarColor: 'from-purple-400 to-indigo-400', isVIP: false },
    { author: '祝福使者', content: '愿你们的爱情天长地久！🌹', avatarColor: 'from-yellow-400 to-orange-400', isVIP: false },
  ]

  for (const blessing of blessings) {
    const exists = await prisma.blessing.findFirst({ where: { content: blessing.content } })
    if (!exists) {
      await prisma.blessing.create({ data: blessing })
    }
  }
  console.log('✅ 示例祝福创建完成')

  // 6. 初始化站点统计（幂等）
  await prisma.siteStats.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      articles: 4,
      views: 58300,
      wishes: 5,
      blessings: 4,
    },
  })
  console.log('✅ 站点统计初始化完成')

  console.log('\n🎉 数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error('数据库初始化失败:', e)
    // 不退出，允许 build 继续
  })
  .finally(async () => {
    await prisma.$disconnect()
  })