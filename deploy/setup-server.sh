#!/bin/bash

# AI数字人陪伴平台 - 服务器部署脚本

echo "===== 开始安装服务器环境 ====="

# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 PM2（进程管理器）
sudo npm install -g pm2

# 安装 MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# 启动 MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 安装 Nginx
sudo apt install -y nginx

# 安装 Git
sudo apt install -y git

# 安装 certbot（SSL证书）
sudo apt install -y certbot python3-certbot-nginx

echo "===== 基础环境安装完成 ====="
echo "Node.js版本: $(node -v)"
echo "NPM版本: $(npm -v)"
echo "MongoDB状态: $(sudo systemctl status mongod | grep Active)"
