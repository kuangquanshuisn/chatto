<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-2">
        <div class="flex items-center space-x-2">
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <Bars3Icon class="h-5 w-5 text-gray-500" />
          </button>
          <div class="flex items-center space-x-2">
            <span class="font-medium">groq/llama-3.1-70b-versatile</span>
            <ChevronDownIcon class="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <QueueListIcon class="h-5 w-5 text-gray-500" />
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-lg">
            <PencilSquareIcon class="h-5 w-5 text-gray-500" />
          </button>
          <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white">
            C
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-3xl mx-auto px-4 py-8">
      <!-- Title -->
      <div class="flex items-center justify-center space-x-2 mb-8">
        <div class="h-6 w-6 text-gray-700">🤖</div>
        <h1 class="text-xl font-medium">groq/llama-3.1-70b-versatile</h1>
      </div>

      <!-- Input Area -->
      <div class="relative mb-8">
        <div class="flex items-center bg-gray-50 rounded-full">
          <div class="relative group">
            <button class="p-2 m-1 hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center">
              <PlusIcon class="h-5 w-5 text-gray-500" />
            </button>
            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              更多
            </div>
          </div>
          <input
            type="text"
            placeholder="请什么么我能帮您的吗?"
            class="flex-1 px-4 py-3  bg-gray-50 focus:outline-none"
          />
          <div class="flex items-center px-3 space-x-3">
            <div class="relative group">
              <button class="p-2 m-1 hover:bg-gray-200 rounded-full h-9 w-9 flex items-center justify-center">
                <MicrophoneIcon class="h-5 w-5 text-gray-500" />
              </button>
              <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                录音
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Suggestions -->
      <div class="space-y-3">
        <h2 class="text-sm text-gray-400 font-medium ml-4 flex items-center">
          <BoltIcon class="h-3 w-3 mr-1 text-gray-400" />
          建议
        </h2>
        <div class="space-y-1">
          <button
            v-for="(suggestion, index) in suggestions"
            :key="index"
            class="w-full text-left p-1 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors"
          >
            <h3 class="font-medium mb-1">{{ suggestion.title }}</h3>
            <p class="text-sm text-gray-500">{{ suggestion.subtitle }}</p>
          </button>
        </div>
      </div>
    </main>

    <!-- Help Button -->
    <div class="fixed bottom-4 right-4">
      <button class="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow">
        <QuestionMarkCircleIcon class="h-5 w-5 text-gray-500" />
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  Bars3Icon,
  BoltIcon,
  ChevronDownIcon,
  MicrophoneIcon,
  PencilSquareIcon,
  PlusIcon,
  QueueListIcon,
  QuestionMarkCircleIcon,
  SpeakerWaveIcon,
} from '@heroicons/vue/24/outline'

const suggestions = [
  {
    title: 'Show me a code snippet',
    subtitle: 'of a website\'s sticky header'
  },
  {
    title: 'Tell me a fun fact',
    subtitle: 'about the Roman Empire'
  },
  {
    title: 'Explain options trading',
    subtitle: 'if I\'m familiar with buying and selling stocks'
  }
]
</script>