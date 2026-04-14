import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/index',
      name: 'Index',
      component: () => import('../pages/index/index.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/login/index.vue')
    },
    {
      path: '/home',
      name: 'HomePage',
      component: () => import('../pages/home/index.vue')
    },
    {
      path: '/companion',
      name: 'Companion',
      component: () => import('../pages/companion/index.vue')
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('../pages/chat/index.vue')
    },
    {
      path: '/create',
      name: 'Create',
      component: () => import('../pages/create/index.vue')
    },
    {
      path: '/create/step1',
      name: 'CreateStep1',
      component: () => import('../pages/create/step1.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../pages/profile/index.vue')
    },
    {
      path: '/profile/vip',
      name: 'Vip',
      component: () => import('../pages/profile/vip.vue')
    }
  ]
})

export default router
