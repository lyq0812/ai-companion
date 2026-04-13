@echo off
chcp 65001
cls
echo ========================================
echo   测试后端服务
echo ========================================
echo.

echo [1] 测试后端健康检查...
curl http://localhost:8080/health
echo.
echo.

echo [2] 测试后端API...
curl http://localhost:8080/api/test
echo.
echo.

echo [3] 启动后端穿透（按Ctrl+C停止）...
echo.
lt --port 8080

echo.
pause
