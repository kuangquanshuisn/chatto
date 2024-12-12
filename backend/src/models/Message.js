const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('messages', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: '消息ID'
  },
  chat_id: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: '聊天记录ID',
    references: {
      model: 'chat_lists',
      key: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  },
  user_code: {
    type: DataTypes.STRING(32),
    allowNull: false,
    comment: '用户编码',
    references: {
      model: 'users',
      key: 'user_code',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    comment: '消息内容'
  },
  is_ai: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否为AI回复'
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'AI模型名称'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'messages',
  timestamps: false,
  schema: 'public',
  indexes: [
    {
      fields: ['chat_id']
    },
    {
      fields: ['user_code']
    },
    {
      fields: ['created_at']
    }
  ]
});

module.exports = Message;
