<template>
  <div class="chat-page">
    <!-- 头部 -->
    <div class="chat-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">←</span>
      </div>
      <div class="companion-info">
        <img class="companion-avatar" :src="companion?.avatar" />
        <div class="info-text">
          <span class="companion-name">{{ companion?.name }}</span>
          <span class="online-status">在线</span>
        </div>
      </div>
      <div class="header-tools">
        <div class="toolbar-btn" @click="togglePrivacy" :class="{ 'active': isPrivacyMode }">
          <span class="toolbar-icon">🔒</span>
        </div>
        <div class="toolbar-btn" @click="showMore">
          <span class="toolbar-icon">⋮</span>
        </div>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div 
      class="chat-container" 
      ref="chatContainer"
      @scroll="onScroll"
    >
      <!-- 欢迎语 -->
      <div class="welcome-message" v-if="messages.length === 0">
        <div class="welcome-content">
          <div class="welcome-text">式微已就位，愿长夜有伴，心事有归</div>
          <div class="welcome-subtext">想说的话，都可以告诉我</div>
        </div>
      </div>

      <div class="message-list" v-else>
        <!-- 加载更多提示 -->
        <div class="load-more" v-if="isLoadingMore">
          <span class="load-text">加载中...</span>
        </div>

        <!-- 消息列表 -->
        <div 
          v-for="(msg, index) in messages" 
          :key="msg.id"
          class="message-item"
          :class="{ 'message-self': msg.isSelf, 'message-other': !msg.isSelf }"
        >
          <!-- 时间分隔 -->
          <div class="time-divider" v-if="shouldShowTime(index)">
            <span class="time-text">{{ formatTime(msg.timestamp) }}</span>
          </div>

          <!-- 消息内容 -->
          <div class="message-content">
            <div v-if="!msg.isSelf" class="message-avatar-container">
              <img 
                class="message-avatar" 
                :src="companion?.avatar" 
              />
            </div>
            <div v-else class="message-avatar-container">
              <img 
                class="message-avatar" 
                :src="userStore.userInfo?.avatar || '/static/default-user.png'" 
              />
            </div>
            
            <div class="message-body">
              <div class="message-bubble" :class="{ 'bubble-self': msg.isSelf }">
                <span class="message-text">{{ msg.content }}</span>
              </div>
              <div class="message-status" v-if="msg.isSelf">
                <span class="status-text" v-if="msg.status === 'sending'">发送中...</span>
                <span class="status-text" v-else-if="msg.status === 'sent'">已发送</span>
                <span class="status-text failed" v-else-if="msg.status === 'failed'">发送失败</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <div class="input-toolbar">
        <div class="toolbar-btn" @click="showEmoji">
          <span class="toolbar-icon">😊</span>
        </div>
        <div class="toolbar-btn" @click="chooseImage">
          <span class="toolbar-icon">📷</span>
        </div>
        <div class="toolbar-btn" @click="startVoice">
          <span class="toolbar-icon">🎤</span>
        </div>
        <div class="toolbar-btn" @click="showHistory">
          <span class="toolbar-icon">📋</span>
        </div>
        <div class="toolbar-btn" @click="showSettings">
          <span class="toolbar-icon">⚙️</span>
        </div>
      </div>
      
      <div class="input-row">
        <textarea
          class="message-input"
          v-model="inputMessage"
          placeholder="想说的话，都可以告诉我"
          maxlength="500"
          @keydown.enter.prevent="sendMessage"
        />
        <button 
          class="send-btn" 
          :disabled="!canSend || isSending"
          @click="sendMessage"
        >
          {{ !isSending ? '发送' : '...' }}
        </button>
      </div>
    </div>

    <!-- 隐私模式提示 -->
    <div class="privacy-toast" v-if="isPrivacyMode">
      <span class="privacy-text">隐私模式已开启</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { request } from '@/utils/request'
import dayjs from 'dayjs'

const router = useRouter()
const userStore = useUserStore()
const companion = computed(() => userStore.currentCompanion)
const chatContainer = ref<HTMLDivElement>()

// 消息列表
const messages = ref<Array<{
  id: string
  content: string
  isSelf: boolean
  timestamp: number
  status: 'sending' | 'sent' | 'failed'
}>>([])

const inputMessage = ref('')
const isSending = ref(false)
const isLoadingMore = ref(false)
const page = ref(1)
const hasMore = ref(true)
const isPrivacyMode = ref(false)

const canSend = computed(() => {
  return inputMessage.value.trim().length > 0
})

