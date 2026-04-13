#!/bin/bash

# AI数字人陪伴平台 - 完整安装脚本
# 在服务器上运行此脚本

echo "=========================================="
echo "  AI数字人陪伴平台 - 自动安装脚本"
echo "=========================================="

# 检查是否以root运行
if [ "$EUID" -ne 0 ]; then 
    echo "请使用 root 用户运行此脚本"
    echo "命令: sudo bash install-all.sh"
    exit 1
fi

# 设置变量
APP_NAME="ai-companion"
APP_DIR="/var/www/$APP_NAME"
DOMAIN=""

# 询问域名
read -p "请输入您的域名 (例如: aicompanion.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "错误: 域名不能为空"
    exit 1
fi

echo ""
echo "开始安装..."
echo "域名: $DOMAIN"
echo "安装目录: $APP_DIR"
echo ""

# 1. 更新系统
echo "[1/10] 更新系统..."
apt update && apt upgrade -y

# 2. 安装Node.js
echo "[2/10] 安装 Node.js 18..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi
echo "Node.js 版本: $(node -v)"
echo "NPM 版本: $(npm -v)"

# 3. 安装PM2
echo "[3/10] 安装 PM2..."
npm install -g pm2

# 4. 安装MongoDB
echo "[4/10] 安装 MongoDB..."
if ! command -v mongod &> /dev/null; then
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    apt update
    apt install -y mongodb-org
    systemctl start mongod
    systemctl enable mongod
fi
echo "MongoDB 状态: $(systemctl is-active mongod)"

# 5. 安装Nginx
echo "[5/10] 安装 Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# 6. 安装Git
echo "[6/10] 安装 Git..."
apt install -y git

# 7. 安装Certbot（SSL证书）
echo "[7/10] 安装 Certbot..."
apt install -y certbot python3-certbot-nginx

# 8. 创建应用目录
echo "[8/10] 创建应用目录..."
mkdir -p $APP_DIR
mkdir -p $APP_DIR/logs
mkdir -p $APP_DIR/uploads

# 9. 配置防火墙
echo "[9/10] 配置防火墙..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
fi

# 10. 创建启动脚本
echo "[10/10] 创建管理脚本..."
cat > /usr/local/bin/$APP_NAME << 'EOF'
#!/bin/bash

APP_NAME="ai-companion"
APP_DIR="/var/www/$APP_NAME"

case "$1" in
    start)
        echo "启动 $APP_NAME..."
        cd $APP_DIR/backend && npm run pm2:start
        ;;
    stop)
        echo "停止 $APP_NAME..."
        cd $APP_DIR/backend && npm run pm2:stop
        ;;
    restart)
        echo "重启 $APP_NAME..."
        cd $APP_DIR/backend && npm run pm2:restart
        ;;
    logs)
        pm2 logs $APP_NAME-backend
        ;;
    status)
        pm2 status
        ;;
    update)
        echo "更新 $APP_NAME..."
        cd $APP_DIR
        git pull
        cd backend && npm install
        cd ../frontend && npm install && npm run build
        cd $APP_DIR/backend && npm run pm2:restart
        ;;
    *)
        echo "用法: $APP_NAME {start|stop|restart|logs|status|update}"
        exit 1
        ;;
esac
EOF

chmod +x /usr/local/bin/$APP_NAME

echo ""
echo "=========================================="
echo "  基础环境安装完成！"
echo "=========================================="
echo ""
echo "下一步操作:"
echo "1. 将项目代码上传到: $APP_DIR"
echo "2. 运行: cd $APP_DIR/backend && npm install"
echo "3. 配置 .env 文件"
echo "4. 运行: ai-companion start"
echo ""
echo "管理命令:"
echo "  ai-companion start    - 启动服务"
echo "  ai-companion stop     - 停止服务"
echo "  ai-companion restart  - 重启服务"
echo "  ai-companion logs     - 查看日志"
echo "  ai-companion status   - 查看状态"
echo ""
