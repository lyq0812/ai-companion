const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取用户信息
router.get('/info', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.json({ code: 404, message: '用户不存在', data: null });
    }
    
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar,
        phone: user.phone,
        isVip: user.isVip,
        vipExpireTime: user.vipExpireTime,
        vipType: user.vipType,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.json({ code: 500, message: '获取失败', data: null });
  }
});

// 更新用户信息
router.put('/info', authenticate, async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { nickname, avatar } },
      { new: true }
    );
    
    if (!user) {
      return res.json({ code: 404, message: '用户不存在', data: null });
    }
    
    res.json({
      code: 200,
      message: '更新成功',
      data: {
        id: user._id,
        nickname: user.nickname,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update user info error:', error);
    res.json({ code: 500, message: '更新失败', data: null });
  }
});

module.exports = router;
