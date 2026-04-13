@echo off
chcp 65001
echo ========================================
echo   打包代码准备上传
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 清理不需要的文件...
if exist "node_modules" rd /s /q "node_modules" 2>nul
if exist "backend\node_modules" rd /s /q "backend\node_modules" 2>nul
if exist "frontend\node_modules" rd /s /q "frontend\node_modules" 2>nul
echo 已清理 node_modules
echo.

echo [2/3] 打包代码...
if exist "ai-companion-code.zip" del "ai-companion-code.zip"
powershell -Command "Compress-Archive -Path 'backend','frontend','deploy','.gitignore','package.json','README.md','vercel.json','render.yaml' -DestinationPath 'ai-companion-code.zip'"
echo.

echo [3/3] 完成！
echo ========================================
echo 文件已打包: ai-companion-code.zip
echo.
echo 上传步骤:
echo 1. 打开 https://github.com/lyq0812/ai-companion
echo 2. 点击 "Add file" → "Upload files"
echo 3. 选择 ai-companion-code.zip 上传
echo 4. 或者解压后分批上传文件
echo ========================================
pause
