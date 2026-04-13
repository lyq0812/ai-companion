@echo off
chcp 65001
echo ========================================
echo   AI数字人陪伴平台 - 一键部署
echo ========================================
echo.

cd /d "%~dp0"

echo [步骤说明]
echo 本脚本将帮您：
echo 1. 上传代码到 GitHub
echo 2. 部署后端到 Render
echo 3. 部署前端到 Vercel
echo.
echo 请确保您已经：
echo - 创建了 GitHub 账号
echo - 创建了仓库 https://github.com/lyq0812/ai-companion
echo - 安装了 GitHub Desktop 并登录
echo.
pause

echo.
echo ========================================
echo [1/3] 使用 GitHub Desktop 上传代码
echo ========================================
echo.
echo 请手动操作：
echo 1. 打开 GitHub Desktop
echo 2. File -^> Add local repository
echo 3. 选择此文件夹
echo 4. 点击 Publish repository
echo.
pause

echo.
echo ========================================
echo [2/3] 部署后端到 Render
echo ========================================
echo.
echo 请访问 https://dashboard.render.com
echo 然后按以下步骤操作：
echo.
echo 1. 点击 "New +" -^> "Web Service"
echo 2. 连接 GitHub 仓库 ai-companion
echo 3. 填写配置：
echo    Name: ai-companion-backend
echo    Environment: Node
echo    Build Command: cd backend ^&^& npm install
echo    Start Command: cd backend ^&^& npm start
echo    Plan: Free
echo 4. 点击 Create
echo.
echo 部署完成后，复制后端地址（如 https://xxx.onrender.com）
set /p BACKEND_URL=请输入后端地址: 

echo.
echo ========================================
echo [3/3] 部署前端到 Vercel
echo ========================================
echo.
echo 请访问 https://vercel.com/new
echo 然后按以下步骤操作：
echo.
echo 1. 导入 GitHub 仓库 ai-companion
echo 2. Framework Preset: Other
echo 3. Build Command: cd frontend ^&^& npm install ^&^& npm run build
echo 4. Output Directory: frontend/dist
echo 5. 添加环境变量：
echo    Name: VITE_API_URL
echo    Value: %BACKEND_URL%/api
echo 6. 点击 Deploy
echo.
pause

echo.
echo ========================================
echo 部署完成！
echo ========================================
echo.
echo 您的网站将在几分钟内上线
echo 前端地址: https://ai-companion.vercel.app
echo 后端地址: %BACKEND_URL%
echo.
pause
