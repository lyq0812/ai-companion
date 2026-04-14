<template>
  <div class="launch-page">
    <div class="launch-content">
      <div class="logo-section">
        <div class="logo-icon">
          <span class="icon-text">AI</span>
        </div>
        <span class="app-name">数字人陪伴</span>
        <span class="app-slogan">温暖陪伴，让爱延续</span>
      </div>
      
      <div class="feature-list">
        <div class="feature-item">
          <span class="feature-icon">🏠</span>
          <span class="feature-text">居家场景自由陪伴</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💬</span>
          <span class="feature-text">自然对话温暖治愈</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">💝</span>
          <span class="feature-text">情感记忆永久珍藏</span>
        </div>
      </div>
      
      <div class="action-section">
        <button class="btn-primary start-btn" @click="goToHome">开启陪伴之旅</button>
        <span class="hint-text">已有账号？<span class="link" @click="goToLogin">立即登录</span></span>
      </div>
    </div>
    
    <div class="agreement-section">
      <span class="agreement-text">
        登录即代表您同意
        <span class="link" @click="goToUserAgreement">《用户协议》</span>
        和
        <span class="link" @click="goToPrivacy">《隐私政策》</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  // 检查是否已登录
  if (userStore.isLoggedIn) {
    setTimeout(() => {
      router.push('/home')
    }, 1500)
  }
})

const goToHome = () => {
  if (userStore.isLoggedIn) {
    router.push('/home')
  } else {
    router.push('/login')
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToUserAgreement = () => {
  // 暂时跳转到首页
  router.push('/')
}

const goToPrivacy = () => {
  // 暂时跳转到首页
  router.push('/')
}
</script>

<style scoped>
.launch-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #fff5f5 100%);
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  box-sizing: border-box;
}

.launch-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.logo-icon {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.icon-text {
  font-size: 36px;
  font-weight: bold;
  color: #fff;
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.app-slogan {
  font-size: 14px;
  color: #666;
}

.feature-list {
  width: 100%;
  margin-bottom: 50px;
}

.feature-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 16px 20px;
  border-radius: 10px;
  margin-bottom: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 20px;
  margin-right: 12px;
}

.feature-text {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.action-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.start-btn {
  width: 80%;
  margin-bottom: 16px;
}

.hint-text {
  font-size: 13px;
  color: #666;
}

.agreement-section {
  padding: 20px 0;
  text-align: center;
}

.agreement-text {
  font-size: 12px;
  color: #999;
  line-height: 1.6;
}

.link {
  color: #667eea;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>