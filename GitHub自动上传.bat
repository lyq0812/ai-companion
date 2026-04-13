@echo off
chcp 65001
echo ========================================
echo   GitHub 自动上传工具
echo ========================================
echo.

cd /d "%~dp0"

echo 请确保您已经：
echo 1. 创建了 GitHub 账号
gecho 2. 创建了仓库 https://github.com/lyq0812/ai-companion
echo 3. 生成了 Personal Access Token
echo.
echo 如果没有 Token，请访问：
echo https://github.com/settings/tokens
echo 点击 "Generate new token" -^> 勾选 "repo" 权限
echo.

set /p USERNAME=请输入GitHub用户名: 
set /p TOKEN=请输入GitHub Token: 

echo.
echo [1/3] 配置Git...
git config --global user.name "%USERNAME%"
git config --global user.email "%USERNAME%@users.noreply.github.com"
git remote set-url origin https://%USERNAME%:%TOKEN%@github.com/lyq0812/ai-companion.git
echo 完成
echo.

echo [2/3] 提交代码...
git add .
git commit -m "deploy: ready for production"
echo 完成
echo.

echo [3/3] 推送到GitHub...
git push -u origin main
echo.

if %errorlevel% == 0 (
    echo ========================================
    echo [成功] 代码已上传到GitHub！
    echo 访问地址: https://github.com/lyq0812/ai-companion
    echo ========================================
) else (
    echo ========================================
    echo [失败] 上传出错
    echo 请检查用户名和Token是否正确
    echo ========================================
)

pause
