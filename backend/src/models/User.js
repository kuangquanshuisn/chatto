const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // 引入uuid库

const User = sequelize.define('users', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    comment: '用户ID'
  },
  user_code: { // 新增用户编码字段
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
    defaultValue: uuidv4().replace(/-/g, ''), // 去掉连字符
    comment: '用户编码'
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: '手机号'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: '邮箱'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '密码哈希'
  },
  status: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
    comment: '用户状态(1-正常 2-禁用 3-注销)'
  },
  register_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '注册时间'
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: '是否已验证'
  }
}, {
  tableName: 'users',
  timestamps: false,
  schema: 'public', // PostgreSQL schema
  defaultScope: {
    attributes: { exclude: ['password'] }
  }
});

// 同步数据库模型
sequelize.sync({ alter: true })
  .then(() => {
    console.log('用户表同步成功');
  })
  .catch(err => {
    console.error('用户表同步失败:', err);
  });

module.exports = User;
