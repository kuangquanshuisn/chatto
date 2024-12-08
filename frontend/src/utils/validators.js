// 用户名验证：3-20个字符
export const validateUsername = (username) => {
  if (!username) {
    return '用户名不能为空';
  }
  if (username.length < 3 || username.length > 20) {
    return '用户名长度必须在3-20个字符之间';
  }
  return '';
};

// 手机号验证：中国大陆手机号
export const validatePhone = (phone) => {
  if (!phone) {
    return '手机号不能为空';
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return '请输入正确的手机号码';
  }
  return '';
};

// 验证码验证：6位数字
export const validateVerificationCode = (code) => {
  if (!code) {
    return '验证码不能为空';
  }
  if (!/^\d{6}$/.test(code)) {
    return '验证码必须是6位数字';
  }
  return '';
};

// 密码验证：8-20个字符，包含大小写字母、数字和特殊字符
export const validatePassword = (password) => {
  if (!password) {
    return '密码不能为空';
  }
  if (password.length < 8 || password.length > 20) {
    return '密码长度必须在8-20个字符之间';
  }
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return '密码必须包含大小写字母、数字和特殊字符';
  }
  return '';
};

// 确认密码验证
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return '请确认密码';
  }
  if (password !== confirmPassword) {
    return '两次输入的密码不一致';
  }
  return '';
};
