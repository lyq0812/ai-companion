<template>
  <view class="home-page">
    <view class="header">
      <view class="welcome">
        <text class="greeting">{{ greeting }}</text>
        <text class="name">{{ userStore.userInfo?.nickname || '朋友' }}</text>
      </view>
      <view class="vip-badge" v-if="userStore.isVip" @click="goToVip">
        <text class="vip-text">VIP</text>
      </view>
    </view>

    <view class="content">
      <!-- 当前数字人展示 -->
      <view class="current-companion" v-if="userStore.currentCompanion">
        <view class="companion-card" @click="goToCompanion">
          <image class="companion-avatar" :src="userStore.currentCompanion.avatar" mode="aspectFill" />
          <view class="companion-info">
            <text class="companion-name">{{ userStore.currentCompanion.name }}</text>
            <text class="companion-status">正在陪伴中</text>
          </view>
          <text class="enter-icon">→</text>
        </view>
      </view>

      <!-- 创建数字人引导 -->
      <view class="create-guide" v-else>
        <view class="guide-card">
          <text class="guide-title">创建您的专属数字人</text>
          <text class="guide-desc">上传照片，填写资料，开启温暖陪伴之旅</text>
          <button class="btn-primary create-btn" @click="goToCreate">立即创建</button>
        </view>
      </view>

      <!-- 功能入口 -->
      <view class="feature-grid">
        <view class="feature-item" @click="goToCompanions">
          <view class="feature-icon-wrapper">
            <text class="feature-icon">👥</text>
          </view>
          <text class="feature-name">我的数字人</text>
        </view>
        <view class="feature-item" @click="goToMemories">
          <view class="feature-icon-wrapper">
            <text class="feature-icon">📖</text>
          </view>
          <text class="feature-name">回忆馆</text>
        </view>
        <view class="feature-item" @click="goToVip">
          <view class="feature-icon-wrapper">
            <text class="feature-icon">👑</text>
          </view>
          <text class="feature-name">会员中心</text>
        </view>
        <view class="feature-item" @click="goToSettings">
          <view class="feature-icon-wrapper">
            <text class="feature-icon">⚙️</text>
          </view>
          <text class="feature-name">设置</text>
        </view>
      </view>

      <!-- 温馨提示 -->
      <view class="tips-section">
        <view class="tips-card">
          <text class="tips-title">💝 温馨提示</text>
          <text class="tips-content">数字人是AI技术生成的虚拟形象，旨在为您提供情感陪伴和心理慰藉。请珍惜当下，好好生活。</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onShow } from 'vue'
import { useUserStore } from '@/stores/user'
import { request } from '@/utils/request'

const userStore = useUserStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

onShow(() => {
  loadCompanions()
})

const loadCompanions = async () => {
  try {
    const res = await request({
      url: '/companions',
      method: 'GET',
      showLoading: false
    })
    userStore.setCompanions(res.list)

    // 恢复上次选择的数字人
    const lastCompanionId = uni.getStorageSync('currentCompanionId')
    if (lastCompanionId) {
      const companion = res.list.find((c: any) => c.id === lastCompanionId)
      if (companion) {
        userStore.setCurrentCompanion(companion)
      } else if (res.list.length > 0) {
        userStore.setCurrentCompanion(res.list[0])
      }
    } else if (res.list.length > 0) {
      userStore.setCurrentCompanion(res.list[0])
    }
  } catch (error) {
    console.error('Load companions failed:', error)
  }
}

const goToCreate = () => {
  uni.navigateTo({
    url: '/pages/create/index'
  })
}

const goToCompanion = () => {
  uni.switchTab({
    url: '/pages/companion/index'
  })
}

const goToCompanions = () => {
  uni.navigateTo({
    url: '/pages/profile/companions'
  })
}

const goToMemories = () => {
  uni.navigateTo({
    url: '/pages/profile/memories'
  })
}

const goToVip = () => {
  uni.navigateTo({
    url: '/pages/profile/vip'
  })
}

const goToSettings = () => {
  uni.navigateTo({
    url: '/pages/profile/settings'
  })
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #fff 100%);
  padding: 40rpx;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.welcome {
  display: flex;
  flex-direction: column;
}

.greeting {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.name {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.vip-badge {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
}

.vip-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #fff;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.companion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.companion-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.companion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.companion-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
}

.companion-status {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.enter-icon {
  font-size: 40rpx;
  color: #fff;
}

.guide-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 60rpx 40rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.guide-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.guide-desc {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
}

.create-btn {
  width: 60%;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.feature-icon-wrapper {
  width: 100rpx;
  height: 100rpx;
  background: #fff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 48rpx;
}

.feature-name {
  font-size: 24rpx;
  color: #333;
}

.tips-card {
  background: #fff8f0;
  border-radius: 24rpx;
  padding: 32rpx;
  border-left: 6rpx solid #ffb700;
}

.tips-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.tips-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
</style>