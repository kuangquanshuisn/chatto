const express = require('express');
const cors = require('cors');
require('dotenv').config();
const messageController = require('./controllers/messageController');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 基本的路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Chatto API' });
});

// 认证相关路由
app.use('/api/auth', authRoutes);

// 消息相关路由
app.post('/api/messages', messageController.saveMessage);
app.get('/api/messages/:user_id', messageController.getChatHistory);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
