import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import LoginPage from '../views/LoginPage.vue';
import ChatPage from '../views/ChatPage.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
