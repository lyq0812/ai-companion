@echo off
chcp 65001
echo ========================================
echo   上传代码到 GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查Git状态...
git status
echo.

echo [2/3] 添加远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/lyq0812/ai-companion.git
echo 远程仓库已添加
echo.

echo [3/3] 推送到GitHub...
echo 注意：如果提示输入用户名密码，请输入：
echo   用户名: lyq0812
echo   密码: 您的GitHub Personal Access Token
echo.
pause
git push -u origin main
echo.

echo ========================================
if %errorlevel% == 0 (
    echo [成功] 代码已上传到GitHub！
    echo 访问地址: https://github.com/lyq0812/ai-companion
) else (
    echo [失败] 上传出错，请检查网络或凭据
)
echo ========================================
pause
