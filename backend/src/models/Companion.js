const mongoose = require('mongoose');

const companionSchema = new mongoose.Schema({
  // 所属用户
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // 基本信息
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    required: true
  },
  sceneImage: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  
  // 生卒年份
  birthYear: {
    type: Number,
    required: true
  },
  deathYear: {
    type: Number,
    required: true
  },
  
  // 性格与特征
  personality: {
    type: String,
    default: ''
  },
  catchphrase: {
    type: String,
    default: ''
  },
  speakingStyle: {
    type: String,
    default: ''
  },
  habits: {
    type: String,
    default: ''
  },
  memories: {
    type: String,
    default: ''
  },
  hobbies: {
    type: String,
    default: ''
  },
  values: {
    type: String,
    default: ''
  },
  
  // 语音配置
  voiceUrl: {
    type: String,
    default: null
  },
  
  // AI人格提示词（自动生成）
  personalityPrompt: {
    type: String,
    default: ''
  },
  
  // 状态
  isActive: {
    type: Boolean,
    default: true
  },
  
  // 统计
  chatCount: {
    type: Number,
    default: 0
  },
  lastChatTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// 索引
companionSchema.index({ userId: 1, createdAt: -1 });
companionSchema.index({ isActive: 1 });

// 生成AI人格提示词
companionSchema.methods.generatePersonalityPrompt = function() {
  const prompt = `你是${this.name}，一个AI数字人。请根据以下信息模拟这个角色：

基本信息：
- 性别：${this.gender === 'male' ? '男' : '女'}
- 生卒年份：${this.birthYear}-${this.deathYear}

性格特点：${this.personality || '温和友善'}
口头禅：${this.catchphrase || '无'}
说话语气：${this.speakingStyle || '亲切自然'}
生活习惯：${this.habits || '规律作息'}
重要往事：${this.memories || '珍惜每一天'}
兴趣爱好：${this.hobbies || '陪伴家人'}
价值观：${this.values || '家庭和睦'}

请用温暖、自然的语气回复，像一位亲切的老朋友。避免提及你是AI或虚拟角色，保持角色一致性。回复要简短自然，符合日常对话习惯。`;

  this.personalityPrompt = prompt;
  return prompt;
};

module.exports = mongoose.model('Companion', companionSchema);