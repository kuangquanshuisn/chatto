<template>
  <div class="register-container">
    <div class="register-box">
      <h2>注册账号</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="请输入用户名"
            required
          />
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="请输入邮箱"
            required
          />
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            required
          />
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? '注册中...' : '注册' }}
        </button>

        <p class="login-link">
          已有账号？<router-link to="/login">立即登录</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(false);

const formData = reactive({
  username: '',
  email: '',
  password: ''
});

const errors = reactive({
  username: '',
  email: '',
  password: ''
});

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.email = '';
  errors.password = '';

  if (!formData.username) {
    errors.username = '用户名不能为空';
    isValid = false;
  }

  if (!formData.email) {
    errors.email = '邮箱不能为空';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '邮箱格式不正确';
    isValid = false;
  }

  if (!formData.password) {
    errors.password = '密码不能为空';
    isValid = false;
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
    errors.password = '密码必须至少8个字符，包含大小写字母、数字和特殊字符';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    const response = await axios.post('http://localhost:3000/api/auth/register', formData);
    
    if (response.data) {
      alert('注册成功！');
      router.push('/login');
    }
  } catch (error) {
    if (error.response) {
      const { message } = error.response.data;
      if (message.includes('用户名')) {
        errors.username = message;
      } else if (message.includes('邮箱')) {
        errors.email = message;
      } else {
        alert(message || '注册失败，请重试');
      }
    } else {
      alert('注册失败，请检查网络连接');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #666;
  font-size: 0.9rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

button {
  background-color: #4a90e2;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #357abd;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.8rem;
}

.login-link {
  text-align: center;
  font-size: 0.9rem;
  color: #666;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
