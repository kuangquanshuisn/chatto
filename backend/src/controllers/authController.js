const User = require('../models/User');
const { validateEmail, validatePassword } = require('../utils/validators');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ message: '所有字段都是必填的' });
    }

    // 验证邮箱格式
    if (!validateEmail(email)) {
      return res.status(400).json({ message: '邮箱格式不正确' });
    }

    // 验证密码强度
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: '密码必须至少8个字符，包含大小写字母、数字和特殊字符' 
      });
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: '用户名已被使用' });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: '邮箱已被注册' });
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      password_hash: password
    });

    res.status(201).json({
      message: '注册成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ message: '服务器错误，请稍后重试' });
  }
};
