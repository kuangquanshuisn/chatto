import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const authApi = {
  // 发送验证码
  sendVerificationCode: async (phone) => {
    const response = await axios.post(`${API_URL}/auth/send-code`, { phone });
    return response.data;
  },

  // 注册
  register: async (userData) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  // 登录
  login: async (loginData) => {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    return response.data;
  }
};
