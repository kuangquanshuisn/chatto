<template>
    <div :class="`flex items-start gap-4 p-4 ${isAI ? 'justify-start' : 'justify-end'}`">
      <div
        v-if="isAI"
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500 text-white"
      >
        AI
      </div>
      <MessageBubble :content="content" :isAI="isAI" :timestamp="timestamp" />
      <div
        v-if="!isAI"
        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200"
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
  }>();
  </script>