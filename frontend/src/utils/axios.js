import axios from 'axios';

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://localhost:3000', // 确保这个端口号与你的后端服务器端口一致
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，可以在这里处理登出逻辑
          break;
        case 403:
          // 禁止访问
          break;
        case 404:
          // 未找到
          break;
        case 500:
          // 服务器错误
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
