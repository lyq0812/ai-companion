<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="user-avatar" :src="userStore.userInfo?.avatar || '/static/default-avatar.png'" mode="aspectFill" />
        <view class="user-detail">
          <text class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</text>
          <text class="user-phone">{{ maskedPhone }}</text>
        </view>
      </view>
      <view class="vip-tag" v-if="userStore.isVip" @click="goToVip">
        <text class="vip-text">{{ vipTypeText }}</text>
      </view>
      <view class="vip-tag free" v-else @click="goToVip">
        <text class="vip-text">开通会员</text>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="goToCompanions">
        <view class="menu-icon-wrapper">
          <text class="menu-icon">👥</text>
        </view>
        <text class="menu-text">我的数字人</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goToMemories">
        <view class="menu-icon-wrapper">
          <text class="menu-icon">📖</text>
        </view>
        <text class="menu-text">回忆馆</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goToVip">
        <view class="menu-icon-wrapper vip-wrapper">
          <text class="menu-icon">👑</text>
        </view>
        <text class="menu-text">会员中心</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 设置列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="goToSettings">
        <view class="menu-icon-wrapper">
          <text class="menu-icon">⚙️</text>
        </view>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goToUserAgreement">
        <view class="menu-icon-wrapper">
          <text class="menu-icon">📄</text>
        </view>
        <text class="menu-text">用户协议</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="goToPrivacy">
        <view class="menu-icon-wrapper">
          <text class="menu-icon">🔒</text>
        </view>
        <text class="menu-text">隐私政策</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 退出登录 -->
    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const maskedPhone = computed(() => {
  const phone = userStore.userInfo?.phone
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
})

const vipTypeText = computed(() => {
  const type = userStore.userInfo?.vipType
  switch (type) {
    case 'month': return '月卡会员'
    case 'year': return '年卡会员'
    case 'family': return '家庭会员'
    default: return '会员'
  }
})

const goToCompanions = () => {
  uni.navigateTo({ url: '/pages/profile/companions' })
}

const goToMemories = () => {
  uni.navigateTo({ url: '/pages/profile/memories' })
}

const goToVip = () => {
  uni.navigateTo({ url: '/pages/profile/vip' })
}

const goToSettings = () => {
  uni.navigateTo({ url: '/pages/profile/settings' })
}

const goToUserAgreement = () => {
  uni.navigateTo({ url: '/pages/agreement/user' })
}

const goToPrivacy = () => {
  uni.navigateTo({ url: '/pages/agreement/privacy' })
}

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/index/index' })
        }, 1500)
      }
    }
  })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40rpx;
  box-sizing: border-box;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 32rpx;
  padding: 48rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.user-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 8rpx;
}

.user-phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.vip-tag {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  padding: 12rpx 28rpx;
  border-radius: 30rpx;
}

.vip-tag.free {
  background: rgba(255, 255, 255, 0.2);
}

.vip-text {
  font-size: 24rpx;
  font-weight: bold;
  color: #fff;
}

.menu-list {
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 40rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon-wrapper {
  width: 64rpx;
  height: 64rpx;
  background: #f5f7fa;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.menu-icon-wrapper.vip-wrapper {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
}

.menu-icon {
  font-size: 36rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 36rpx;
  color: #999;
}

.logout-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #fff;
  color: #ff4d4f;
  font-size: 32rpx;
  border-radius: 48rpx;
  border: none;
  margin-top: 40rpx;
}
</style>
