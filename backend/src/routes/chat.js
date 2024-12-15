const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { ChatList, Message } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// 配置 dayjs 使用时区插件
dayjs.extend(utc);
dayjs.extend(timezone);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 使用认证中间件保护所有路由
router.use(authenticateToken);

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, model = 'gpt-4o-mini', chatId } = req.body;
    const user_code = req.user.user_code;

    // 验证必需的参数
    if (!message || !chatId) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 先保存用户的消息
    await Message.create({
      chat_id: chatId,
      user_code: user_code,
      content: message,
      is_ai: false,
      created_at: dayjs().tz('Asia/Shanghai').toDate()
    });

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    let fullResponse = '';

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      
      res.write(`data: ${JSON.stringify({
        id: Date.now().toString(),
        content: content,
        isAI: true,
        model: model,
        timestamp: dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
        done: false
      })}\n\n`);
    }

    // 保存 AI 的完整回复
    await Message.create({
      chat_id: chatId,
      user_code: user_code,
      content: fullResponse,
      is_ai: true,
      model: model,
      created_at: dayjs().tz('Asia/Shanghai').toDate()
    });

    // Send the final message indicating completion
    res.write(`data: ${JSON.stringify({
      id: Date.now().toString(),
      content: fullResponse,
      isAI: true,
      model: model,
      timestamp: dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
      done: true
    })}\n\n`);

    // 更新聊天列表的更新时间
    await ChatList.update(
      { updated_at: dayjs().tz('Asia/Shanghai').toDate() },
      { where: { id: chatId } }
    );

    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
    res.end();
  }
});

// 获取聊天记录
router.get('/history', async (req, res) => {
  // In a real application, this would fetch from a database
  res.json([]);
});

// Get available models
router.get('/models', (req, res) => {
  try {
    const modelsStr = process.env.OPENAI_MODEL || '';
    const models = modelsStr.split(',').filter(model => model.trim() !== '');
    res.json({ models });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取用户的所有聊天列表
router.get('/chat-lists', async (req, res) => {
  try {
    const user_code = req.user.user_code;
    const chatLists = await ChatList.findAll({
      where: { user_code },
      order: [['updated_at', 'DESC']],
    });

    // 检查 chatLists 是否为空
    if (chatLists.length === 0) {
      const newChatList = await ChatList.create({
        user_code,
        title: '默认聊天标题', // 提供默认标题
        tags: [], // 提供默认标签
      });
      return res.json(newChatList); // 返回新建的数据
    }

    res.json(chatLists);
  } catch (error) {
    console.error('获取聊天列表失败:', error);
    res.status(500).json({ error: '获取聊天列表失败' });
  }
});

// 添加获取特定聊天记录的路由
router.get('/messages/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const user_code = req.user.user_code;

    const messages = await Message.findAll({
      where: { 
        chat_id: chatId,
        user_code: user_code 
      },
      order: [['created_at', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('获取聊天记录失败:', error);
    res.status(500).json({ error: '获取聊天记录失败' });
  }
});

module.exports = router;
