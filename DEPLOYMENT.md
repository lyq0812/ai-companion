# 式微AI微信小程序部署方案

## 当前问题
GitHub Pages 在国内访问速度较慢，导致微信小程序出现 timeout 错误。

## 快速解决方案

### 方案一：使用 Vercel 部署（推荐）
Vercel 在国内访问速度较快，且部署简单。

#### 部署步骤：
1. 访问 https://vercel.com 并登录（可用 GitHub 账号）
2. 点击 "New Project"
3. 选择你的 `ai-companion` 仓库
4. 配置项目：
   - Project Name: shiwei-ai
   - Framework Preset: Other
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
5. 点击 "Deploy"
6. 部署完成后，你会得到一个类似 `https://shiwei-ai.vercel.app` 的地址
7. 更新 `pages/index/index.js` 中的 `webViewUrl` 为新地址

### 方案二：使用 Netlify 部署
Netlify 也是一个很好的选择，同样快速且免费。

#### 部署步骤：
1. 访问 https://netlify.com 并登录
2. 点击 "Add new site" → "Deploy with Git"
3. 选择 GitHub 和你的仓库
4. 配置：
   - Base directory: frontend
   - Build command: npm run build
   - Publish directory: frontend/dist
5. 点击 "Deploy site"
6. 等待部署完成，获取新地址并更新配置

### 方案三：使用 Gitee Pages（国内访问最快）
如果你的代码在 Gitee 上，可以使用 Gitee Pages。

#### 部署步骤：
1. 将代码推送到 Gitee 仓库
2. 在仓库设置中开启 Gitee Pages
3. 选择部署分支和目录
4. 获取部署地址并更新配置

## 本地开发测试

如果你想先在本地测试，可以：

1. 进入 frontend 目录：`cd frontend`
2. 启动开发服务器：`npm run dev`
3. 使用内网穿透工具（如 ngrok、花生壳等）将本地服务映射到公网
4. 更新微信小程序中的 webViewUrl 为映射地址

## 微信小程序配置

部署完成后，更新 `pages/index/index.js`：

```javascript
Page({
  data: {
    webViewUrl: '你的新部署地址' // 例如 'https://shiwei-ai.vercel.app'
  }
})
```

## 当前状态
- ✅ 前端项目已构建完成
- ✅ GitHub Pages 已部署（但国内访问慢）
- ⏳ 等待使用更快的部署方案
