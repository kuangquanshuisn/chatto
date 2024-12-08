const Message = require('../models/Message');

// 存储新消息
exports.saveMessage = async (req, res) => {
  try {
    const { user_id, content, is_ai } = req.body;
    const message = await Message.create({
      user_id,
      content,
      is_ai
    });
    res.status(201).json(message);
  } catch (error) {
    console.error('保存消息失败:', error);
    res.status(500).json({ error: '保存消息失败' });
  }
};

// 获取用户的聊天历史记录
exports.getChatHistory = async (req, res) => {
  try {
    const { user_id } = req.params;
    const messages = await Message.findAll({
      where: { user_id },
      order: [['created_at', 'DESC']],
      limit: 100 // 限制返回最近的100条消息
    });
    res.json(messages);
  } catch (error) {
    console.error('获取聊天历史记录失败:', error);
    res.status(500).json({ error: '获取聊天历史记录失败' });
  }
};
