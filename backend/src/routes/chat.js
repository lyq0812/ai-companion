const express = require('express');
const axios = require('axios');
const ChatMessage = require('../models/ChatMessage');
const Companion = require('../models/Companion');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 获取聊天记录
router.get('/messages/:companionId', authenticate, async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const companionId = req.params.companionId;
    
    // 验证数字人归属
    const companion = await Companion.findOne({
      _id: companionId,
      userId: req.userId
    });
    
    if (!companion) {
      return res.json({ code: 404, message: '数字人不存在', data: null });
    }
    
    const messages = await ChatMessage.find({
      companionId,
      userId: req.userId
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(parseInt(pageSize));
    
    res.json({
      code: 200,
      message: '获取成功',
      data: {
        list: messages.reverse(),
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.json({ code: 500, message: '获取失败', data: null });
  }
});

// 发送消息
router.post('/send', authenticate, async (req, res) => {
  try {
    const { companionId, content } = req.body;
    
    if (!companionId || !content) {
      return res.json({ code: 400, message: '参数错误', data: null });
    }
    
    // 验证数字人
    const companion = await Companion.findOne({
      _id: companionId,
      userId: req.userId
    });
    
    if (!companion) {
      return res.json({ code: 404, message: '数字人不存在', data: null });
    }
    
    // 保存用户消息
    const userMessage = new ChatMessage({
      userId: req.userId,
      companionId,
      content,
      isUser: true
    });
    await userMessage.save();
    
    // 更新数字人统计
    companion.chatCount += 1;
    companion.lastChatTime = new Date();
    await companion.save();
    
    // 调用AI生成回复
    const aiReply = await generateAIReply(companion, content, req.userId);
    
    // 保存AI回复
    const aiMessage = new ChatMessage({
      userId: req.userId,
      companionId,
      content: aiReply,
      isUser: false
    });
    await aiMessage.save();
    
    res.json({
      code: 200,
      message: '发送成功',
      data: {
        messageId: userMessage._id,
        reply: aiReply,
        replyId: aiMessage._id
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.json({ code: 500, message: '发送失败', data: null });
  }
});

// 生成AI回复
async function generateAIReply(companion, userMessage, userId) {
  try {
    // 获取最近的历史消息（用于上下文）
    const historyMessages = await ChatMessage.find({
      companionId: companion._id,
      userId
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('content isUser');
    
    // 构建对话历史
    const messages = [
      { role: 'system', content: companion.personalityPrompt }
    ];
    
    // 添加历史消息（倒序转回正序）
    historyMessages.reverse().forEach(msg => {
      messages.push({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      });
    });
    
    // 添加当前消息
    messages.push({ role: 'user', content: userMessage });
    
    // 调用AI API（这里使用示例，实际接入具体AI服务）
    // const aiRes = await axios.post(process.env.AI_API_URL, {
    //   model: 'gpt-3.5-turbo',
    //   messages,
    //   temperature: 0.8,
    //   max_tokens: 200
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.AI_API_KEY}`
    //   }
    // });
    // return aiRes.data.choices[0].message.content;
    
    // 模拟AI回复（实际项目中替换为真实AI调用）
    const mockReplies = [
      `嗯，我明白你的意思。${userMessage.slice(0, 10)}...这件事确实值得好好想想。`,
      '你说得对，我一直都觉得是这样。生活中有很多美好的事情等着我们去发现。',
      '哈哈，听你这么说我也很开心。记得要照顾好自己，不要太累了。',
      '时间过得真快啊，想起以前的日子，真的很怀念。不过现在也很好，看到你这么努力，我很欣慰。',
      '这个问题嘛，我觉得你可以试试看，不管结果如何，至少不会后悔。',
      '我知道你心里在想什么，有时候放慢脚步，好好享受当下也很重要。'
    ];
    
    // 根据用户消息长度和内容选择回复
    const index = userMessage.length % mockReplies.length;
    return mockReplies[index];
    
  } catch (error) {
    console.error('Generate AI reply error:', error);
    return '抱歉，我刚才有点走神了，你能再说一遍吗？';
  }
}

module.exports = router;