<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
    <!-- Logo -->
    <div class="mb-16">
      <h1 class="text-4xl font-bold tracking-tighter">OI</h1>
    </div>
    
    <!-- Login Card -->
    <div class="w-full max-w-sm">
      <h2 class="text-xl font-semibold text-center mb-6">Welcome Back</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div class="space-y-2">
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full h-12 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button 
          type="submit"
          class="w-full h-12 rounded-lg bg-black text-white hover:bg-gray-800 transition duration-300 ease-in-out"
        >
          Sign In
        </button>
      </form>
      
      <div class="mt-6 text-center text-sm">
        <a href="#" class="text-gray-600 hover:text-gray-800">
          Forgot your password?
        </a>
      </div>
      
      <div class="mt-4 text-center text-sm">
        <span class="text-gray-600">Don't have an account? </span>
        <router-link to="/register" class="text-black hover:text-gray-800 font-medium">
          Sign up
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  // Here you would typically handle the login logic
  console.log('Login attempt with:', { email: email.value, password: password.value })
}
</script>