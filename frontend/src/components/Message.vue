<template>
    <div :class="`flex items-start gap-3 py-2 px-4 ${isAI ? 'justify-start' : 'justify-end'}`">
      <div
        v-if="isAI"
        class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500 text-white text-sm"
      >
        AI
      </div>
      <MessageBubble 
        :content="content" 
        :isAI="isAI" 
        :timestamp="timestamp" 
        :model="model"
      />
      <div
        v-if="!isAI"
        class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-sm"
      >
        U
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import MessageBubble from './MessageBubble.vue';
  
  defineProps<{
    content: string;
    isAI: boolean;
    timestamp: string;
    model?: string;
  }>();
  </script>