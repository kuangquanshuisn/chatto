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
        :model="message.model"
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
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 配置 dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

interface ChatMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
  model?: string;
}

const router = useRouter();
const models = ref<string[]>([]);
const selectedModel = ref('');
const isModelSelectOpen = ref(false);
const isAvatarMenuOpen = ref(false);

const fetchModels = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/chat/models', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 401) {
      router.push('/login');
      return;
    }

    const data = await response.json();
    models.value = data.models;
    if (models.value.length > 0 && !selectedModel.value) {
      selectedModel.value = models.value[0];
    }
  } catch (error) {
    console.error('Error fetching models:', error);
  }
};

const selectModel = (model: string) => {
  selectedModel.value = model;
  isModelSelectOpen.value = false;
};

const handleLogout = () => {
  // 清除本地存储中的token和用户信息
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // 跳转到登录页面
  router.push('/login');
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

const loadChatHistory = async () => {
  try {
    const token = localStorage.getItem('token'); // 获取token
    const response = await fetch('http://localhost:3000/api/chat/chat-lists', {
      headers: {
        'Authorization': `Bearer ${token}` // 添加Authorization请求头
      }
    });
    const history = await response.json();
    messages.value = history;
  } catch (error) {
    console.error('Error loading chat history:', error);
  }
};

const formatDateTime = () => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Shanghai'
  }).format(new Date()).replace(/\//g, '-');
};

const saveMessage = async (content: string, isAI: boolean, model?: string) => {
  const message: ChatMessage = {
    id: Date.now().toString(),
    content,
    isAI,
    timestamp: formatDateTime(),
    model
  };
  messages.value.push(message);
  return message;
};

const handleSendMessage = async (content: string) => {
  if (!content.trim()) return;

  // Save user message
  await saveMessage(content, false);

  try {
    // Create temporary message for streaming response
    const tempMessageId = Date.now().toString();
    messages.value.push({
      id: tempMessageId,
      content: '',
      isAI: true,
      timestamp: formatDateTime(),
      model: selectedModel.value
    });

    // Create EventSource for streaming
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // 添加token验证
      },
      body: JSON.stringify({
        message: content,
        model: selectedModel.value
      }),
    });

    // Create a reader to read the stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to create stream reader');
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            
            // Update the temporary message with new content
            const messageIndex = messages.value.findIndex(m => m.id === tempMessageId);
            if (messageIndex !== -1) {
              if (data.done) {
                // Replace temporary message with final message
                messages.value[messageIndex] = {
                  id: data.id,
                  content: data.content,
                  isAI: true,
                  timestamp: data.timestamp,
                  model: selectedModel.value
                };
              } else {
                // Append new content to existing message
                messages.value[messageIndex].content += data.content;
              }
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
    messages.value.push({
      id: Date.now().toString(),
      content: 'Sorry, there was an error processing your message. Please try again.',
      isAI: true,
      timestamp: new Date().toISOString()
    });
  }
};

// 在组件挂载时加载聊天历史记录
onMounted(async () => {
  await fetchModels();
  loadChatHistory();
});
</script>