import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  // 1. 创建分类
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

  // 2. 创建示例文章
  const articles = [
    {
      title: '在一起500天，他依然会每天说早安',
      content: '每天早上醒来，第一件事就是收到他的早安消息，这种被惦记的感觉真的很幸福...',
      excerpt: '每天早上醒来，第一件事就是收到他的早安消息...',
      categoryName: '爱情故事',
      coverImage: '/images/story-1.jpg',
      views: 16000,
    },
    {
      title: '第一次约会这样做，让他对你念念不忘',
      content: '第一次约会的细节决定了你们关系的走向，这些小技巧你一定要知道...',
      excerpt: '第一次约会的细节决定了你们关系的走向...',
      categoryName: '恋爱攻略',
      coverImage: '/images/story-2.jpg',
      views: 12000,
    },
    {
      title: '异地恋三年，我们终于修成正果',
      content: '从相隔千里到朝夕相伴，这三年的等待终于换来了今天的幸福...',
      excerpt: '从相隔千里到朝夕相伴，这三年的等待...',
      categoryName: '爱情故事',
      coverImage: '/images/story-3.jpg',
      views: 23000,
    },
    {
      title: '写给未来的你：我在等一个人',
      content: '我不知道你现在在哪里，但我知道，总有一天我们会相遇...',
      excerpt: '我不知道你现在在哪里，但我知道...',
      categoryName: '微情书',
      coverImage: '/images/story-4.jpg',
      views: 9900,
    },
  ]

  // 先创建一个默认用户
  const defaultUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: 'hashed_password_here',
      role: 'admin',
    },
  })

  for (const article of articles) {
    await prisma.article.create({
      data: {
        ...article,
        authorId: defaultUser.id,
      },
    })
  }
  console.log('✅ 示例文章创建完成')

  // 3. 创建示例许愿
  const wishes = [
    {
      content: '希望我们能一直在一起，永远不分开 💕',
      author: '小桃子',
      emoji: '💖',
      borderColor: 'from-pink-400 to-rose-400',
      likes: 128,
    },
    {
      content: '愿我们的爱情像星星一样永恒 ✨',
      author: '星星眼',
      emoji: '⭐',
      borderColor: 'from-yellow-400 to-orange-400',
      likes: 99,
    },
    {
      content: '希望能和TA一起去环游世界 🌍',
      author: '旅行家',
      emoji: '🌈',
      borderColor: 'from-blue-400 to-purple-400',
      likes: 76,
    },
    {
      content: '愿每一个明天都比今天更幸福 🌸',
      author: '幸福使者',
      emoji: '🌸',
      borderColor: 'from-purple-400 to-pink-400',
      likes: 156,
    },
    {
      content: '希望我们能有属于自己的小家 🏠',
      author: '梦想家',
      emoji: '🏡',
      borderColor: 'from-green-400 to-teal-400',
      likes: 88,
    },
  ]

  for (const wish of wishes) {
    await prisma.wish.create({ data: wish })
  }
  console.log('✅ 示例许愿创建完成')

  // 4. 创建示例祝福
  const blessings = [
    {
      author: '小明',
      content: '祝你们永远幸福！💕',
      avatarColor: 'from-pink-400 to-rose-400',
      isVIP: false,
    },
    {
      author: '小红',
      content: '太甜了！羡慕你们的爱情！🥰',
      avatarColor: 'from-red-400 to-pink-400',
      isVIP: true,
    },
    {
      author: '闺蜜团',
      content: '要一直一直在一起哦！👭',
      avatarColor: 'from-purple-400 to-indigo-400',
      isVIP: false,
    },
    {
      author: '祝福使者',
      content: '愿你们的爱情天长地久！🌹',
      avatarColor: 'from-yellow-400 to-orange-400',
      isVIP: false,
    },
  ]

  for (const blessing of blessings) {
    await prisma.blessing.create({ data: blessing })
  }
  console.log('✅ 示例祝福创建完成')

  // 5. 创建示例照片
  const photos = [
    { title: '第一次约会', src: '/images/photo-1.jpg', category: '纪念日', date: '2024-01-01' },
    { title: '海边旅行', src: '/images/photo-2.jpg', category: '旅行', date: '2024-02-14' },
    { title: '日常甜蜜', src: '/images/photo-3.jpg', category: '日常', date: '2024-03-20' },
    { title: '美食时光', src: '/images/photo-4.jpg', category: '美食', date: '2024-04-15' },
  ]

  for (const photo of photos) {
    await prisma.photo.create({ data: photo })
  }
  console.log('✅ 示例照片创建完成')

  // 6. 创建 AI 生成内容示例
  const aiContents = [
    {
      title: 'AI 情书生成器',
      description: '输入关键词，AI 帮你生成一封浪漫的情书',
      type: 'html',
      url: '/ai/love-letter.html',
      coverImage: '/images/ai-love-letter.jpg',
      icon: '💌',
      category: 'tool',
    },
    {
      title: 'AI 表白神器',
      description: '不知道如何表白？让 AI 帮你写一段动人的表白词',
      type: 'html',
      url: '/ai/confession.html',
      coverImage: '/images/ai-confession.jpg',
      icon: '💕',
      category: 'tool',
    },
    {
      title: 'AI 恋爱顾问',
      description: '恋爱中遇到问题？AI 恋爱顾问为你解答',
      type: 'html',
      url: '/ai/advisor.html',
      coverImage: '/images/ai-advisor.jpg',
      icon: '💡',
      category: 'tool',
    },
    {
      title: 'AI 浪漫图片',
      description: '生成专属的浪漫图片，记录美好瞬间',
      type: 'image',
      url: '/ai/romantic-image.jpg',
      coverImage: '/images/ai-image.jpg',
      icon: '🎨',
      category: 'image',
    },
  ]

  for (const content of aiContents) {
    await prisma.aIGeneratedContent.create({ data: content })
  }
  console.log('✅ AI 生成内容示例创建完成')

  // 7. 创建链接收藏示例
  const links = [
    {
      title: '我们的旅行计划',
      description: '记录我们想去的每一个地方',
      url: '#',
      coverImage: '/images/link-travel.jpg',
      icon: '✈️',
      order: 1,
    },
    {
      title: '情侣必做的100件事',
      description: '一起完成这些甜蜜的小事',
      url: '#',
      coverImage: '/images/link-todo.jpg',
      icon: '📝',
      order: 2,
    },
    {
      title: '我们的歌单',
      description: '属于我们的专属音乐',
      url: '#',
      coverImage: '/images/link-music.jpg',
      icon: '🎵',
      order: 3,
    },
  ]

  for (const link of links) {
    await prisma.linkCollection.create({ data: link })
  }
  console.log('✅ 链接收藏示例创建完成')

  // 8. 初始化站点统计
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

  // 9. 创建纪念日示例
  const anniversaries = [
    {
      title: '第一次相遇',
      date: new Date('2023-01-01'),
      description: '在那个特别的日子，我们相遇了',
      icon: '💘',
      color: 'from-pink-400 to-rose-400',
      isRecurring: true,
    },
    {
      title: '第一次约会',
      date: new Date('2023-02-14'),
      description: '情人节的第一次约会',
      icon: '🌹',
      color: 'from-red-400 to-pink-400',
      isRecurring: true,
    },
    {
      title: '一周年纪念日',
      date: new Date('2024-01-01'),
      description: '我们在一起一整年了！',
      icon: '🎉',
      color: 'from-purple-400 to-indigo-400',
      isRecurring: true,
    },
  ]

  for (const anniversary of anniversaries) {
    await prisma.anniversary.create({ data: anniversary })
  }
  console.log('✅ 纪念日示例创建完成')

  console.log('\n🎉 数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
