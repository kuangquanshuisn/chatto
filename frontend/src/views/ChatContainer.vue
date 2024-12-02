<template>
  <div class="flex flex-col h-[100dvh]">
    <!-- Header -->
    <header class="flex-none border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-2">
        <div class="flex items-center space-x-2 relative">
          <button 
            @click.stop="isModelSelectOpen = !isModelSelectOpen"
            class="flex items-center space-x-2 hover:bg-gray-100 px-2 py-1 rounded-lg model-select-button"
          >
            <span class="font-medium">{{ selectedModel }}</span>
            <ChevronDownIcon class="h-4 w-4 text-gray-500" />
          </button>

          <!-- Model Selection Popup -->
          <div 
            v-if="isModelSelectOpen"
            class="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 model-select-popup"
            @click.stop
          >
            <button
              v-for="model in models"
              :key="model"
              @click="selectModel(model)"
              class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
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
          <div  @click="isAvatarMenuOpen = !isAvatarMenuOpen" 
                class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
            U
          </div>

          <!-- Avatar Menu Popup -->
          <div 
            v-if="isAvatarMenuOpen"
            class="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            @click.stop
          >
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
              <StarIcon class="h-5 w-5 text-gray-500 mr-2" />
              积分
            </button>
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
              <UserIcon class="h-5 w-5 text-gray-500 mr-2" />
              我的
            </button>
            <button class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
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
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import Message from '../components/Message.vue';
import ChatInput from '../components/ChatInput.vue';
import { ChevronDownIcon, PencilSquareIcon, CheckIcon, StarIcon, UserIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline';

interface ChatMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
}

const models = ['gpt-4o', 'gemini', 'qwen2.5'];
const selectedModel = ref('gpt-4o');
const isModelSelectOpen = ref(false);
const isAvatarMenuOpen = ref(false); // 新增状态

const selectModel = (model: string) => {
  selectedModel.value = model;
  isModelSelectOpen.value = false;
};

// Code for mouse click outside to close dropdowns
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  
  if (isModelSelectOpen.value) {
    const button = document.querySelector('.model-select-button');
    const popup = document.querySelector('.model-select-popup');

    if (!button?.contains(target) && !popup?.contains(target)) {
      isModelSelectOpen.value = false;
    }
  }
  
  if (isAvatarMenuOpen.value) {
    const avatarButton = document.querySelector('.avatar-menu-button');
    const menuPopup = document.querySelector('.avatar-menu-popup');

    if (!avatarButton?.contains(target) && !menuPopup?.contains(target)) {
      isAvatarMenuOpen.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

// Remaining code unchanged
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

const handleSendMessage = (content: string) => {
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    content,
    isAI: false,
    timestamp: new Date().toLocaleTimeString(),
  };

  messages.value.push(newMessage);
  scrollToBottom();

  // Simulate AI response
  setTimeout(() => {
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: 'This is a simulated AI response.',
      isAI: true,
      timestamp: new Date().toLocaleTimeString(),
    };
    messages.value.push(aiResponse);
    scrollToBottom();
  }, 1000);
};
</script>