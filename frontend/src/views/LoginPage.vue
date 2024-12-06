<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
    <!-- Logo -->
    <div class="mb-16">
      <h1 class="text-4xl font-bold tracking-tighter">OI</h1>
    </div>
    
    <!-- Login Card -->
    <div class="w-full max-w-sm">
      <h2 class="text-xl font-semibold text-center mb-6">Welcome Back</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span v-if="errors.username" class="text-red-500 text-sm">{{ errors.username }}</span>
        </div>
        <div class="space-y-2">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
        </div>
        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full h-12 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-300 ease-in-out disabled:bg-gray-400"
        >
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const isLoading = ref(false)

const errors = reactive({
  username: '',
  password: ''
})

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.password = '';

  if (!username.value) {
    errors.username = '请输入用户名';
    isValid = false;
  }

  if (!password.value) {
    errors.password = '请输入密码';
    isValid = false;
  }

  return isValid;
}

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    isLoading.value = true;
    
    // 模拟登录验证
    if (username.value === '1' && password.value === '1') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟网络延迟
      router.push('/chat');
    } else {
      errors.password = '用户名或密码错误';
    }
  } catch (error) {
    errors.password = '登录失败，请重试';
  } finally {
    isLoading.value = false;
  }
}
</script>