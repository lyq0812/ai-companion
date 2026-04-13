const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 用户ID
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // 订单号
  orderNo: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // 套餐类型
  planType: {
    type: String,
    enum: ['month', 'year', 'family'],
    required: true
  },
  
  // 订单金额（分）
  amount: {
    type: Number,
    required: true
  },
  
  // 会员到期时间
  expireTime: {
    type: Date,
    required: true
  },
  
  // 订单状态
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // 支付时间
  paidAt: {
    type: Date,
    default: null
  },
  
  // 退款时间
  refundedAt: {
    type: Date,
    default: null
  },
  
  // 微信支付订单号
  wxOrderNo: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// 索引
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
