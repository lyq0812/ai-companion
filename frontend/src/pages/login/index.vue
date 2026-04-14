<template>
  <div class="login-page">
    <div class="login-header">
      <span class="title">欢迎回来</span>
      <span class="subtitle">登录后开启温暖陪伴之旅</span>
    </div>
    
    <div class="login-form">
      <div class="input-group">
        <span class="label">手机号码</span>
        <input 
          class="input-field" 
          type="number" 
          v-model="phone"
          placeholder="请输入手机号码"
          maxlength="11"
        />
      </div>
      
      <div class="input-group">
        <span class="label">验证码</span>
        <div class="verify-group">
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
        </div>
      </div>
      
      <button 
        class="btn-primary login-btn" 
        :disabled="!canSubmit"
        @click="handleLogin"
      >
        登录
      </button>
      
      <div class="divider">
        <div class="line"></div>
        <span class="text">或</span>
        <div class="line"></div>
      </div>
      
      <button class="wechat-btn" @click="wechatLogin">
        <span class="wechat-icon">微信</span>
        <span>微信一键登录</span>
      </button>
    </div>
    
    <div class="agreement">
      <input type="checkbox" v-model="agreed" class="checkbox" />
      <span class="agreement-text">
        我已阅读并同意
        <span class="link" @click="goToUserAgreement">《用户协议》</span>
        和
        <span class="link" @click="goToPrivacy">《隐私政策》</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
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
    // 模拟发送验证码
    console.log('Sending code to:', phone.value)
    
    alert('验证码已发送')
    
    countdown.value = 60
    timer = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (timer) {
          clearInterval(timer)
        }
      }
    }, 1000)
  } catch (error) {
    console.error('Send code failed:', error)
  }
}

const handleLogin = async () => {
  if (!canSubmit.value) return
  
  try {
    // 模拟登录
    const mockRes = {
      token: 'mock-token-123456',
      userInfo: {
        id: '1',
        nickname: '测试用户',
        avatar: 'https://via.placeholder.com/100',
        phone: phone.value,
        isVip: false,
        vipExpireTime: null,
        vipType: null,
        createdAt: new Date().toISOString()
      }
    }
    
    userStore.setToken(mockRes.token)
    userStore.setUserInfo(mockRes.userInfo)
    
    alert('登录成功')
    
    setTimeout(() => {
      router.push('/home')
    }, 1500)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

const wechatLogin = () => {
  if (!agreed.value) {
    alert('请先同意用户协议和隐私政策')
    return
  }
  
  // 模拟微信登录
  alert('微信登录功能暂未实现')
}

const goToUserAgreement = () => {
  router.push('/agreement/user')
}

const goToPrivacy = () => {
  router.push('/agreement/privacy')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #fff;
  padding: 40px 24px;
  box-sizing: border-box;
}

.login-header {
  margin-bottom: 40px;
}

.title {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #999;
}

.login-form {
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.verify-group {
  display: flex;
  gap: 10px;
}

.verify-input {
  flex: 1;
}

.verify-btn {
  width: 100px;
  height: 44px;
  background: #f0f0f0;
  color: #667eea;
  font-size: 13px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.verify-btn:hover {
  background: #e0e0e0;
}

.verify-btn:disabled {
  color: #999;
  background: #f5f5f5;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  margin-top: 30px;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.line {
  flex: 1;
  height: 1px;
  background: #eee;
}

.text {
  padding: 0 16px;
  font-size: 13px;
  color: #999;
}

.wechat-btn {
  width: 100%;
  height: 48px;
  background: #07c160;
  color: #fff;
  font-size: 16px;
  border-radius: 24px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.wechat-btn:hover {
  opacity: 0.9;
}

.wechat-icon {
  font-size: 14px;
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.checkbox {
  margin-top: 2px;
  cursor: pointer;
}

.agreement-text {
  flex: 1;
  font-size: 12px;
  color: #666;
  line-height: 1.6;
}

.link {
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
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