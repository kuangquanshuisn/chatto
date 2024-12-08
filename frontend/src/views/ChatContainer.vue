<template>
  <div class="flex flex-col h-[100dvh]">
    <!-- 头部 -->
    <header class="flex-none border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-2">
        <div class="flex items-center space-x-2 relative">
          <button 
            @click="isModelSelectOpen = !isModelSelectOpen"
            class="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-lg"
          >
            <span class="font-medium">{{ selectedModel }}</span>
            <ChevronDownIcon class="h-4 w-4 text-gray-500" />
          </button>

          <!-- 模型选择弹窗 -->
          <div 
            v-if="isModelSelectOpen"
            v-on-click-outside="() => isModelSelectOpen = false"
            class="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <button
              v-for="model in models"
              :key="model"
              @click="selectModel(model)"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
              :class="{ 'bg-gray-50': model === selectedModel }"
            >
              <span>{{ model }}</span>
              <CheckIcon v-if="model === selectedModel" class="h-4 w-4 text-blue-500" />
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-2 relative">
          <button 
            class="p-2 hover:bg-gray-100 rounded-lg"
          >
            <PencilSquareIcon class="h-5 w-5 text-gray-500" />
          </button>
          <div  
            @click="isAvatarMenuOpen = !isAvatarMenuOpen" 
            class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white cursor-pointer"
          >
            U
          </div>

          <!-- 头像菜单弹窗 -->
          <div 
            v-if="isAvatarMenuOpen"
            v-on-click-outside="() => isAvatarMenuOpen = false"
            class="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
          >
            <button class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center">
              <StarIcon class="h-5 w-5 text-gray-500 mr-2" />
              积分
            </button>
            <button 
              @click="handleProfile"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
            >
              <UserIcon class="h-5 w-5 text-gray-500 mr-2" />
              我的
            </button>
            <button 
              type="button" 
              @click="handleLogout" 
              class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
            >
              <ArrowLeftIcon class="h-5 w-5 text-gray-500 mr-2" />
              退出
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto bg-gray-50 min-h-0">
      <Message
        v-for="message in messages"
        :key="message.id"
        :content="message.content"
        :isAI="message.isAI"
        :timestamp="message.timestamp"
      />
      <div ref="messagesEndRef" />
    </div>

    <div class="flex-none">
      <ChatInput :onSendMessage="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { vOnClickOutside } from '@vueuse/components'
import Message from '../components/Message.vue';
import ChatInput from '../components/ChatInput.vue';
import { ChevronDownIcon, PencilSquareIcon, CheckIcon, StarIcon, UserIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

interface ChatMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
}

const router = useRouter();
const models = ['gpt-4o', 'gemini', 'qwen2.5'];
const selectedModel = ref('gpt-4o');
const isModelSelectOpen = ref(false);
const isAvatarMenuOpen = ref(false);

const selectModel = (model: string) => {
  selectedModel.value = model;
  isModelSelectOpen.value = false;
};

const handleLogout = () => {
  // 可以在这里添加清除用户数据的逻辑
  router.push('/login');
  isAvatarMenuOpen.value = false;
};

const handleProfile = () => {
  router.push('/profile');
  isAvatarMenuOpen.value = false;
}

const messages = ref<ChatMessage[]>([]);
const messagesEndRef = ref<HTMLDivElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    const container = messagesEndRef.value?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
};

watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// 加载聊天历史记录
const loadChatHistory = async () => {
  try {
    // TODO: 替换为实际的用户ID
    const userId = '1'; // 这里应该从用户状态或登录信息中获取
    const response = await fetch(`http://localhost:3000/api/messages/${userId}`);
    const data = await response.json();
    messages.value = data.map((msg: any) => ({
      id: msg.id.toString(),
      content: msg.content,
      isAI: msg.is_ai,
      timestamp: new Date(msg.created_at).toLocaleTimeString()
    }));
    scrollToBottom();
  } catch (error) {
    console.error('加载聊天历史记录失败:', error);
  }
};

// 保存消息到服务器
const saveMessage = async (message: ChatMessage, isAI: boolean) => {
  try {
    // TODO: 替换为实际的用户ID
    const userId = '1'; // 这里应该从用户状态或登录信息中获取
    await fetch('http://localhost:3000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: userId,
        content: message.content,
        is_ai: isAI
      })
    });
  } catch (error) {
    console.error('保存消息失败:', error);
  }
};

const handleSendMessage = async (content: string) => {
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    content,
    isAI: false,
    timestamp: new Date().toLocaleTimeString(),
  };

  messages.value.push(newMessage);
  await saveMessage(newMessage, false);
  scrollToBottom();

  // 模拟AI响应
  setTimeout(async () => {
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: 'This is a simulated AI response.',
      isAI: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    messages.value.push(aiResponse);
    await saveMessage(aiResponse, true);
    scrollToBottom();
  }, 1000);
};

// 在组件挂载时加载聊天历史记录
onMounted(() => {
  loadChatHistory();
});
</script>