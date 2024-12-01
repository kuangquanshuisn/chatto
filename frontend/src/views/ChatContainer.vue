<template>
  <div class="flex flex-col h-screen">
    <!-- Header -->
    <header class="border-b border-gray-200">
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
              class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
              :class="{ 'bg-gray-50': model === selectedModel }"
            >
              <span>{{ model }}</span>
              <CheckIcon v-if="model === selectedModel" class="h-4 w-4 text-blue-500" />
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <PencilSquareIcon class="h-5 w-5 text-gray-500" />
          </button>
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
            U
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto bg-gray-50">
      <Message
        v-for="message in messages"
        :key="message.id"
        :content="message.content"
        :isAI="message.isAI"
        :timestamp="message.timestamp"
      />
      <div ref="messagesEndRef" />
    </div>
    <ChatInput :onSendMessage="handleSendMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import Message from '../components/Message.vue';
import ChatInput from '../components/ChatInput.vue';
import { ChevronDownIcon, PencilSquareIcon, CheckIcon } from '@heroicons/vue/24/outline';

interface ChatMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: string;
}

const models = ['gpt-4o', 'gemini', 'qwen2.5'];
const selectedModel = ref('gpt-4o');
const isModelSelectOpen = ref(false);

const selectModel = (model: string) => {
  selectedModel.value = model;
  isModelSelectOpen.value = false;
};

// Close model selection when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (isModelSelectOpen.value) {
    const target = event.target as HTMLElement;
    const button = document.querySelector('.model-select-button');
    const popup = document.querySelector('.model-select-popup');
    
    if (!button?.contains(target) && !popup?.contains(target)) {
      isModelSelectOpen.value = false;
    }
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

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