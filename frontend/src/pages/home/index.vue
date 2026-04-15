<template>
  <div class="min-h-screen bg-shiwei-paper flex flex-col items-center justify-center p-4">
    <!-- 背景装饰 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-full h-64 bg-shiwei-mountain opacity-10"></div>
      <div class="absolute bottom-0 right-0 w-full h-64 bg-shiwei-mountain opacity-10 transform rotate-180"></div>
    </div>
    
    <!-- 主内容 -->
    <div class="relative z-10 max-w-3xl w-full text-center">
      <!-- 品牌标识 -->
      <div class="mb-8">
        <h1 class="text-4xl md:text-5xl font-bold text-shiwei-ink mb-3 font-serif">
          AI数字人陪伴平台
        </h1>
        <p class="text-xl md:text-2xl text-shiwei-ink-light mb-6 font-serif">
          温暖陪伴，让爱延续
        </p>
        <p class="text-gray-600 mb-8 font-serif">
          欢迎使用<br>
          这是一个温馨治愈的AI数字人陪伴平台
        </p>
      </div>
      
      <!-- 功能模块 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div class="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-shiwei-border transition-all hover:shadow-md">
          <div class="text-2xl mb-3">🏠</div>
          <h3 class="text-lg font-semibold text-shiwei-ink mb-2 font-serif">居家场景陪伴</h3>
        </div>
        
        <div class="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-shiwei-border transition-all hover:shadow-md">
          <div class="text-2xl mb-3">�</div>
          <h3 class="text-lg font-semibold text-shiwei-ink mb-2 font-serif">自然对话</h3>
        </div>
        
        <div class="bg-white bg-opacity-80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-shiwei-border transition-all hover:shadow-md">
          <div class="text-2xl mb-3">💝</div>
          <h3 class="text-lg font-semibold text-shiwei-ink mb-2 font-serif">情感记忆</h3>
        </div>
      </div>
      
      <!-- 系统状态 -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-shiwei-ink mb-3 font-serif">系统状态</h3>
        <div class="flex items-center justify-center space-x-2 text-red-600">
          <span class="inline-block w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          <span>后端服务未连接</span>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="checkConnection"
          class="px-8 py-3 bg-white border border-shiwei-ink text-shiwei-ink rounded-lg font-serif transition-all hover:bg-shiwei-ink hover:text-white"
        >
          检测连接
        </button>
        <button 
          @click="navigateToLogin"
          class="px-8 py-3 bg-shiwei-red text-white rounded-lg font-serif transition-all hover:bg-shiwei-red-dark"
        >
          进入平台登录
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateToLogin = () => {
  router.push('/login')
}

const checkConnection = () => {
  // 模拟检测连接
  alert('正在检测连接...')
  setTimeout(() => {
    alert('连接检测完成：后端服务未连接')
  }, 1000)
}
</script>

<style scoped>
/* 式微AI品牌样式 */
.bg-shiwei-paper {
  background-color: #f7f3e9;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23d4c8b0' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.bg-shiwei-mountain {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='60' viewBox='0 0 100 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0v60h100V0H0zm0 58h100v2H0v-2z' fill='%23000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3Cpath d='M30 10v40h40V10H30zm0 5h35v30H30V15z' fill='%23000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.text-shiwei-ink {
  color: #1a1a1a;
}

.text-shiwei-ink-light {
  color: #4a4a4a;
}

.border-shiwei-border {
  border-color: #d4c8b0;
}

.bg-shiwei-red {
  background-color: #c53030;
}

.bg-shiwei-red-dark {
  background-color: #9b2c2c;
}

.font-serif {
  font-family: 'Noto Serif SC', serif;
}

/* 响应式设计 */
@media (max-width: 640px) {
  h1 {
    font-size: 2.5rem !important;
  }
  
  p {
    font-size: 1rem !important;
  }
  
  .grid-cols-3 {
    grid-template-columns: 1fr !important;
  }
  
  .flex-col {
    flex-direction: column !important;
  }
  
  button {
    width: 100% !important;
  }
}
</style>