const express = require('express');
const router = express.Router();
const codeStorage = require('../utils/codeStorage');

// 发送验证码
router.post('/send-code', async (req, res) => {
  try {
    const { phone } = req.body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '请输入正确的手机号码',
        field: 'phone'
      });
    }

    // 生成验证码
    const code = codeStorage.generateCode();
    
    // 存储验证码
    codeStorage.setCode(phone, code);

    // 在控制台打印验证码（实际项目中应该通过短信服务发送）
    console.log(`发送验证码到 ${phone}: ${code}`);

    res.json({
      success: true,
      message: '验证码发送成功'
    });
  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({
      success: false,
      message: '发送验证码失败，请重试'
    });
  }
});

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, phone, verificationCode, password } = req.body;

    // 验证用户名
    if (!username || username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: '用户名长度必须在3-20个字符之间',
        field: 'username'
      });
    }

    // 验证手机号
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '请输入正确的手机号码',
        field: 'phone'
      });
    }

    // 验证验证码
    if (!verificationCode || !codeStorage.verifyCode(phone, verificationCode)) {
      return res.status(400).json({
        success: false,
        message: '验证码错误或已过期',
        field: 'verificationCode'
      });
    }

    // 验证密码
    if (!password || password.length < 8 || password.length > 20) {
      return res.status(400).json({
        success: false,
        message: '密码长度必须在8-20个字符之间',
        field: 'password'
      });
    }

    // TODO: 实际项目中，这里应该：
    // 1. 检查用户名和手机号是否已被注册
    // 2. 对密码进行加密
    // 3. 将用户信息保存到数据库

    // 注册成功后，删除验证码
    codeStorage.removeCode(phone);

    res.json({
      success: true,
      message: '注册成功'
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请重试'
    });
  }
});

module.exports = router;
