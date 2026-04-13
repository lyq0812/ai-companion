const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // 微信登录信息
  openid: {
    type: String,
    unique: true,
    sparse: true
  },
  unionid: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // 手机号登录
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // 用户信息
  nickname: {
    type: String,
    default: '用户'
  },
  avatar: {
    type: String,
    default: ''
  },
  
  // 会员信息
  isVip: {
    type: Boolean,
    default: false
  },
  vipType: {
    type: String,
    enum: ['month', 'year', 'family', null],
    default: null
  },
  vipExpireTime: {
    type: Date,
    default: null
  },
  
  // 账号状态
  status: {
    type: String,
    enum: ['active', 'banned'],
    default: 'active'
  },
  
  // 统计信息
  lastLoginTime: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// 索引
userSchema.index({ openid: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ createdAt: -1 });

// 检查会员是否过期
userSchema.methods.checkVipStatus = function() {
  if (this.isVip && this.vipExpireTime) {
    if (new Date() > this.vipExpireTime) {
      this.isVip = false;
      this.vipType = null;
      this.vipExpireTime = null;
      return false;
    }
  }
  return this.isVip;
};

module.exports = mongoose.model('User', userSchema);