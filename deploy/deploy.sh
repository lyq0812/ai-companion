#!/bin/bash

# AI数字人陪伴平台 - 完整部署脚本

set -e

# 配置变量
DOMAIN="your-domain.com"
APP_NAME="ai-companion"
APP_DIR="/var/www/$APP_NAME"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "===== 开始部署 AI数字人陪伴平台 ====="

# 1. 创建应用目录
echo "[1/8] 创建应用目录..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 2. 克隆代码（或上传代码）
echo "[2/8] 部署代码..."
# 如果是Git仓库
# git clone https://github.com/your-repo/ai-companion.git $APP_DIR
# 或者手动上传代码到 $APP_DIR

# 3. 安装后端依赖
echo "[3/8] 安装后端依赖..."
cd $BACKEND_DIR
npm install --production

# 4. 配置生产环境
echo "[4/8] 配置生产环境..."
cp .env.production .env
# 编辑 .env 文件填入实际配置

# 5. 启动后端服务
echo "[5/8] 启动后端服务..."
pm run pm2:start || pm2 restart $APP_NAME-backend

# 6. 安装前端依赖并构建
echo "[6/8] 构建前端..."
cd $FRONTEND_DIR
npm install
npm run build

# 7. 配置Nginx
echo "[7/8] 配置Nginx..."
sudo cp $APP_DIR/deploy/nginx.conf /etc/nginx/sites-available/$APP_NAME
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/$APP_NAME
sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 8. 配置SSL证书
echo "[8/8] 配置SSL证书..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email your-email@example.com

echo "===== 部署完成 ====="
echo "访问地址: https://$DOMAIN"
echo ""
echo "常用命令:"
echo "  查看后端日志: pm2 logs $APP_NAME-backend"
echo "  重启后端: pm2 restart $APP_NAME-backend"
echo "  查看Nginx状态: sudo systemctl status nginx"
echo "  查看MongoDB状态: sudo systemctl status mongod"
