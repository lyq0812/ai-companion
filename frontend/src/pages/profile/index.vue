<template>
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-info">
        <img class="user-avatar" :src="userStore.userInfo?.avatar || 'https://via.placeholder.com/100'" />
        <div class="user-detail">
          <span class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</span>
          <span class="user-phone">{{ maskedPhone }}</span>
        </div>
      </div>
      <div class="vip-tag" v-if="userStore.isVip" @click="goToVip">
        <span class="vip-text">{{ vipTypeText }}</span>
      </div>
      <div class="vip-tag free" v-else @click="goToVip">
        <span class="vip-text">开通会员</span>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="menu-list">
      <div class="menu-item" @click="goToCompanions">
        <div class="menu-icon-wrapper">
          <span class="menu-icon">👥</span>
        </div>
        <span class="menu-text">我的数字人</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="goToMemories">
        <div class="menu-icon-wrapper">
          <span class="menu-icon">📖</span>
        </div>
        <span class="menu-text">回忆馆</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="goToVip">
        <div class="menu-icon-wrapper vip-wrapper">
          <span class="menu-icon">👑</span>
        </div>
        <span class="menu-text">会员中心</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <!-- 设置列表 -->
    <div class="menu-list">
      <div class="menu-item" @click="goToSettings">
        <div class="menu-icon-wrapper">
          <span class="menu-icon">⚙️</span>
        </div>
        <span class="menu-text">设置</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="goToUserAgreement">
        <div class="menu-icon-wrapper">
          <span class="menu-icon">📄</span>
        </div>
        <span class="menu-text">用户协议</span>
        <span class="menu-arrow">›</span>
      </div>
      <div class="menu-item" @click="goToPrivacy">
        <div class="menu-icon-wrapper">
          <span class="menu-icon">🔒</span>
        </div>
        <span class="menu-text">隐私政策</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <!-- 退出登录 -->
    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
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
  router.push('/profile/companions')
}

const goToMemories = () => {
  router.push('/profile/memories')
}

const goToVip = () => {
  router.push('/profile/vip')
}

const goToSettings = () => {
  router.push('/profile/settings')
}

const goToUserAgreement = () => {
  router.push('/agreement/user')
}

const goToPrivacy = () => {
  router.push('/agreement/privacy')
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    alert('已退出登录')
    setTimeout(() => {
      router.push('/index')
    }, 1500)
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
}

.user-detail {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

.user-phone {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.vip-tag {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  padding: 6px 14px;
  border-radius: 15px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.vip-tag:hover {
  opacity: 0.9;
}

.vip-tag.free {
  background: rgba(255, 255, 255, 0.2);
}

.vip-text {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.menu-list {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background-color: #f9f9f9;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon-wrapper {
  width: 32px;
  height: 32px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-icon-wrapper.vip-wrapper {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
}

.menu-icon {
  font-size: 18px;
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: #333;
}

.menu-arrow {
  font-size: 18px;
  color: #999;
}

.logout-btn {
  width: 100%;
  height: 48px;
  background: #fff;
  color: #ff4d4f;
  font-size: 16px;
  border-radius: 24px;
  border: none;
  margin-top: 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.logout-btn:hover {
  background-color: #f9f9f9;
}
</style>
