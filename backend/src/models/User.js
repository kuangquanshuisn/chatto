const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    comment: '用户ID'
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
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '密码哈希'
  },
  salt: {
    type: DataTypes.STRING(50),
    comment: '密码加盐'
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
    comment: '是否邮箱验证'
  }
}, {
  tableName: 'users',
  timestamps: false,
  schema: 'public', // PostgreSQL schema
  defaultScope: {
    attributes: { exclude: ['password_hash', 'salt'] }
  }
});

// 设置虚拟字段 password
User.prototype.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.salt = salt;
  this.password_hash = await bcrypt.hash(password, salt);
};

// 密码验证方法
User.prototype.validatePassword = async function(password) {
  if (!this.password_hash) return false;
  return await bcrypt.compare(password, this.password_hash);
};

// 在创建用户前处理密码
User.beforeCreate(async (user, options) => {
  if (!options.password) {
    throw new Error('Password is required');
  }
  await user.setPassword(options.password);
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
