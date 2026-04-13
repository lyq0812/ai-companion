<template>
  <div class="home">
    <header class="header">
      <h1>AI数字人陪伴平台</h1>
      <p class="subtitle">温暖陪伴，让爱延续</p>
    </header>
    
    <main class="main">
      <div class="welcome-card">
        <h2>欢迎使用</h2>
        <p>这是一个温馨治愈的AI数字人陪伴平台</p>
        <div class="features">
          <div class="feature">
            <span class="icon">🏠</span>
            <span>居家场景陪伴</span>
          </div>
          <div class="feature">
            <span class="icon">💬</span>
            <span>自然对话</span>
          </div>
          <div class="feature">
            <span class="icon">💝</span>
            <span>情感记忆</span>
          </div>
        </div>
      </div>
      
      <div class="status-card">
        <h3>系统状态</h3>
        <p class="status" :class="{ online: isConnected }">
          {{ isConnected ? '🟢 后端服务已连接' : '🔴 后端服务未连接' }}
        </p>
        <button @click="checkConnection" class="btn">检测连接</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const isConnected = ref(false)

const checkConnection = async () => {
  try {
    const res = await axios.get('/api/health')
    isConnected.value = res.data.status === 'ok'
  } catch (error) {
    isConnected.value = false
  }
}

onMounted(() => {
  checkConnection()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #fff5f5 100%);
}

.header {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.main {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.welcome-card h2 {
  color: #333;
  margin-bottom: 15px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 40px;
}

.status-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.status {
  font-size: 18px;
  margin: 20px 0;
  padding: 15px;
  border-radius: 10px;
  background: #f5f5f5;
}

.status.online {
  background: #e8f5e9;
  color: #2e7d32;
}

.btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn:hover {
  opacity: 0.9;
}
</style>
