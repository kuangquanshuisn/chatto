<template>
    <div :class="`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[95%]`">
      <div class="flex items-center gap-2 mb-1 px-2">
        <span class="text-xs text-gray-500">{{ timestamp }}</span>
        <span class="text-sm font-medium">{{ isAI ? 'AI Assistant' : 'You' }}</span>
      </div>
      <div
        :class="`rounded-2xl px-3 py-2 ${
          isAI ? 'bg-white border border-gray-200' : 'bg-blue-500 text-white'
        }`"
      >
        <p class="text-base mb-2">{{ content }}</p>
        <div :class="`flex gap-1 ${isAI ? 'justify-start' : 'justify-end'}`" style="display: none;">
          <button :class="`p-1 rounded hover:bg-${isAI ? 'gray-100' : 'blue-600'}`">
            <HandThumbUpIcon :class="`w-4 h-4 ${isAI ? 'text-gray-500' : 'text-white'}`" />
          </button>
          <button :class="`p-1 rounded hover:bg-${isAI ? 'gray-100' : 'blue-600'}`">
            <HandThumbDownIcon :class="`w-4 h-4 ${isAI ? 'text-gray-500' : 'text-white'}`" />
          </button>
          <button :class="`p-1 rounded hover:bg-${isAI ? 'gray-100' : 'blue-600'}`">
            <ClipboardDocumentIcon :class="`w-4 h-4 ${isAI ? 'text-gray-500' : 'text-white'}`" />
          </button>
          <button :class="`p-1 rounded hover:bg-${isAI ? 'gray-100' : 'blue-600'}`">
            <ChatBubbleLeftIcon :class="`w-4 h-4 ${isAI ? 'text-gray-500' : 'text-white'}`" />
          </button>
          <button :class="`p-1 rounded hover:bg-${isAI ? 'gray-100' : 'blue-600'}`">
            <TrashIcon :class="`w-4 h-4 ${isAI ? 'text-gray-500' : 'text-white'}`" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { 
    HandThumbUpIcon, 
    HandThumbDownIcon, 
    ClipboardDocumentIcon, 
    ChatBubbleLeftIcon,
    TrashIcon 
  } from '@heroicons/vue/24/outline';
  
  defineProps<{
    content: string;
    isAI: boolean;
    timestamp: string;
  }>();
  </script>