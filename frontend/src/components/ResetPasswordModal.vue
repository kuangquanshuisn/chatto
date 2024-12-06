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
                  :disabled="countdown > 0"
                  class="px-6 h-12 whitespace-nowrap border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ countdown > 0 ? `${countdown}s后重新发送` : '获取验证码' }}
                </button>
              </div>
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
import { ref, reactive } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

defineEmits(['close', 'success'])

const countdown = ref(0)
const form = reactive({
  phone: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
})

const handleSendCode = async () => {
  // TODO: 调用发送验证码的API
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSubmit = async () => {
  if (form.newPassword !== form.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }

  try {
    // TODO: 调用重置密码的API
    // await resetPassword(form)
    alert('密码重置成功')
    form.phone = ''
    form.verificationCode = ''
    form.newPassword = ''
    form.confirmPassword = ''
    emit('success')
    emit('close')
  } catch (error) {
    console.error('重置密码失败:', error)
    alert('重置密码失败，请重试')
  }
}
</script>
