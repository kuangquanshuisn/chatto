const tokenBlacklist = new Set(); // 使用Set来存储黑名单token

// 将token添加到黑名单
function blacklistToken(token) {
  return new Promise((resolve, reject) => {
    try {
      tokenBlacklist.add(token); // 将token添加到Set中
      resolve(); // 成功时解析Promise
    } catch (error) {
      reject(error); // 发生错误时拒绝Promise
    }
  });
}

// 检查token是否在黑名单中
function isTokenBlacklisted(token) {
  return tokenBlacklist.has(token);
}

module.exports = { blacklistToken, isTokenBlacklisted }; 