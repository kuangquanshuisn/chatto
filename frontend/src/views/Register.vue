<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
    <!-- Logo -->
    <div class="mb-16">
      <h1 class="text-4xl font-bold tracking-tighter">OI</h1>
    </div>
    
    <!-- Register Card -->
    <div class="w-full max-w-sm">
      <h2 class="text-xl font-semibold text-center mb-6">Create Account</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="space-y-2">
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="Username"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>
        </div>
        
        <div class="space-y-2">
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="Email"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
        </div>

        <div class="space-y-2">
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Password"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>

        <div class="space-y-2">
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full h-12 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-300 ease-in-out disabled:bg-gray-400"
        >
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        <span class="text-gray-600">Already have an account? </span>
        <router-link to="/login" class="text-black hover:text-gray-800 font-medium">
          Sign in
        </router-link>
      </div>
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
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';

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

  if (!formData.confirmPassword) {
    errors.confirmPassword = '请确认密码';
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
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
