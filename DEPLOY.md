# 🚀 Netlify 部署指南

## 📋 部署前准备

### 1. 创建 Supabase 数据库

1. 访问 [supabase.com](https://supabase.com) 注册/登录
2. 创建新项目
3. 进入 Project Settings → Database
4. 复制连接字符串（Connection string）
   - 格式：`postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

### 2. 准备环境变量

在 Netlify 控制台添加以下环境变量：

```
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-site.netlify.app
```

## 🔄 数据迁移（如有现有数据）

### 步骤 1: 导出 SQLite 数据

```bash
# 在本地项目目录
npx ts-node scripts/export-data.ts
```

这会生成 `data-export.json` 文件。

### 步骤 2: 部署到 Netlify

1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令：`npm run build`
3. 设置发布目录：`.next`
4. 添加环境变量（见上文）
5. 部署！

### 步骤 3: 导入数据到 Supabase

```bash
# 修改 .env 中的 DATABASE_URL 为 Supabase 连接字符串
# 然后运行：
npx prisma migrate deploy
npx ts-node scripts/import-data.ts
```

## 📝 首次部署（无数据）

如果不需迁移数据，直接：

1. 连接仓库到 Netlify
2. 添加环境变量
3. 部署后运行：
   ```bash
   npx prisma migrate deploy
   ```

## ✅ 部署后检查

- [ ] 首页正常加载
- [ ] 文章列表显示
- [ ] 许愿池功能正常
- [ ] 图片上传功能正常
- [ ] 主题切换正常

## 🔧 故障排查

### 数据库连接失败
- 检查 `DATABASE_URL` 是否正确
- 确认 Supabase 数据库允许外部连接

### 图片上传失败
- 检查 Netlify Blobs 是否启用
- 查看 Functions 日志

### 页面 404
- 检查 `next.config.ts` 中的 `trailingSlash` 设置
- 确认 `netlify.toml` 配置正确
