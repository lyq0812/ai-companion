<template>
  <div class="home-page">
    <div class="header">
      <div class="welcome">
        <span class="greeting">{{ greeting }}</span>
        <span class="name">{{ userStore.userInfo?.nickname || '朋友' }}</span>
      </div>
      <div class="vip-badge" v-if="userStore.isVip" @click="goToVip">
        <span class="vip-text">VIP</span>
      </div>
    </div>

    <div class="content">
      <!-- 当前数字人展示 -->
      <div class="current-companion" v-if="userStore.currentCompanion">
        <div class="companion-card" @click="goToCompanion">
          <img class="companion-avatar" :src="userStore.currentCompanion.avatar" />
          <div class="companion-info">
            <span class="companion-name">{{ userStore.currentCompanion.name }}</span>
            <span class="companion-status">正在陪伴中</span>
          </div>
          <span class="enter-icon">→</span>
        </div>
      </div>

      <!-- 创建数字人引导 -->
      <div class="create-guide" v-else>
        <div class="guide-card">
          <span class="guide-title">创建您的专属数字人</span>
          <span class="guide-desc">上传照片，填写资料，开启温暖陪伴之旅</span>
          <button class="btn-primary create-btn" @click="goToCreate">立即创建</button>
        </div>
      </div>

      <!-- 功能入口 -->
      <div class="feature-grid">
        <div class="feature-item" @click="goToCompanions">
          <div class="feature-icon-wrapper">
            <span class="feature-icon">👥</span>
          </div>
          <span class="feature-name">我的数字人</span>
        </div>
        <div class="feature-item" @click="goToMemories">
          <div class="feature-icon-wrapper">
            <span class="feature-icon">📖</span>
          </div>
          <span class="feature-name">回忆馆</span>
        </div>
        <div class="feature-item" @click="goToVip">
          <div class="feature-icon-wrapper">
            <span class="feature-icon">👑</span>
          </div>
          <span class="feature-name">会员中心</span>
        </div>
        <div class="feature-item" @click="goToSettings">
          <div class="feature-icon-wrapper">
            <span class="feature-icon">⚙️</span>
          </div>
          <span class="feature-name">设置</span>
        </div>
      </div>

      <!-- 温馨提示 -->
      <div class="tips-section">
        <div class="tips-card">
          <span class="tips-title">💝 温馨提示</span>
          <span class="tips-content">数字人是AI技术生成的虚拟形象，旨在为您提供情感陪伴和心理慰藉。请珍惜当下，好好生活。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

interface Companion {
  id: string
  name: string
  avatar: string
  sceneImage: string
  gender: 'male' | 'female'
  birthYear: number
  deathYear: number
  personality: string
  catchphrase: string
  speakingStyle: string
  habits: string
  memories: string
  hobbies: string
  values: string
  voiceUrl: string | null
  isActive: boolean
  createdAt: string
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

onMounted(() => {
  loadCompanions()
})

const loadCompanions = async () => {
  try {
    // 模拟数据
    const mockData: { list: Companion[] } = {
      list: [
        {
          id: '1',
          name: '爷爷',
          avatar: 'https://via.placeholder.com/100',
          sceneImage: 'https://via.placeholder.com/800x600',
          gender: 'male',
          birthYear: 1940,
          deathYear: 2020,
          personality: '慈祥、乐观、喜欢讲故事',
          catchphrase: '慢慢来，不急',
          speakingStyle: '温和、慢条斯理',
          habits: '每天早起到公园锻炼',
          memories: '喜欢钓鱼、下棋',
          hobbies: '书法、园艺',
          values: '诚实守信、尊老爱幼',
          voiceUrl: null,
          isActive: true,
          createdAt: '2024-01-01'
        }
      ]
    }
    
    userStore.setCompanions(mockData.list)

    // 恢复上次选择的数字人
    const lastCompanionId = localStorage.getItem('currentCompanionId')
    if (lastCompanionId) {
      const companion = mockData.list.find((c) => c.id === lastCompanionId)
      if (companion) {
        userStore.setCurrentCompanion(companion)
      } else if (mockData.list.length > 0) {
        userStore.setCurrentCompanion(mockData.list[0])
      }
    } else if (mockData.list.length > 0) {
      userStore.setCurrentCompanion(mockData.list[0])
    }
  } catch (error) {
    console.error('Load companions failed:', error)
  }
}

const goToCreate = () => {
  router.push('/create')
}

const goToCompanion = () => {
  router.push('/companion')
}

const goToCompanions = () => {
  router.push('/profile')
}

const goToMemories = () => {
  router.push('/profile')
}

const goToVip = () => {
  router.push('/profile/vip')
}

const goToSettings = () => {
  router.push('/profile')
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #fff 100%);
  padding: 20px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.welcome {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.vip-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  padding: 6px 12px;
  border-radius: 15px;
  cursor: pointer;
}

.vip-text {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.companion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.companion-card:hover {
  transform: translateY(-2px);
}

.companion-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.companion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.companion-name {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.companion-status {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.enter-icon {
  font-size: 20px;
  color: #fff;
}

.guide-card {
  background: #fff;
  border-radius: 16px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.guide-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.guide-desc {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.create-btn {
  width: 60%;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-icon-wrapper {
  width: 50px;
  height: 50px;
  background: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 24px;
}

.feature-name {
  font-size: 12px;
  color: #333;
}

.tips-card {
  background: #fff8f0;
  border-radius: 12px;
  padding: 16px;
  border-left: 3px solid #ffb700;
}

.tips-title {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.tips-content {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
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