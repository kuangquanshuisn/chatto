<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">个人信息</h2>
      
      <!-- 用户信息部分 -->
      <div class="space-y-6">
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600 mb-1">用户名</label>
          <div class="text-gray-800 p-2 bg-gray-50 rounded-md">{{ userInfo.username }}</div>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600 mb-1">手机号码</label>
          <div class="text-gray-800 p-2 bg-gray-50 rounded-md">{{ userInfo.phone }}</div>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600 mb-1">邮箱</label>
          <div class="text-gray-800 p-2 bg-gray-50 rounded-md">{{ userInfo.email }}</div>
        </div>

        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600 mb-1">会员等级</label>
          <div class="text-gray-800 p-2 bg-gray-50 rounded-md flex items-center">
            <span class="text-blue-600 font-medium">{{ userInfo.membershipLevel }}</span>
            <span class="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
              {{ userInfo.membershipExpiry ? `有效期至 ${userInfo.membershipExpiry}` : '' }}
            </span>
          </div>
        </div>

        <!-- 积分进度条 -->
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-600 mb-1">积分</label>
          <div class="relative pt-1">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-semibold inline-block text-blue-600">
                  {{ userInfo.points }} 积分
                </span>
              </div>
              <div class="text-right">
                <span class="text-xs font-semibold inline-block text-blue-600">
                  {{ Math.round((userInfo.points / maxPoints) * 100) }}%
                </span>
              </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div
                :style="{ width: `${(userInfo.points / maxPoints) * 100}%` }"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
              ></div>
            </div>
          </div>
        </div>

        <!-- 重置密码按钮 -->
        <div class="flex justify-center mt-6">
          <button
            @click="handleResetPassword"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            重置密码
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const maxPoints = 1000
const userInfo = ref({
  username: '张三',
  phone: '138****8888',
  email: 'example@email.com',
  points: 750,
  membershipLevel: '普通会员',
  membershipExpiry: '' // 如果是付费会员，这里可以显示到期时间
})

const handleResetPassword = () => {
  // TODO: 实现密码重置逻辑
  alert('即将跳转到密码重置页面')
}

onMounted(async () => {
  try {
    // TODO: 从API获取用户信息
    // const response = await fetch('/api/user/profile')
    // userInfo.value = await response.json()
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})
</script>