// 加载历史消息
const loadMessages = async (isRefresh = false) => {
  if (!companion.value) return
  
  if (isRefresh) {
    page.value = 1
    hasMore.value = true
  }
  
  if (!hasMore.value && !isRefresh) return

  try {
    isLoadingMore.value = !isRefresh
    
    // 模拟数据
    const mockData = {
      list: Array.from({ length: 20 }, (_, i) => ({
        id: `mock-${Date.now()}-${i}`,
        content: i % 2 === 0 ? '你好，今天过得怎么样？' : '我很好，谢谢关心！',
        isSelf: i % 2 === 0,
        timestamp: Date.now() - i * 10000,
        status: 'sent' as const
      })),
      total: 100
    }

    if (isRefresh) {
      messages.value = mockData.list
    } else {
      messages.value = [...mockData.list, ...messages.value]
    }
    
    hasMore.value = mockData.list.length === 20
    page.value++
    
    if (isRefresh) {
      scrollToBottom()
    }
  } catch (error) {
    console.error('Load messages failed:', error)
  } finally {
    isLoadingMore.value = false
  }
}

// 发送消息
const sendMessage = async () => {
  if (!canSend.value || isSending.value || !companion.value) return

  const content = inputMessage.value.trim()
  const tempId = Date.now().toString()
  
  // 添加本地消息
  const newMessage = {
    id: tempId,
    content,
    isSelf: true,
    timestamp: Date.now(),
    status: 'sending' as const
  }
  
  messages.value.push(newMessage)
  inputMessage.value = ''
  scrollToBottom()
  
  try {
    isSending.value = true
    
    // 模拟发送
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新消息状态
    const index = messages.value.findIndex(m => m.id === tempId)
    if (index > -1) {
      messages.value[index].status = 'sent'
    }

    // 添加AI回复
    setTimeout(() => {
      messages.value.push({
        id: `reply-${Date.now()}`,
        content: '我理解你的心情，我会一直在这里陪伴你。',
        isSelf: false,
        timestamp: Date.now(),
        status: 'sent'
      })
      scrollToBottom()
    }, 500 + Math.random() * 1000) // 模拟打字延迟
  } catch (error) {
    // 更新为发送失败
    const index = messages.value.findIndex(m => m.id === tempId)
    if (index > -1) {
      messages.value[index].status = 'failed'
    }
    alert('发送失败')
  } finally {
    isSending.value = false
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// 滚动事件
const onScroll = () => {
  if (chatContainer.value) {
    const { scrollTop } = chatContainer.value
    if (scrollTop < 50 && !isLoadingMore.value && hasMore.value) {
      loadMessages(false)
    }
  }
}

// 判断是否显示时间
const shouldShowTime = (index: number) => {
  if (index === 0) return true
  const current = messages.value[index].timestamp
  const prev = messages.value[index - 1].timestamp
  return current - prev > 5 * 60 * 1000 // 5分钟以上显示时间
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = dayjs()
  const time = dayjs(timestamp)
  
  if (time.isSame(now, 'day')) {
    return time.format('HH:mm')
  } else if (time.isSame(now.subtract(1, 'day'), 'day')) {
    return '昨天 ' + time.format('HH:mm')
  } else if (time.isSame(now, 'year')) {
    return time.format('MM-DD HH:mm')
  } else {
    return time.format('YYYY-MM-DD HH:mm')
  }
}

// 返回
const goBack = () => {
  router.back()
}

// 更多选项
const showMore = () => {
  if (confirm('确定要清空聊天记录吗？')) {
    clearChat()
  }
}

// 清空聊天记录
const clearChat = () => {
  messages.value = []
  alert('已清空')
}

// 导出聊天记录
const exportChat = () => {
  alert('功能开发中')
}

// 显示表情
const showEmoji = () => {
  alert('表情功能')
}

// 选择图片
const chooseImage = () => {
  alert('图片已选择')
}

// 开始语音
const startVoice = () => {
  alert('语音功能')
}

// 显示历史记录
const showHistory = () => {
  alert('历史记录功能')
}

// 显示设置
const showSettings = () => {
  alert('设置功能')
}

// 切换隐私模式
const togglePrivacy = () => {
  isPrivacyMode.value = !isPrivacyMode.value
}

onMounted(() => {
  loadMessages(true)
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #F7F3E3 0%, #E8E2D0 100%);
  background-image: 
    url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%234a6b6e" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E'),
    url('data:image/svg+xml,%3Csvg width="100%25" height="100%25" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="mountain" patternUnits="userSpaceOnUse" width="100" height="100"%3E%3Cpath d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="%232C2C2C" fill-opacity="0.03"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23mountain)"/%3E%3C/svg%3E');
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-header {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(74, 107, 110, 0.1);
  backdrop-filter: blur(10px);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(74, 107, 110, 0.1);
}

.back-icon {
  font-size: 20px;
  color: #2C2C2C;
}

.companion-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.companion-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(74, 107, 110, 0.2);
  box-shadow: 0 2px 8px rgba(74, 107, 110, 0.1);
}

.info-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.companion-name {
  font-size: 18px;
  font-weight: 600;
  color: #2C2C2C;
  font-family: 'Noto Sans SC', serif;
}

.online-status {
  font-size: 12px;
  color: #07c160;
  display: flex;
  align-items: center;
  gap: 4px;
}

.online-status::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #07c160;
  border-radius: 50%;
}

.header-tools {
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.toolbar-btn:hover {
  background: rgba(74, 107, 110, 0.1);
}

.toolbar-btn.active {
  background: rgba(196, 69, 54, 0.1);
  color: #C44536;
}

.toolbar-icon {
  font-size: 18px;
  color: #4A6B6E;
}

.toolbar-btn.active .toolbar-icon {
  color: #C44536;
}

.chat-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.welcome-message {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  animation: fadeIn 1s ease-in-out;
}

.welcome-content {
  text-align: center;
  max-width: 80%;
}

.welcome-text {
  font-size: 20px;
  font-weight: 600;
  color: #4A6B6E;
  margin-bottom: 12px;
  font-family: 'Noto Sans SC', serif;
}

.welcome-subtext {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.message-list {
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.5s ease-in-out;
}

.load-more {
  text-align: center;
  padding: 12px;
  margin-bottom: 10px;
}

.load-text {
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.7);
  padding: 6px 16px;
  border-radius: 16px;
}

.message-item {
  margin-bottom: 16px;
  animation: slideUp 0.3s ease-out;
}

.time-divider {
  text-align: center;
  margin: 16px 0;
}

.time-text {
  font-size: 12px;
  color: #999;
  background: rgba(255, 255, 255, 0.7);
  padding: 4px 12px;
  border-radius: 12px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.message-self .message-content {
  flex-direction: row-reverse;
}

.message-avatar-container {
  flex-shrink: 0;
  position: relative;
}

.message-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(74, 107, 110, 0.2);
  box-shadow: 0 2px 4px rgba(74, 107, 110, 0.1);
}

.message-body {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-self .message-body {
  align-items: flex-end;
}

.message-bubble {
  background: rgba(255, 255, 255, 0.9);
  padding: 14px 18px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(74, 107, 110, 0.1);
  position: relative;
  backdrop-filter: blur(5px);
}

.message-bubble::before {
  content: '';
  position: absolute;
  top: 16px;
  left: -8px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid rgba(255, 255, 255, 0.9);
}

.message-self .message-bubble {
  background: rgba(74, 107, 110, 0.9);
  color: white;
}

.message-self .message-bubble::before {
  left: auto;
  right: -8px;
  border-right: none;
  border-left: 8px solid rgba(74, 107, 110, 0.9);
}

.message-text {
  font-size: 16px;
  line-height: 1.6;
  word-wrap: break-word;
}

.message-self .message-text {
  color: white;
}

.message-status {
  margin-top: 6px;
}

.status-text {
  font-size: 12px;
  color: #999;
}

.status-text.failed {
  color: #C44536;
}

.input-area {
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 16px;
  border-top: 1px solid rgba(74, 107, 110, 0.1);
  backdrop-filter: blur(10px);
}

.input-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  justify-content: center;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 12px;
}

.message-input {
  flex: 1;
  min-height: 48px;
  max-height: 120px;
  background: rgba(247, 243, 227, 0.7);
  border-radius: 24px;
  padding: 14px 20px;
  font-size: 16px;
  line-height: 1.4;
  border: 1px solid rgba(74, 107, 110, 0.2);
  resize: none;
  transition: all 0.3s ease;
  font-family: 'Noto Sans SC', serif;
}

.message-input:focus {
  outline: none;
  border-color: #4A6B6E;
  box-shadow: 0 0 0 3px rgba(74, 107, 110, 0.1);
}

.send-btn {
  width: 56px;
  height: 48px;
  background: linear-gradient(135deg, #4A6B6E 0%, #2C2C2C 100%);
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(74, 107, 110, 0.2);
}

.send-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s;
}

.send-btn:hover::before {
  left: 100%;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 107, 110, 0.3);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.privacy-toast {
  position: fixed;
  top: 80px;
  right: 20px;
  background: rgba(196, 69, 54, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
  backdrop-filter: blur(10px);
}

.privacy-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.privacy-text::before {
  content: '🔒';
  font-size: 14px;
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
  .chat-container {
    padding: 16px;
  }
  
  .companion-avatar {
    width: 40px;
    height: 40px;
  }
  
  .companion-name {
    font-size: 16px;
  }
  
  .message-avatar {
    width: 36px;
    height: 36px;
  }
  
  .message-bubble {
    padding: 12px 16px;
  }
  
  .message-text {
    font-size: 15px;
  }
  
  .message-input {
    min-height: 44px;
    padding: 12px 18px;
  }
  
  .send-btn {
    width: 48px;
    height: 44px;
  }
}
</style>