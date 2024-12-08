const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 发送验证码
router.post('/send-code', authController.sendVerificationCode);

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

module.exports = router;
