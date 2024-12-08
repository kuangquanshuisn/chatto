<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">重置密码</h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- 手机号码 -->
            <div class="space-y-2">
              <input
                type="tel"
                v-model="form.phone"
                class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="手机号码"
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
                  placeholder="验证码"
                  required
                />
                <button
                  type="button"
                  @click="handleSendCode"
                  :disabled="isCodeSending || countdown > 0"
                  class="px-6 h-12 whitespace-nowrap border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
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
                placeholder="新密码"
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
                placeholder="确认新密码"
                required
              />
              <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{ errors.confirmPassword }}</span>
            </div>

            <!-- 按钮组 -->
            <div class="flex justify-center gap-4 mt-6">
              <button
                type="button"
                @click="$emit('close')"
                class="w-1/2 h-12 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black transition duration-300 ease-in-out"
              >
                取消
              </button>
              <button
                type="submit"
                class="w-1/2 h-12 rounded-lg bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition duration-300 ease-in-out"
              >
                确认
              </button>
            </div>
          </form>
        </div>

        <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-center space-x-4">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import axios from 'axios'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'success'])

const countdown = ref(0)
const isCodeSending = ref(false)
let countdownTimer = null

const form = reactive({
  phone: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

const errors = reactive({
  phone: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

const validateForm = () => {
  let isValid = true
  errors.phone = ''
  errors.verificationCode = ''
  errors.newPassword = ''
  errors.confirmPassword = ''

  // 验证手机号
  if (!form.phone) {
    errors.phone = '请输入手机号码'
    isValid = false
  } else if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入正确的手机号码'
    isValid = false
  }

  // 验证验证码
  if (!form.verificationCode) {
    errors.verificationCode = '请输入验证码'
    isValid = false
  } else if (!/^\d{6}$/.test(form.verificationCode)) {
    errors.verificationCode = '验证码格式不正确'
    isValid = false
  }

  // 验证新密码
  if (!form.newPassword) {
    errors.newPassword = '请输入新密码'
    isValid = false
  } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.newPassword)) {
    errors.newPassword = '密码必须至少8个字符，包含大小写字母、数字和特殊字符'
    isValid = false
  }

  // 验证确认密码
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认新密码'
    isValid = false
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

const handleSendCode = async () => {
  // 验证手机号
  if (!form.phone) {
    errors.phone = '请输入手机号码'
    return
  }
  if (!/^1[3-9]\d{9}$/.test(form.phone)) {
    errors.phone = '请输入正确的手机号码'
    return
  }

  try {
    isCodeSending.value = true
    // 调用发送验证码的API
    await axios.post('http://localhost:3000/api/auth/reset-password-code', {
      phone: form.phone
    })
    countdown.value = 60
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownTimer)
      }
    }, 1000)
  } catch (error) {
    if (error.response) {
      errors.phone = error.response.data.message || '发送验证码失败'
    } else {
      errors.phone = '发送验证码失败，请重试'
    }
  } finally {
    isCodeSending.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await axios.post('http://localhost:3000/api/auth/reset-password', {
      phone: form.phone,
      verificationCode: form.verificationCode,
      newPassword: form.newPassword
    })
    
    alert('密码重置成功')
    form.phone = ''
    form.verificationCode = ''
    form.newPassword = ''
    form.confirmPassword = ''
    emit('success')
    emit('close')
  } catch (error) {
    if (error.response) {
      const { message } = error.response.data
      if (message.includes('手机')) {
        errors.phone = message
      } else if (message.includes('验证码')) {
        errors.verificationCode = message
      } else if (message.includes('密码')) {
        errors.newPassword = message
      } else {
        alert(message || '重置密码失败，请重试')
      }
    } else {
      alert('重置密码失败，请重试')
    }
  }
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>
