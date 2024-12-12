const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// 配置 dayjs 使用时区插件
dayjs.extend(utc);
dayjs.extend(timezone);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const jwt = require('jsonwebtoken'); // 引入jsonwebtoken库


// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message, model = 'gpt-4o-mini' } = req.body;

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
      
      // Send the chunk to the client
      res.write(`data: ${JSON.stringify({
        id: Date.now().toString(),
        content: content,
        isAI: true,
        timestamp: dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
        done: false
      })}\n\n`);
    }

    // Send the final message indicating completion
    res.write(`data: ${JSON.stringify({
      id: Date.now().toString(),
      content: fullResponse,
      isAI: true,
      timestamp: dayjs().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'),
      done: true
    })}\n\n`);

    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`);
    res.end();
  }
});

// Get chat history endpoint
router.get('/history', async (req, res) => {
  // In a real application, this would fetch from a database
  res.json([]);
});

// Get available models
router.get('/models', (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]; // 从请求头获取token
    if (!token) {
      return res.status(401).json({ error: '未授权，请登录' }); // 如果没有token，返回401
    }

    // 验证token
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).json({ error: '无效的token，请登录' }); // 如果token无效，返回401
      }

      const modelsStr = process.env.OPENAI_MODEL || '';
      const models = modelsStr.split(',').filter(model => model.trim() !== '');
      
      res.json({ models });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
