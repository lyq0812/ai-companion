@echo off
chcp 65001
cls
echo ========================================
echo   AI数字人陪伴平台 - 完整分享
echo ========================================
echo.

start "后端穿透" cmd /c "lt --port 8080 --subdomain aicompanion-api-%random%"
timeout /t 2 >nul
start "前端穿透" cmd /c "lt --port 3000 --subdomain aicompanion-web-%random%"

echo.
echo [启动中...] 请等待两个窗口显示链接
echo.
echo 注意：
echo - 后端API链接用于接口访问
echo - 前端页面链接用于展示
echo.
echo 按任意键关闭所有穿透服务
pause > nul
taskkill /f /im node.exe 2>nul
