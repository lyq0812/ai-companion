const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 创建订单
router.post('/create-order', authenticate, async (req, res) => {
  try {
    const { planType, amount } = req.body;
    
    if (!planType || !amount) {
      return res.json({ code: 400, message: '参数错误', data: null });
    }
    
    // 生成订单号
    const orderNo = `ORDER${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // 计算会员到期时间
    let expireTime = new Date();
    switch (planType) {
      case 'month':
        expireTime.setMonth(expireTime.getMonth() + 1);
        break;
      case 'year':
      case 'family':
        expireTime.setFullYear(expireTime.getFullYear() + 1);
        break;
    }
    
    // 创建订单
    const order = new Order({
      userId: req.userId,
      orderNo,
      planType,
      amount,
      expireTime,
      status: 'pending'
    });
    await order.save();
    
    // 生成微信支付参数（实际项目中接入微信支付SDK）
    const paymentParams = {
      appId: process.env.WECHAT_APPID,
      timeStamp: Math.floor(Date.now() / 1000).toString(),
      nonceStr: generateNonceStr(),
      package: `prepay_id=wx${Date.now()}`,
      signType: 'MD5'
    };
    
    // 计算签名
    const sign = generateSign(paymentParams);
    paymentParams.paySign = sign;
    
    res.json({
      code: 200,
      message: '订单创建成功',
      data: {
        orderId: order._id,
        orderNo,
        amount,
        expireTime,
        paymentParams
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.json({ code: 500, message: '创建订单失败', data: null });
  }
});

// 支付回调
router.post('/notify', async (req, res) => {
  try {
    const { orderNo, result } = req.body;
    
    if (result === 'success') {
      // 查找订单
      const order = await Order.findOne({ orderNo });
      if (!order || order.status !== 'pending') {
        return res.send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
      }
      
      // 更新订单状态
      order.status = 'paid';
      order.paidAt = new Date();
      await order.save();
      
      // 更新用户会员状态
      await User.findByIdAndUpdate(order.userId, {
        isVip: true,
        vipType: order.planType,
        vipExpireTime: order.expireTime
      });
      
      res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>');
    } else {
      // 支付失败
      await Order.findOneAndUpdate(
        { orderNo },
        { status: 'failed' }
      );
      res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>');
    }
  } catch (error) {
    console.error('Payment notify error:', error);
    res.send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
  }
});

// 查询订单
router.get('/order/:orderId', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.userId
    });
    
    if (!order) {
      return res.json({ code: 404, message: '订单不存在', data: null });
    }
    
    res.json({
      code: 200,
      message: '获取成功',
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.json({ code: 500, message: '获取失败', data: null });
  }
});

// 生成随机字符串
function generateNonceStr() {
  return Math.random().toString(36).substr(2, 15);
}

// 生成签名
function generateSign(params) {
  const sorted = Object.keys(params).sort().reduce((acc, key) => {
    if (params[key]) {
      acc[key] = params[key];
    }
    return acc;
  }, {});
  
  const stringA = Object.entries(sorted)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  
  const stringSignTemp = `${stringA}&key=${process.env.WECHAT_API_KEY}`;
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
}

module.exports = router;
