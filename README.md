# AI数字人陪伴平台

## 项目简介

这是一个面向亿万有情感思念需求的用户的AI数字人陪伴平台。平台采用温馨治愈的产品定位，帮助用户创建逝去亲人的AI数字人分身，实现超真实的居家自由陪伴和全开放式自由聊天功能。

## 核心功能

### 用户端功能
- ✅ 微信授权一键登录、手机号绑定登录
- ✅ 数字人自主创建流程（照片上传、场景设置、资料填写、语音配置）
- ✅ 超真实数字人自由行动系统（走动、站立、发呆、问候等）
- ✅ 全开放式自由AI聊天系统（基于用户资料深度复刻性格）
- ✅ 情感陪伴增值功能（纪念日提醒、主动关怀、回忆馆）
- ✅ 商业化付费体系（月卡49元、年卡198元、家庭版298元）

### 技术架构
- **前端**：uni-app + Vue3（完美兼容微信小程序、H5、APP端）
- **后端**：Node.js + Express + MongoDB
- **AI对接**：支持OpenAI GPT、文心一言、通义千问等大模型

## 项目结构

```
ai-companion-platform/
├── frontend/                 # 前端uni-app项目
│   ├── src/
│   │   ├── pages/           # 页面文件
│   │   ├── stores/          # Pinia状态管理
│   │   ├── utils/           # 工具函数
│   │   ├── App.vue          # 根组件
│   │   ├── main.ts          # 入口文件
│   │   ├── manifest.json    # 应用配置
│   │   └── pages.json       # 页面路由配置
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # 后端Node.js项目
│   ├── src/
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # API路由
│   │   ├── middleware/      # 中间件
│   │   ├── utils/           # 工具函数
│   │   └── app.js           # 入口文件
│   ├── uploads/             # 上传文件目录
│   ├── package.json
│   └── .env.example         # 环境变量示例
│
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 16.0.0
- MongoDB >= 4.4
- 微信开发者工具（小程序开发）

### 安装依赖

```bash
# 安装根目录依赖
npm run install:all

# 或分别安装
# 前端
cd frontend && npm install

# 后端
cd backend && npm install
```

### 配置环境变量

```bash
# 后端配置
cd backend
cp .env.example .env

# 编辑 .env 文件，填写以下配置：
# - MongoDB连接字符串
# - JWT密钥
# - 微信小程序AppID和Secret
# - 微信支付配置
# - AI大模型API密钥
```

### 启动服务

```bash
# 启动后端服务
npm run server

# 启动前端H5开发服务器
npm run dev:h5

# 启动微信小程序开发
npm run dev:mp-weixin
```

### 构建部署

```bash
# 构建H5
npm run build:h5

# 构建微信小程序
npm run build:mp-weixin

# 构建APP
npm run build:app
```

## 核心页面清单

### 用户端（12个核心页面）
1. 启动页/引导页 (`pages/index/index`)
2. 登录页 (`pages/login/index`)
3. 首页 (`pages/home/index`)
4. 数字人陪伴页 (`pages/companion/index`)
5. 聊天页 (`pages/chat/index`)
6. 创建数字人引导 (`pages/create/index`)
7. 创建步骤1-上传照片 (`pages/create/step1`)
8. 创建步骤2-设置场景 (`pages/create/step2`)
9. 创建步骤3-填写资料 (`pages/create/step3`)
10. 创建步骤4-语音配置 (`pages/create/step4`)
11. 创建成功页 (`pages/create/success`)
12. 个人中心 (`pages/profile/index`)
13. 会员中心 (`pages/profile/vip`)
14. 我的数字人 (`pages/profile/companions`)
15. 回忆馆 (`pages/profile/memories`)
16. 设置页 (`pages/profile/settings`)
17. 用户协议 (`pages/agreement/user`)
18. 隐私政策 (`pages/agreement/privacy`)

## API接口清单

### 认证相关
- POST `/api/auth/send-code` - 发送验证码
- POST `/api/auth/login` - 手机号登录
- POST `/api/auth/wechat-login` - 微信登录
- POST `/api/auth/bind-phone` - 绑定手机号

### 用户相关
- GET `/api/user/info` - 获取用户信息
- PUT `/api/user/info` - 更新用户信息

### 数字人相关
- GET `/api/companions` - 获取数字人列表
- GET `/api/companions/:id` - 获取数字人详情
- POST `/api/companions` - 创建数字人
- PUT `/api/companions/:id` - 更新数字人
- DELETE `/api/companions/:id` - 删除数字人

### 聊天相关
- GET `/api/chat/messages/:companionId` - 获取聊天记录
- POST `/api/chat/send` - 发送消息

### 支付相关
- POST `/api/payment/create-order` - 创建订单
- POST `/api/payment/notify` - 支付回调
- GET `/api/payment/order/:orderId` - 查询订单

### 上传相关
- POST `/api/upload` - 上传文件

## 数据库集合

### Users（用户）
- 微信openid/unionid
- 手机号
- 昵称、头像
- 会员信息
- 账号状态

### Companions（数字人）
- 用户ID
- 姓名、头像、场景图
- 性别、生卒年份
- 性格、口头禅、说话风格
- 生活习惯、往事记忆
- AI人格提示词

### ChatMessages（聊天记录）
- 用户ID、数字人ID
- 消息内容、类型
- 发送者标识

### Orders（订单）
- 用户ID、订单号
- 套餐类型、金额
- 订单状态、支付时间

## 商业化配置

### 会员套餐
- **月卡**：49元/月
- **年卡**：198元/年（推荐，节省62%）
- **家庭版**：298元/年（支持5个数字人）

### 会员权益
- 高清数字人形象
- 自由走动全功能
- 深度AI记忆
- 语音对话
- 无广告体验
- 无限云存储

## 合规说明

1. **AI虚拟人身份标识**：明确标注数字人为AI技术生成的虚拟形象
2. **无虚假宣传**：不承诺任何超自然功能
3. **内容安全**：内置敏感词过滤，禁止迷信、恐怖内容
4. **隐私保护**：用户数据加密存储，支持数据删除
5. **温馨提示**：强调珍惜当下，好好生活

## 技术亮点

1. **跨平台兼容**：一套代码同时支持微信小程序、H5、APP
2. **数字人动画引擎**：2D骨骼动画+帧动画实现流畅移动
3. **AI人格复刻**：基于用户资料自动生成个性化提示词
4. **多轮对话记忆**：支持长期记忆关联，对话更自然
5. **商业化完整**：集成微信支付，完整的订单和会员系统

## 部署说明

### 服务器要求
- 2核4G以上配置
- CentOS 7+ / Ubuntu 18.04+
- MongoDB 4.4+
- Nginx（反向代理）

### 部署步骤
1. 安装Node.js和MongoDB
2. 克隆代码并安装依赖
3. 配置环境变量
4. 启动后端服务（建议使用PM2）
5. 配置Nginx反向代理
6. 配置微信小程序服务器域名

## 开发团队

AI数字人陪伴平台开发团队

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎联系：
- 邮箱：support@aicompanion.com
- 客服微信：AICompanion_Service

---

**温馨提示**：数字人是AI技术生成的虚拟形象，旨在为您提供情感陪伴和心理慰藉。请珍惜当下，好好生活。
