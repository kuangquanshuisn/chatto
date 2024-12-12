<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
    <!-- Logo -->
    <div class="mb-16">
      <h1 class="text-4xl font-bold tracking-tighter">OI</h1>
    </div>
    
    <!-- Login Card -->
    <div class="w-full max-w-sm">
      <h2 class="text-xl font-semibold text-center mb-6">Welcome Back</h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <input
            v-model="formData.account"
            type="text"
            placeholder="Username or Phone"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            :class="{'border-red-500': errors.account}"
          />
          <span v-if="errors.account" class="text-red-500 text-sm">{{ errors.account }}</span>
        </div>
        <div class="space-y-2">
          <input
            v-model="formData.password"
            type="password"
            placeholder="Password"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            :class="{'border-red-500': errors.password}"
          />
          <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>
        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full h-12 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-300 ease-in-out disabled:bg-gray-400 flex items-center justify-center"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        <router-link to="/forgot-password" class="text-gray-600 hover:text-gray-800">
          Forgot your Password?
        </router-link>
      </div>
      
      <div class="mt-4 text-center text-sm">
        <span class="text-gray-600">Don't have an account? </span>
        <router-link to="/register" class="text-black hover:text-gray-800 font-medium">
          Sign up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth';

const router = useRouter();
const isLoading = ref(false);

const formData = reactive({
  account: '',
  password: ''
});

// 在组件挂载时检查登录状态和自动填充用户名
onMounted(() => {
  const savedAccount = localStorage.getItem('account');
  if (savedAccount) {
    formData.account = savedAccount;
  }
  checkAuthStatus();
});

// 添加检查登录状态的函数
const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  if (token) {
    router.push('/chat');
  }
};

const errors = reactive({
  account: '',
  password: ''
});

const resetErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '');
};

const validateForm = () => {
  resetErrors();
  let isValid = true;

  // 验证账号
  if (!formData.account) {
    errors.account = 'Please enter your username or phone';
    isValid = false;
  } else if (formData.account.length < 3) {
    errors.account = 'Account must be at least 3 characters';
    isValid = false;
  }

  // 验证密码
  if (!formData.password) {
    errors.password = 'Please enter your password';
    isValid = false;
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  } else if (formData.password.length > 20) {
    errors.password = 'Password must be less than 20 characters';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    const response = await authApi.login(formData);
    
    if (response.success) {
      // 保存登录状态和用户信息
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userCode', response.user.userCode);
      // 保存用户名
      localStorage.setItem('account', formData.account);
      
      // 跳转到聊天页面
      router.push('/chat');
    }
  } catch (error) {
    console.error('Login error:', error);
    const message = error.response?.data?.message || 'Login failed, please try again';
    if (error.response?.data?.field) {
      errors[error.response.data.field] = message;
    } else {
      errors.account = message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>