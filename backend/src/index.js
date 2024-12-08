const express = require('express');
const cors = require('cors');
require('dotenv').config();
const messageController = require('./controllers/messageController');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 基本的路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Chatto API' });
});

// 消息相关路由
app.post('/api/messages', messageController.saveMessage);
app.get('/api/messages/:user_id', messageController.getChatHistory);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
