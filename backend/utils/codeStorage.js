// 简单的内存存储，用于存储验证码
class CodeStorage {
  constructor() {
    this.storage = new Map();
    this.expirationTime = 5 * 60 * 1000; // 5分钟过期
  }

  // 生成6位随机验证码
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 存储验证码
  setCode(phone, code) {
    this.storage.set(phone, {
      code,
      timestamp: Date.now()
    });
  }

  // 获取验证码
  getCode(phone) {
    const data = this.storage.get(phone);
    if (!data) return null;

    // 检查是否过期
    if (Date.now() - data.timestamp > this.expirationTime) {
      this.storage.delete(phone);
      return null;
    }

    return data.code;
  }

  // 验证验证码
  verifyCode(phone, code) {
    const storedCode = this.getCode(phone);
    if (!storedCode) return false;
    return storedCode === code;
  }

  // 删除验证码
  removeCode(phone) {
    this.storage.delete(phone);
  }
}

module.exports = new CodeStorage();
