<template>
  <view class="launch-page">
    <view class="launch-content">
      <view class="logo-section">
        <view class="logo-icon">
          <text class="icon-text">AI</text>
        </view>
        <text class="app-name">数字人陪伴</text>
        <text class="app-slogan">温暖陪伴，让爱延续</text>
      </view>
      
      <view class="feature-list">
        <view class="feature-item">
          <text class="feature-icon">🏠</text>
          <text class="feature-text">居家场景自由陪伴</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">💬</text>
          <text class="feature-text">自然对话温暖治愈</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">💝</text>
          <text class="feature-text">情感记忆永久珍藏</text>
        </view>
      </view>
      
      <view class="action-section">
        <button class="btn-primary start-btn" @click="goToHome">开启陪伴之旅</button>
        <text class="hint-text">已有账号？<text class="link" @click="goToLogin">立即登录</text></text>
      </view>
    </view>
    
    <view class="agreement-section">
      <text class="agreement-text">
        登录即代表您同意
        <text class="link" @click="goToUserAgreement">《用户协议》</text>
        和
        <text class="link" @click="goToPrivacy">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onLoad(() => {
  // 检查是否已登录
  if (userStore.isLoggedIn) {
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }, 1500)
  }
})

const goToHome = () => {
  if (userStore.isLoggedIn) {
    uni.switchTab({
      url: '/pages/home/index'
    })
  } else {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  }
}

const goToLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}

const goToUserAgreement = () => {
  uni.navigateTo({
    url: '/pages/agreement/user'
  })
}

const goToPrivacy = () => {
  uni.navigateTo({
    url: '/pages/agreement/privacy'
  })
}
</script>

<style scoped>
.launch-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #fff5f5 100%);
  display: flex;
  flex-direction: column;
  padding: 60rpx 40rpx;
  box-sizing: border-box;
}

.launch-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 120rpx;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 80rpx;
}

.logo-icon {
  width: 180rpx;
  height: 180rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  box-shadow: 0 20rpx 60rpx rgba(102, 126, 234, 0.3);
}

.icon-text {
  font-size: 72rpx;
  font-weight: bold;
  color: #fff;
}

.app-name {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.app-slogan {
  font-size: 28rpx;
  color: #666;
}

.feature-list {
  width: 100%;
  margin-bottom: 100rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 32rpx 40rpx;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 40rpx;
  margin-right: 24rpx;
}

.feature-text {
  font-size: 30rpx;
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
  margin-bottom: 32rpx;
}

.hint-text {
  font-size: 26rpx;
  color: #666;
}

.agreement-section {
  padding: 40rpx 0;
  text-align: center;
}

.agreement-text {
  font-size: 24rpx;
  color: #999;
  line-height: 1.6;
}

.link {
  color: #667eea;
}
</style>