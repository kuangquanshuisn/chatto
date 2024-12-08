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

const validateForm = () => {
  let isValid = true;
  // 清空所有错误
  Object.keys(errors).forEach(key => errors[key] = '');

  // 用户名验证
  if (!formData.username) {
    errors.username = 'Username is required';
    isValid = false;
  } else if (formData.username.length < 3 || formData.username.length > 20) {
    errors.username = 'Username must be between 3 and 20 characters';
    isValid = false;
  }

  // 手机号验证
  if (!formData.phone) {
    errors.phone = 'Phone number is required';
    isValid = false;
  } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
    isValid = false;
  }

  // 验证码验证
  if (!formData.verificationCode) {
    errors.verificationCode = 'Verification code is required';
    isValid = false;
  } else if (!/^\d{6}$/.test(formData.verificationCode)) {
    errors.verificationCode = 'Please enter a valid 6-digit code';
    isValid = false;
  }

  // 密码验证
  if (!formData.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  }

  // 确认密码验证
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
    isValid = false;
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
};

const sendVerificationCode = async () => {
  // 清空手机号相关错误
  errors.phone = '';
  
  // 验证手机号
  if (!formData.phone) {
    errors.phone = 'Phone number is required';
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
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
    if (error.response?.data?.message) {
      errors.phone = error.response.data.message;
    } else {
      errors.phone = 'Failed to send verification code';
    }
  } finally {
    isCodeSending.value = false;
  }
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
      alert('Registration successful!');
      router.push('/login');
    }
  } catch (error) {
    if (error.response?.data) {
      const { message, field } = error.response.data;
      if (field && errors.hasOwnProperty(field)) {
        errors[field] = message;
      } else {
        alert(message || 'Registration failed. Please try again.');
      }
    } else {
      alert('Registration failed. Please try again.');
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
