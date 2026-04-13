@echo off
chcp 65001
echo ========================================
echo   下载 VS Code
echo ========================================
echo.

echo 正在下载 VS Code 安装程序...
echo 请稍等...
echo.

powershell -Command "Invoke-WebRequest -Uri 'https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user' -OutFile 'VSCodeSetup.exe'"

echo.
echo ========================================
if exist "VSCodeSetup.exe" (
    echo [成功] 下载完成！
    echo.
    echo 正在启动安装程序...
    echo 安装时请勾选：
    echo   [x] 添加到 PATH
    echo   [x] 添加到右键菜单
    echo.
    start VSCodeSetup.exe
) else (
    echo [失败] 下载失败
    echo 请手动访问 https://code.visualstudio.com 下载
)
echo ========================================
pause
