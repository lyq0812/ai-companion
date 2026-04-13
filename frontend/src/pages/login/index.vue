<template>
  <view class="login-page">
    <view class="login-header">
      <text class="title">欢迎回来</text>
      <text class="subtitle">登录后开启温暖陪伴之旅</text>
    </view>
    
    <view class="login-form">
      <view class="input-group">
        <text class="label">手机号码</text>
        <input 
          class="input-field" 
          type="number" 
          v-model="phone"
          placeholder="请输入手机号码"
          maxlength="11"
        />
      </view>
      
      <view class="input-group">
        <text class="label">验证码</text>
        <view class="verify-group">
          <input 
            class="input-field verify-input" 
            type="number" 
            v-model="code"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <button 
            class="verify-btn" 
            :disabled="isCounting || !isValidPhone"
            @click="sendCode"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </view>
      </view>
      
      <button 
        class="btn-primary login-btn" 
        :disabled="!canSubmit"
        @click="handleLogin"
      >
        登录
      </button>
      
      <view class="divider">
        <view class="line"></view>
        <text class="text">或</text>
        <view class="line"></view>
      </view>
      
      <button class="wechat-btn" @click="wechatLogin">
        <text class="wechat-icon">微信</text>
        <text>微信一键登录</text>
      </button>
    </view>
    
    <view class="agreement">
      <checkbox :checked="agreed" @click="agreed = !agreed" color="#667eea" />
      <text class="agreement-text">
        我已阅读并同意
        <text class="link" @click="goToUserAgreement">《用户协议》</text>
        和
        <text class="link" @click="goToPrivacy">《隐私政策》</text>
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { request } from '@/utils/request'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const phone = ref('')
const code = ref('')
const agreed = ref(false)
const countdown = ref(0)
const isCounting = computed(() => countdown.value > 0)

const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(phone.value)
})

const canSubmit = computed(() => {
  return isValidPhone.value && code.value.length === 6 && agreed.value
})

let timer: number | null = null

const sendCode = async () => {
  if (!isValidPhone.value || isCounting.value) return
  
  try {
    await request({
      url: '/auth/send-code',
      method: 'POST',
      data: { phone: phone.value }
    })
    
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
    
    countdown.value = 60
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer!)
      }
    }, 1000)
  } catch (error) {
    console.error('Send code failed:', error)
  }
}

const handleLogin = async () => {
  if (!canSubmit.value) return
  
  try {
    const res = await request({
      url: '/auth/login',
      method: 'POST',
      data: {
        phone: phone.value,
        code: code.value
      }
    })
    
    userStore.setToken(res.token)
    userStore.setUserInfo(res.userInfo)
    
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.switchTab({
        url: '/pages/home/index'
      })
    }, 1500)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const wechatLogin = () => {
  if (!agreed.value) {
    uni.showToast({
      title: '请先同意用户协议和隐私政策',
      icon: 'none'
    })
    return
  }
  
  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      try {
        const res = await request({
          url: '/auth/wechat-login',
          method: 'POST',
          data: {
            code: loginRes.code
          }
        })
        
        userStore.setToken(res.token)
        userStore.setUserInfo(res.userInfo)
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/home/index'
          })
        }, 1500)
      } catch (error) {
        console.error('Wechat login failed:', error)
      }
    },
    fail: () => {
      uni.showToast({
        title: '微信登录失败',
        icon: 'none'
      })
    }
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
.login-page {
  min-height: 100vh;
  background: #fff;
  padding: 80rpx 48rpx;
  box-sizing: border-box;
}

.login-header {
  margin-bottom: 80rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #999;
}

.login-form {
  margin-bottom: 60rpx;
}

.input-group {
  margin-bottom: 40rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.verify-group {
  display: flex;
  gap: 20rpx;
}

.verify-input {
  flex: 1;
}

.verify-btn {
  width: 200rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #f0f0f0;
  color: #667eea;
  font-size: 26rpx;
  border-radius: 16rpx;
  border: none;
}

.verify-btn[disabled] {
  color: #999;
  background: #f5f5f5;
}

.login-btn {
  width: 100%;
  margin-top: 60rpx;
}

.login-btn[disabled] {
  opacity: 0.6;
}

.divider {
  display: flex;
  align-items: center;
  margin: 48rpx 0;
}

.line {
  flex: 1;
  height: 2rpx;
  background: #eee;
}

.text {
  padding: 0 32rpx;
  font-size: 26rpx;
  color: #999;
}

.wechat-btn {
  width: 100%;
  height: 96rpx;
  line-height: 96rpx;
  background: #07c160;
  color: #fff;
  font-size: 32rpx;
  border-radius: 48rpx;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
}

.wechat-icon {
  font-size: 28rpx;
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}

.agreement-text {
  flex: 1;
  font-size: 24rpx;
  color: #666;
  line-height: 1.6;
}

.link {
  color: #667eea;
}
</style>