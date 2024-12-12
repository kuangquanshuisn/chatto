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
  user_code: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
    defaultValue: () => uuidv4().replace(/-/g, ''),
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
    validate: {
      is: /^1[3-9]\d{9}$/
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '密码哈希'
  },
  status: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
    validate: {
      isIn: [[1, 2, 3]]
    }
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
  },
  hooks: {
    beforeCreate: (user) => {
      if (!user.user_code) {
        user.user_code = uuidv4().replace(/-/g, '');
      }
    }
  },
  indexes: [
    {
      unique: true,
      fields: ['user_code']
    },
    {
      unique: true,
      fields: ['phone']
    },
    {
      unique: true,
      fields: ['email']
    }
  ]
});

module.exports = User;
