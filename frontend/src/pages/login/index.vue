<template>
  <div class="login-page">
    <!-- 品牌标识 -->
    <div class="brand-section">
      <h1 class="brand-name">式微</h1>
      <p class="brand-slogan">暮色有光，心安有伴</p>
      <p class="brand-sub-slogan">式微归处，AI相伴</p>
    </div>

    <!-- 登录表单 -->
    <div class="login-form">
      <h2 class="form-title">愿每一段思念，都有回应</h2>
      <p class="form-subtitle">AI数字人·复刻回忆·温柔相伴</p>

      <!-- 登录方式切换 -->
      <div class="login-tabs">
        <button 
          :class="['tab-btn', loginType === 'password' ? 'active' : '']"
          @click="loginType = 'password'"
        >
          账号密码登录
        </button>
        <button 
          :class="['tab-btn', loginType === 'sms' ? 'active' : '']"
          @click="loginType = 'sms'"
        >
          手机号登录
        </button>
      </div>

      <!-- 密码登录表单 -->
      <div v-if="loginType === 'password'" class="form-content">
        <div class="input-group">
          <span class="label">账号</span>
          <input 
            class="input-field" 
            type="text" 
            v-model="form.username"
            placeholder="请输入账号"
          />
        </div>
        <div class="input-group">
          <span class="label">密码</span>
          <input 
            class="input-field" 
            type="password" 
            v-model="form.password"
            placeholder="请输入密码"
          />
        </div>
        <button 
          class="btn-primary login-btn" 
          @click="handlePasswordLogin"
        >
          登录
        </button>
      </div>

      <!-- 手机号登录表单 -->
      <div v-else class="form-content">
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
      </div>

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

    <!-- 底部文案 -->
    <p class="bottom-text">暮色降临，我在这里等你</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const loginType = ref('sms') // 'password' 或 'sms'
const phone = ref('')
const code = ref('')
const agreed = ref(false)
const countdown = ref(0)
const isCounting = computed(() => countdown.value > 0)

const form = ref({
  username: '',
  password: ''
})

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

const handlePasswordLogin = async () => {
  try {
    // 模拟登录
    const mockRes = {
      token: 'mock-token-123456',
      userInfo: {
        id: '1',
        nickname: '测试用户',
        avatar: 'https://via.placeholder.com/100',
        username: form.value.username,
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
  background: linear-gradient(135deg, #F7F3E3 0%, #E8E2D0 100%);
  background-image: 
    url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%234a6b6e" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E'),
    url('data:image/svg+xml,%3Csvg width="100%25" height="100%25" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="mountain" patternUnits="userSpaceOnUse" width="100" height="100"%3E%3Cpath d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="%232C2C2C" fill-opacity="0.03"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23mountain)"/%3E%3C/svg%3E');
  padding: 40px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand-section {
  text-align: center;
  margin-bottom: 40px;
  animation: fadeIn 0.8s ease-in-out;
}

.brand-name {
  font-size: 48px;
  font-weight: bold;
  color: #2C2C2C;
  margin-bottom: 12px;
  font-family: 'Noto Sans SC', serif;
}

.brand-slogan {
  font-size: 18px;
  color: #4A6B6E;
  margin-bottom: 8px;
}

.brand-sub-slogan {
  font-size: 14px;
  color: #666;
}

.login-form {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(74, 107, 110, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(74, 107, 110, 0.1);
  margin-bottom: 30px;
  animation: fadeIn 0.8s ease-in-out 0.2s both;
}

.form-title {
  font-size: 24px;
  color: #2C2C2C;
  margin-bottom: 8px;
  font-weight: 600;
  text-align: center;
}

.form-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
}

.login-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid rgba(74, 107, 110, 0.2);
}

.tab-btn {
  flex: 1;
  padding: 12px 0;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-btn.active {
  color: #C44536;
  font-weight: 600;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #C44536;
}

.form-content {
  animation: slideUp 0.5s ease-out;
}

.input-group {
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 14px;
  color: #2C2C2C;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-field {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  background: rgba(247, 243, 227, 0.5);
  border: 1px solid rgba(74, 107, 110, 0.2);
  border-radius: 8px;
  font-size: 16px;
  color: #2C2C2C;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #4A6B6E;
  box-shadow: 0 0 0 3px rgba(74, 107, 110, 0.1);
}

.verify-group {
  display: flex;
  gap: 12px;
}

.verify-input {
  flex: 1;
}

.verify-btn {
  width: 120px;
  height: 48px;
  background: rgba(74, 107, 110, 0.1);
  border: 1px solid rgba(74, 107, 110, 0.3);
  border-radius: 8px;
  color: #4A6B6E;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.verify-btn:hover:not(:disabled) {
  background: rgba(74, 107, 110, 0.2);
}

.verify-btn:disabled {
  opacity: 0.6;
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
  background: rgba(74, 107, 110, 0.2);
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
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.wechat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
}

.wechat-icon {
  font-size: 14px;
}

.agreement {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
  animation: fadeIn 0.8s ease-in-out 0.4s both;
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
  color: #4A6B6E;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.link:hover {
  color: #C44536;
}

.bottom-text {
  font-size: 12px;
  color: #999;
  font-style: italic;
  animation: fadeIn 0.8s ease-in-out 0.6s both;
}

.btn-primary {
  background: linear-gradient(135deg, #4A6B6E 0%, #2C2C2C 100%);
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 107, 110, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-page {
    padding: 30px 20px;
  }
  
  .brand-name {
    font-size: 36px;
  }
  
  .form-title {
    font-size: 20px;
  }
  
  .login-form {
    padding: 24px;
  }
  
  .input-field {
    height: 44px;
    padding: 0 14px;
  }
  
  .btn-primary {
    padding: 12px 40px;
  }
}
</style>