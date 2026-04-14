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
      <div class="more-btn" @click="showMore">
        <span class="more-icon">⋮</span>
      </div>
    </div>

    <!-- 聊天区域 -->
    <div 
      class="chat-container" 
      ref="chatContainer"
      @scroll="onScroll"
    >
      <div class="message-list">
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
            <img 
              v-if="!msg.isSelf" 
              class="message-avatar" 
              :src="companion?.avatar" 
            />
            <img 
              v-else 
              class="message-avatar" 
              :src="userStore.userInfo?.avatar || '/static/default-user.png'" 
            />
            
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
        <div class="toolbar-btn" @click="startVoice" v-if="userStore.isVip">
          <span class="toolbar-icon">🎤</span>
        </div>
      </div>
      
      <div class="input-row">
        <textarea
          class="message-input"
          v-model="inputMessage"
          placeholder="输入消息..."
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

onMounted(() => {
  loadMessages(true)
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: #fff;
  padding: 10px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}

.back-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-icon {
  font-size: 20px;
  color: #333;
}

.companion-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.companion-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
}

.info-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.companion-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.online-status {
  font-size: 12px;
  color: #07c160;
}

.more-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.more-icon {
  font-size: 20px;
  color: #333;
}

.chat-container {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.load-more {
  text-align: center;
  padding: 10px;
}

.load-text {
  font-size: 12px;
  color: #999;
}

.message-item {
  margin-bottom: 10px;
}

.time-divider {
  text-align: center;
  margin: 10px 0;
}

.time-text {
  font-size: 12px;
  color: #999;
  background: #e0e0e0;
  padding: 4px 10px;
  border-radius: 4px;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.message-self .message-content {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  flex-shrink: 0;
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
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.bubble-self {
  background: #95ec69;
}

.message-text {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-status {
  margin-top: 4px;
}

.status-text {
  font-size: 11px;
  color: #999;
}

.status-text.failed {
  color: #ff4d4f;
}

.input-area {
  background: #fff;
  padding: 10px 15px;
  border-top: 1px solid #eee;
}

.input-toolbar {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.toolbar-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.toolbar-icon {
  font-size: 20px;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.message-input {
  flex: 1;
  min-height: 40px;
  max-height: 100px;
  background: #f5f5f5;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 15px;
  line-height: 1.4;
  border: none;
  resize: none;
}

.send-btn {
  width: 60px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.send-btn:hover {
  opacity: 0.9;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>