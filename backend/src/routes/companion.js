const express = require('express');
const Companion = require('../models/Companion');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取用户的数字人列表
router.get('/', authenticate, async (req, res) => {
  try {
    const companions = await Companion.find({ 
      userId: req.userId,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .select('-personalityPrompt');
    
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: companions,
        total: companions.length
      }
    });
  } catch (error) {
    console.error('Get companions error:', error);
    res.json({ code: 500, message: '获取失败', data: null });
  }
});

// 获取单个数字人详情
router.get('/:id', authenticate, async (req, res) => {
  try {
    const companion = await Companion.findOne({
      _id: req.params.id,
      userId: req.userId
    });
    
    if (!companion) {
      return res.json({ code: 404, message: '数字人不存在', data: null });
    }
    
    res.json({
      code: 200,
      message: '获取成功',
      data: companion
    });
  } catch (error) {
    console.error('Get companion error:', error);
    res.json({ code: 500, message: '获取失败', data: null });
  }
});

// 创建数字人
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      name,
      avatar,
      sceneImage,
      gender,
      birthYear,
      deathYear,
      personality,
      catchphrase,
      speakingStyle,
      habits,
      memories,
      hobbies,
      values,
      voiceUrl
    } = req.body;
    
    // 验证必填字段
    if (!name || !avatar || !sceneImage || !gender || !birthYear || !deathYear) {
      return res.json({ code: 400, message: '请填写完整信息', data: null });
    }
    
    // 检查用户数字人数量限制
    const count = await Companion.countDocuments({ 
      userId: req.userId,
      isActive: true 
    });
    
    // 非会员最多创建1个，会员最多5个
    const user = req.user;
    const maxCount = user.isVip ? 5 : 1;
    
    if (count >= maxCount) {
      return res.json({ 
        code: 403, 
        message: `最多可创建${maxCount}个数字人，请开通会员`, 
        data: null 
      });
    }
    
    // 创建数字人
    const companion = new Companion({
      userId: req.userId,
      name,
      avatar,
      sceneImage,
      gender,
      birthYear,
      deathYear,
      personality,
      catchphrase,
      speakingStyle,
      habits,
      memories,
      hobbies,
      values,
      voiceUrl
    });
    
    // 生成AI人格提示词
    companion.generatePersonalityPrompt();
    
    await companion.save();
    
    res.json({
      code: 200,
      message: '创建成功',
      data: companion
    });
  } catch (error) {
    console.error('Create companion error:', error);
    res.json({ code: 500, message: '创建失败', data: null });
  }
});

// 更新数字人
router.put('/:id', authenticate, async (req, res) => {
  try {
    const companion = await Companion.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    
    if (!companion) {
      return res.json({ code: 404, message: '数字人不存在', data: null });
    }
    
    // 重新生成提示词
    companion.generatePersonalityPrompt();
    await companion.save();
    
    res.json({
      code: 200,
      message: '更新成功',
      data: companion
    });
  } catch (error) {
    console.error('Update companion error:', error);
    res.json({ code: 500, message: '更新失败', data: null });
  }
});

// 删除数字人（软删除）
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const companion = await Companion.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive: false },
      { new: true }
    );
    
    if (!companion) {
      return res.json({ code: 404, message: '数字人不存在', data: null });
    }
    
    res.json({
      code: 200,
      message: '删除成功',
      data: null
    });
  } catch (error) {
    console.error('Delete companion error:', error);
    res.json({ code: 500, message: '删除失败', data: null });
  }
});

module.exports = router;