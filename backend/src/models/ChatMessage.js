const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  // 所属用户
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // 所属数字人
  companionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Companion',
    required: true,
    index: true
  },
  
  // 消息内容
  content: {
    type: String,
    required: true
  },
  
  // 是否为用户发送
  isUser: {
    type: Boolean,
    required: true
  },
  
  // 消息类型
  type: {
    type: String,
    enum: ['text', 'image', 'voice'],
    default: 'text'
  },
  
  // 媒体URL（图片/语音）
  mediaUrl: {
    type: String,
    default: null
  },
  
  // 是否已读
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// 索引
chatMessageSchema.index({ userId: 1, companionId: 1, createdAt: -1 });
chatMessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
