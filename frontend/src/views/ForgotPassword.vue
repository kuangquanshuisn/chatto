<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
    <!-- Logo -->
    <div class="mb-16">
      <h1 class="text-4xl font-bold tracking-tighter">OI</h1>
    </div>
    
    <!-- Forgot Password Card -->
    <div class="w-full max-w-sm">
      <h2 class="text-xl font-semibold text-center mb-6">Reset Password</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 手机号码 -->
        <div class="space-y-2">
          <input
            type="tel"
            v-model="form.phone"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Phone Number"
            required
          />
          <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>
        </div>

        <!-- 验证码 -->
        <div class="space-y-2">
          <div class="flex space-x-2">
            <input
              type="text"
              v-model="form.verificationCode"
              class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Verification Code"
              required
            />
            <button
              type="button"
              @click="handleSendCode"
              :disabled="countdown > 0"
              class="px-6 h-12 whitespace-nowrap border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ countdown > 0 ? `${countdown}s` : 'Get Code' }}
            </button>
          </div>
          <span v-if="errors.verificationCode" class="text-red-500 text-sm">{{ errors.verificationCode }}</span>
        </div>

        <!-- 新密码 -->
        <div class="space-y-2">
          <input
            type="password"
            v-model="form.newPassword"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="New Password"
            required
          />
          <span v-if="errors.newPassword" class="text-red-500 text-sm">{{ errors.newPassword }}</span>
        </div>

        <!-- 确认新密码 -->
        <div class="space-y-2">
          <input
            type="password"
            v-model="form.confirmPassword"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Confirm Password"
            required
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
        </div>

        <button 
          type="submit"
          :disabled="isLoading"
          class="w-full h-12 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-300 ease-in-out disabled:bg-gray-400"
        >
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        <router-link to="/login" class="text-black hover:text-gray-800 font-medium">
          Back to Sign in
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';

const router = useRouter();
const isLoading = ref(false);
const countdown = ref(0);

const form = reactive({
  phone: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
});

const errors = reactive({
  phone: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
});

const validateForm = () => {
  let isValid = true;
  errors.phone = '';
  errors.verificationCode = '';
  errors.newPassword = '';
  errors.confirmPassword = '';

  // 验证手机号
  if (!form.phone) {
    errors.phone = '请输入手机号码';
    isValid = false;
  } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入正确的手机号码';
    isValid = false;
  }

  // 验证验证码
  if (!form.verificationCode) {
    errors.verificationCode = '请输入验证码';
    isValid = false;
  }

  // 验证新密码
  if (!form.newPassword) {
    errors.newPassword = '请输入新密码';
    isValid = false;
  } else if (form.newPassword.length < 8 || form.newPassword.length > 20) {
    errors.newPassword = '密码长度必须在8-20个字符之间';
    isValid = false;
  }

  // 验证确认密码
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认新密码';
    isValid = false;
  } else if (form.confirmPassword !== form.newPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }

  return isValid;
};

const handleSendCode = async () => {
  try {
    // 验证手机号
    if (!form.phone || !/^1[3-9]\d{9}$/.test(form.phone)) {
      errors.phone = '请输入正确的手机号码';
      return;
    }

    isLoading.value = true;
    const response = await axios.post('/api/auth/send-reset-code', {
      phone: form.phone
    });

    if (response.data.success) {
      // 开始倒计时
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  } catch (error) {
    if (error.response?.data?.field === 'phone') {
      errors.phone = error.response.data.message;
    } else {
      alert(error.response?.data?.message || '发送验证码失败，请重试');
    }
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    if (!validateForm()) return;

    isLoading.value = true;
    const response = await axios.post('/api/auth/reset-password', {
      phone: form.phone,
      verificationCode: form.verificationCode,
      newPassword: form.newPassword
    });

    if (response.data.success) {
      alert('密码重置成功！');
      router.push('/login');
    }
  } catch (error) {
    const field = error.response?.data?.field;
    if (field && errors[field] !== undefined) {
      errors[field] = error.response.data.message;
    } else {
      alert(error.response?.data?.message || '重置密码失败，请重试');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
