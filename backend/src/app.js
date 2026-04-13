const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// 加载环境变量
dotenv.config();

// 导入路由
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const companionRoutes = require('./routes/companion');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payment');
const uploadRoutes = require('./routes/upload');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 数据库连接（可选，连接失败不影响服务启动）
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_companion')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log('MongoDB not connected, running in demo mode');
    console.log('To enable full features, please install and start MongoDB');
  });

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/companions', companionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'AI数字人陪伴平台后端服务运行中'
  });
});

// 测试接口
app.get('/api/test', (req, res) => {
  res.json({
    code: 200,
    message: '测试成功',
    data: {
      service: 'AI数字人陪伴平台',
      version: '1.0.0',
      features: ['用户认证', '数字人管理', 'AI聊天', '支付系统']
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Test API: http://localhost:${PORT}/api/test`);
});

module.exports = app;