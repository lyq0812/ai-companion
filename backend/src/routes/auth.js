const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSMS } = require('../utils/sms');

const router = express.Router();

// 存储验证码（生产环境应使用Redis）
const codeStore = new Map();

// 发送验证码
router.post('/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.json({ code: 400, message: '手机号格式错误', data: null });
    }
    
    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 存储验证码（5分钟有效）
    codeStore.set(phone, {
      code,
      expireTime: Date.now() + 5 * 60 * 1000
    });
    
    // 发送短信（这里模拟发送，实际接入短信服务商）
    // await sendSMS(phone, code);
    console.log(`验证码已发送: ${phone} - ${code}`);
    
    res.json({ code: 200, message: '发送成功', data: null });
  } catch (error) {
    console.error('Send code error:', error);
    res.json({ code: 500, message: '发送失败', data: null });
  }
});

// 手机号登录
router.post('/login', async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    if (!phone || !code) {
      return res.json({ code: 400, message: '参数错误', data: null });
    }
    
    // 验证验证码
    const storedCode = codeStore.get(phone);
    if (!storedCode || storedCode.code !== code || Date.now() > storedCode.expireTime) {
      return res.json({ code: 400, message: '验证码错误或已过期', data: null });
    }
    
    // 清除验证码
    codeStore.delete(phone);
    
    // 查找或创建用户
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = new User({
        phone,
        nickname: `用户${phone.slice(-4)}`
      });
    }
    
    // 更新登录信息
    user.lastLoginTime = new Date();
    user.loginCount += 1;
    await user.save();
    
    // 生成token
    const token = generateToken(user._id);
    
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          isVip: user.isVip,
          vipExpireTime: user.vipExpireTime,
          vipType: user.vipType
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.json({ code: 500, message: '登录失败', data: null });
  }
});

// 微信登录
router.post('/wechat-login', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.json({ code: 400, message: '参数错误', data: null });
    }
    
    // 调用微信接口获取openid
    const wxRes = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
      params: {
        appid: process.env.WECHAT_APPID,
        secret: process.env.WECHAT_SECRET,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });
    
    const { openid, unionid, session_key } = wxRes.data;
    
    if (!openid) {
      return res.json({ code: 400, message: '微信登录失败', data: null });
    }
    
    // 查找或创建用户
    let user = await User.findOne({ openid });
    
    if (!user) {
      user = new User({
        openid,
        unionid,
        nickname: '微信用户'
      });
    }
    
    // 更新登录信息
    user.lastLoginTime = new Date();
    user.loginCount += 1;
    await user.save();
    
    // 生成token
    const token = generateToken(user._id);
    
    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: user._id,
          nickname: user.nickname,
          avatar: user.avatar,
          phone: user.phone,
          isVip: user.isVip,
          vipExpireTime: user.vipExpireTime,
          vipType: user.vipType
        }
      }
    });
  } catch (error) {
    console.error('Wechat login error:', error);
    res.json({ code: 500, message: '登录失败', data: null });
  }
});

// 绑定手机号
router.post('/bind-phone', async (req, res) => {
  try {
    const { userId, phone, code } = req.body;
    
    // 验证验证码
    const storedCode = codeStore.get(phone);
    if (!storedCode || storedCode.code !== code) {
      return res.json({ code: 400, message: '验证码错误', data: null });
    }
    
    // 检查手机号是否已被绑定
    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.json({ code: 400, message: '该手机号已被绑定', data: null });
    }
    
    // 更新用户手机号
    await User.findByIdAndUpdate(userId, { phone });
    
    codeStore.delete(phone);
    
    res.json({ code: 200, message: '绑定成功', data: null });
  } catch (error) {
    console.error('Bind phone error:', error);
    res.json({ code: 500, message: '绑定失败', data: null });
  }
});

module.exports = router;