@echo off
chcp 65001
cls
echo ========================================
echo   AI数字人陪伴平台 - 内网穿透工具
echo ========================================
echo.

REM 检查 ngrok 是否存在
if not exist "ngrok.exe" (
    echo [提示] 首次使用需要下载 ngrok...
    echo.
    echo 请按以下步骤操作：
    echo 1. 访问 https://ngrok.com/download
    echo 2. 下载 Windows 版本
    echo 3. 将 ngrok.exe 复制到这个文件夹
    echo 4. 重新运行此脚本
    echo.
    pause
    exit
)

REM 检查是否配置了 token
ngrok config check 2>nul
if errorlevel 1 (
    echo.
    echo [首次配置] 需要设置 ngrok token
    echo.
    echo 请访问 https://dashboard.ngrok.com/get-started/your-authtoken
    echo 复制您的 Authtoken（格式如：2K9x...）
    echo.
    set /p TOKEN=请输入您的 ngrok token: 
    ngrok config add-authtoken %TOKEN%
    echo.
    echo [✓] Token 配置成功！
    echo.
)

echo.
echo 选择要暴露的服务：
echo 1. 前端页面 (http://localhost:3000)
echo 2. 后端API (http://localhost:8080)
echo.
set /p CHOICE=请输入数字 (1 或 2): 

if "%CHOICE%"=="1" (
    echo.
    echo [启动] 正在暴露前端页面...
    echo [访问] 下方显示的 Forwarding 链接就是您的公网地址
    echo.
    ngrok http 3000
) else if "%CHOICE%"=="2" (
    echo.
    echo [启动] 正在暴露后端API...
    echo [访问] 下方显示的 Forwarding 链接就是您的公网地址
    echo.
    ngrok http 8080
) else (
    echo.
    echo [错误] 无效的选择
    pause
)
