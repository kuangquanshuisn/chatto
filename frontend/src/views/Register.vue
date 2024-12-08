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
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="Phone Number"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</span>
        </div>

        <div class="space-y-2">
          <div class="flex space-x-2">
            <input
              id="verificationCode"
              v-model="formData.verificationCode"
              type="text"
              placeholder="Verification Code"
              class="flex-1 h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              @click="sendVerificationCode"
              :disabled="isCodeSending || countdown > 0"
              class="w-32 h-12 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 transition duration-300 ease-in-out disabled:bg-gray-50 disabled:text-gray-400"
            >
              {{ countdown > 0 ? `${countdown}s` : 'Get Code' }}
            </button>
          </div>
          <span v-if="errors.verificationCode" class="text-red-500 text-sm">{{ errors.verificationCode }}</span>
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
import { ref, reactive, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const isLoading = ref(false);
const isCodeSending = ref(false);
const countdown = ref(0);
let countdownTimer = null;

const formData = reactive({
  username: '',
  phone: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  username: '',
  phone: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
});

const startCountdown = () => {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownTimer);
    }
  }, 1000);
};

const sendVerificationCode = async () => {
  // 验证手机号
  if (!formData.phone) {
    errors.phone = '请输入手机号码';
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.phone = '请输入正确的手机号码';
    return;
  }

  try {
    isCodeSending.value = true;
    // 调用发送验证码的API
    await axios.post('http://localhost:3000/api/auth/send-code', {
      phone: formData.phone
    });
    startCountdown();
  } catch (error) {
    if (error.response) {
      errors.phone = error.response.data.message || '发送验证码失败';
    } else {
      errors.phone = '发送验证码失败，请重试';
    }
  } finally {
    isCodeSending.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.phone = '';
  errors.verificationCode = '';
  errors.password = '';
  errors.confirmPassword = '';

  if (!formData.username) {
    errors.username = '用户名不能为空';
    isValid = false;
  }

  if (!formData.phone) {
    errors.phone = '手机号码不能为空';
    isValid = false;
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.phone = '请输入正确的手机号码';
    isValid = false;
  }

  if (!formData.verificationCode) {
    errors.verificationCode = '请输入验证码';
    isValid = false;
  } else if (!/^\d{6}$/.test(formData.verificationCode)) {
    errors.verificationCode = '验证码格式不正确';
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
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      username: formData.username,
      phone: formData.phone,
      verificationCode: formData.verificationCode,
      password: formData.password
    });
    
    if (response.data) {
      alert('注册成功！');
      router.push('/login');
    }
  } catch (error) {
    if (error.response) {
      const { message } = error.response.data;
      if (message.includes('用户名')) {
        errors.username = message;
      } else if (message.includes('手机')) {
        errors.phone = message;
      } else if (message.includes('验证码')) {
        errors.verificationCode = message;
      } else {
        alert(message || '注册失败，请重试');
      }
    } else {
      alert('注册失败，请重试');
    }
  } finally {
    isLoading.value = false;
  }
};

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>
