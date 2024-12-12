const sequelize = require('./database');
const { User, ChatList, Message } = require('../models');

async function initDatabase() {
  try {
    // 开启事务确保数据一致性
    await sequelize.transaction(async (t) => {
      // 1. 同步 User 表
      await User.sync({ 
        force: false,
        alter: false,
        transaction: t 
      });
      console.log('User 表同步完成');

      // 2. 同步 ChatList 表
      await ChatList.sync({ 
        force: false,
        alter: false,
        transaction: t 
      });
      console.log('ChatList 表同步完成');

      // 3. 同步 Message 表
      await Message.sync({ 
        force: false,
        alter: false,
        transaction: t 
      });
      console.log('Message 表同步完成');

      // 4. 确保所有外键约束都正确创建
      await sequelize.sync({ 
        force: false,
        alter: false,
        transaction: t 
      });
      console.log('所有表关联关系同步完成');
    });

    console.log('数据库初始化完成');
    
  } catch (error) {
    console.error('数据库同步失败:', error);
    throw error;
  }
}

// 检查数据库连接
async function checkDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
    return true;
  } catch (error) {
    console.error('数据库连接失败:', error);
    return false;
  }
}

module.exports = { 
  initDatabase,
  checkDatabaseConnection
}; 