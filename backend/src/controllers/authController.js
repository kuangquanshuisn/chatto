const User = require('../models/User');
const codeStorage = require('../utils/codeStorage');
const { generateToken } = require('../utils/jwt');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// 发送验证码
exports.sendVerificationCode = async (req, res) => {
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

    // 检查手机号是否已被注册
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被注册',
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
};

// 用户注册
exports.register = async (req, res) => {
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

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: '用户名已被使用',
        field: 'username'
      });
    }

    // 检查手机号是否已被注册
    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被注册',
        field: 'phone'
      });
    }

    // 生成密码哈希（bcrypt会自动生成和使用盐）
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      phone,
      password: hashedPassword,
      status: 1,
      is_verified: true
    });

    // 生成 token
    const token = generateToken({ id: user.id });

    // 清除验证码
    codeStorage.removeCode(phone);

    res.json({
      success: true,
      message: '注册成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '注册失败，请重试'
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { account, password } = req.body;

    // 验证输入
    if (!account || !password) {
      return res.status(400).json({
        success: false,
        message: '请输入账号和密码',
        field: !account ? 'account' : 'password'
      });
    }

    // 查找用户（支持使用用户名或手机号登录）
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: account },
          { phone: account }
        ]
      },
      attributes: {
        include: ['password'] // 确保包含密码字段
      }
    });

    // 用户不存在
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '账号或密码错误',
        field: 'account'
      });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: '账号或密码错误',
        field: 'password'
      });
    }

    // 生成 token
    const token = generateToken({ id: user.id });

    res.json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        status: user.status
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '登录失败，请重试'
    });
  }
};

// 发送重置密码验证码
exports.sendResetCode = async (req, res) => {
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

    // 检查手机号是否存在
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '该手机号未注册',
        field: 'phone'
      });
    }

    // 生成验证码
    const code = codeStorage.generateCode();
    
    // 存储验证码
    codeStorage.setCode(phone, code);

    // 在控制台打印验证码（实际项目中应该通过短信服务发送）
    console.log(`发送重置密码验证码到 ${phone}: ${code}`);

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
};

// 重置密码
exports.resetPassword = async (req, res) => {
  try {
    const { phone, verificationCode, newPassword } = req.body;

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

    // 验证新密码
    if (!newPassword || newPassword.length < 8 || newPassword.length > 20) {
      return res.status(400).json({
        success: false,
        message: '密码长度必须在8-20个字符之间',
        field: 'newPassword'
      });
    }

    // 查找用户
    const user = await User.findOne({
      where: { phone },
      attributes: {
        include: ['password'] // 确保包含密码字段
      }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '用户不存在',
        field: 'phone'
      });
    }

    // 生成新的密码哈希
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await user.update({ 
      password: hashedPassword
    });

    // 清除验证码
    codeStorage.removeCode(phone);

    res.json({
      success: true,
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({
      success: false,
      message: '重置密码失败，请重试'
    });
  }
};
