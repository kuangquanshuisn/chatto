<template>
    <form @submit.prevent="handleSubmit" class="border-t border-gray-200 bg-white p-4">
      <div class="flex items-center gap-2">
        <button type="button" class="p-2 hover:bg-gray-100 rounded-full">
          <PhotoIcon class="w-5 h-5 text-gray-500" />
        </button>
        <button type="button" class="p-2 hover:bg-gray-100 rounded-full">
          <MicrophoneIcon class="w-5 h-5 text-gray-500" />
        </button>
        <input
          v-model="message"
          type="text"
          placeholder="Type a message..."
          class="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { 
    FaceSmileIcon, 
    PhotoIcon, 
    MicrophoneIcon, 
    PaperAirplaneIcon 
  } from '@heroicons/vue/24/outline';
  
  const props = defineProps<{
    onSendMessage: (message: string) => void;
  }>();
  
  const message = ref('');
  
  const handleSubmit = () => {
    if (message.value.trim()) {
      props.onSendMessage(message.value);
      message.value = '';
    }
  };
  </script>