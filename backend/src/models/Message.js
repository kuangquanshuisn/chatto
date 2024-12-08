const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Message = sequelize.define('messages', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    comment: '消息ID'
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: '用户ID'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '消息内容'
  },
  is_ai: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否为AI回复'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: '创建时间'
  }
}, {
  tableName: 'messages',
  timestamps: false,
  schema: 'public'
});

// 建立与User模型的关联
Message.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// 同步数据库模型
sequelize.sync({ alter: true })
  .then(() => {
    console.log('消息表同步成功');
  })
  .catch(err => {
    console.error('消息表同步失败:', err);
  });

module.exports = Message;
