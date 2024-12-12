const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatList = sequelize.define('chat_lists', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: '聊天记录ID'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    },
    comment: '聊天标题'
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
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    validate: {
      isValidTagArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Tags must be an array');
        }
        if (value.some(tag => typeof tag !== 'string')) {
          throw new Error('All tags must be strings');
        }
      }
    }
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '更新时间'
  }
}, {
  tableName: 'chat_lists',
  timestamps: true,
  schema: 'public',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeUpdate: (chatList) => {
      chatList.updated_at = new Date();
    }
  },
  indexes: [
    {
      fields: ['user_code']
    }
  ]
});

module.exports = ChatList; 