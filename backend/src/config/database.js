const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('postgresql://neondb_owner:jO6PsTQiy9XG@ep-withered-forest-a1qplclv.ap-southeast-1.aws.neon.tech/neondb?sslmode=require', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

module.exports = sequelize;
