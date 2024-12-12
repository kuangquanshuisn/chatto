const User = require('./User');
const ChatList = require('./ChatList');
const Message = require('./Message');

// 定义关联关系
User.hasMany(ChatList, {
  foreignKey: 'user_code',
  sourceKey: 'user_code',
  as: 'chatLists'
});

ChatList.belongsTo(User, {
  foreignKey: 'user_code',
  targetKey: 'user_code',
  as: 'user'
});

ChatList.hasMany(Message, {
  foreignKey: 'chat_id',
  sourceKey: 'id',
  as: 'messages'
});

Message.belongsTo(ChatList, {
  foreignKey: 'chat_id',
  targetKey: 'id',
  as: 'chatList'
});

User.hasMany(Message, {
  foreignKey: 'user_code',
  sourceKey: 'user_code',
  as: 'messages'
});

Message.belongsTo(User, {
  foreignKey: 'user_code',
  targetKey: 'user_code',
  as: 'user'
});

module.exports = {
  User,
  ChatList,
  Message
}; 