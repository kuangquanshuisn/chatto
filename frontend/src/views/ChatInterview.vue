<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- Chat Container -->
    <div class="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
      <!-- Chat Messages -->
      <div class="flex-1 overflow-y-auto mb-4 space-y-4" ref="chatContainer">
        <div v-for="(message, index) in messages" :key="index" 
          :class="['p-4 rounded-lg max-w-[80%]', 
            message.isUser ? 'bg-blue-500 text-white ml-auto' : 'bg-white shadow-sm']">
          {{ message.content }}
        </div>
        
        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex items-center space-x-2 p-4">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex space-x-4">
          <textarea
            v-model="userInput"
            @keyup.enter.exact="sendMessage"
            placeholder="Type your message..."
            class="flex-1 resize-none rounded-lg border border-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="1"
          ></textarea>
          <button
            @click="sendMessage"
            :disabled="!userInput.trim() || isLoading"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const messages = ref([
  { content: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
])
const userInput = ref('')
const isLoading = ref(false)
const chatContainer = ref(null)

// Scroll to bottom when new messages arrive
const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Send message and get AI response
const sendMessage = async () => {
  const message = userInput.value.trim()
  if (!message || isLoading.value) return

  // Add user message
  messages.value.push({ content: message, isUser: true })
  userInput.value = ''
  await scrollToBottom()

  // Show loading state
  isLoading.value = true

  try {
    // TODO: Replace with actual API call to your backend
    const response = await mockAIResponse(message)
    messages.value.push({ content: response, isUser: false })
  } catch (error) {
    console.error('Failed to get AI response:', error)
    messages.value.push({ 
      content: "Sorry, I encountered an error. Please try again.", 
      isUser: false 
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// Mock AI response - Replace this with actual API call
const mockAIResponse = async (message) => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
  return `This is a mock response to: "${message}"`
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>