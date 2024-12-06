import { createRouter, createWebHistory } from 'vue-router';
import Register from '../views/Register.vue';
import LoginPage from '../views/LoginPage.vue';
import ChatContainer from '../views/ChatContainer.vue';
import Profile from '../views/Profile.vue';
import ForgotPassword from '../views/ForgotPassword.vue';

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
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatContainer
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
