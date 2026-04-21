# Vercel部署404问题修复指南

## 问题原因
之前的配置过于复杂，Vercel无法正确识别项目结构。

## ✅ 已完成的修复

1. **简化了根目录 `vercel.json`
2. **在 `frontend` 目录添加了独立的 `vercel.json`**

## 🔧 重新部署步骤（推荐方案）

### 方案1：直接部署frontend子目录（最简单！）

这是最可靠的方式，推荐使用：

1. **登录Vercel：https://vercel.com

2. **点击 Add New Project

3. **导入你的GitHub仓库

4. **重要！在项目设置页面：**

   **修改 Root Directory 为 `frontend`
   
   ![设置截图示例：
   - Root Directory: `frontend`
   - Framework Preset: 会自动识别为 Vite
   - Build Command: 自动填充为 `npm run build`
   - Output Directory: 自动填充为 `dist`

5. **点击 Deploy 按钮

6. **等待部署完成

### 方案2：使用Vercel CLI部署

如果你安装了Vercel CLI，在 `frontend` 目录运行：

```bash
cd frontend
vercel
```

## 📋 项目结构说明

```
你的项目/
├── frontend/          ← 部署这个目录！
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json   ← 新增，专门用于Vercel配置
├── pages/           ← 微信小程序文件
├── app.json
└── ...
```

## ✅ 已修复的配置文件

### 1. 根目录 vercel.json（简化版）
```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. frontend/vercel.json（新增，推荐使用）
```json
{
  "version": 2,
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🎯 关键要点

### 部署时必须设置：

1. **Root Directory**: `frontend` ← 这个最重要！
2. **Framework Preset**: Vite（会自动识别）
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`

## 🔍 检查清单

部署前检查：
- ✅ frontend目录有 package.json ✓
- ✅ frontend目录有 vite.config.ts ✓
- ✅ frontend目录有 vercel.json ✓
- ✅ vite.config.ts中 base: '/' ✓

## 🎉 部署成功后

- 访问域名会显示你的应用首页
- 可以将新地址更新到微信小程序的 `pages/index/index.js

## 💡 如果还有问题

1. **查看Vercel部署日志：
   - 进入项目 → Deployments → 点击最新部署
   - 查看 Build Logs 看具体错误

2. **本地验证构建：
   ```bash
   cd frontend
   npm run build
   # 检查 dist目录是否生成成功
   ```

3. **手动上传构建产物：
   - 如果以上都不行，可以手动将 `frontend/dist` 目录内容直接推送到 `gh-pages` 分支，用GitHub Pages
