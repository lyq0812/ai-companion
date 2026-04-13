<template>
  <view class="chat-page">
    <!-- 头部 -->
    <view class="chat-header">
      <view class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </view>
      <view class="companion-info">
        <image class="companion-avatar" :src="companion?.avatar" mode="aspectFill" />
        <view class="info-text">
          <text class="companion-name">{{ companion?.name }}</text>
          <text class="online-status">在线</text>
        </view>
      </view>
      <view class="more-btn" @click="showMore">
        <text class="more-icon">⋮</text>
      </view>
    </view>

    <!-- 聊天区域 -->
    <scroll-view 
      class="chat-container" 
      scroll-y 
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      @scrolltoupper="loadMoreMessages"
    >
      <view class="message-list">
        <!-- 加载更多提示 -->
        <view class="load-more" v-if="isLoadingMore">
          <text class="load-text">加载中...</text>
        </view>

        <!-- 消息列表 -->
        <view 
          v-for="(msg, index) in messages" 
          :key="msg.id"
          class="message-item"
          :class="{ 'message-self': msg.isSelf, 'message-other': !msg.isSelf }"
        >
          <!-- 时间分隔 -->
          <view class="time-divider" v-if="shouldShowTime(index)">
            <text class="time-text">{{ formatTime(msg.timestamp) }}</text>
          </view>

          <!-- 消息内容 -->
          <view class="message-content">
            <image 
              v-if="!msg.isSelf" 
              class="message-avatar" 
              :src="companion?.avatar" 
              mode="aspectFill"
            />
            <image 
              v-else 
              class="message-avatar" 
              :src="userStore.userInfo?.avatar || '/static/default-user.png'" 
              mode="aspectFill"
            />
            
            <view class="message-body">
              <view class="message-bubble" :class="{ 'bubble-self': msg.isSelf }">
                <text class="message-text">{{ msg.content }}</text>
              </view>
              <view class="message-status" v-if="msg.isSelf">
                <text class="status-text" v-if="msg.status === 'sending'">发送中...</text>
                <text class="status-text" v-else-if="msg.status === 'sent'">已发送</text>
                <text class="status-text failed" v-else-if="msg.status === 'failed'">发送失败</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 输入区域 -->
    <view class="input-area">
      <view class="input-toolbar">
        <view class="toolbar-btn" @click="showEmoji">
          <text class="toolbar-icon">😊</text>
        </view>
        <view class="toolbar-btn" @click="chooseImage">
          <text class="toolbar-icon">📷</text>
        </view>
        <view class="toolbar-btn" @click="startVoice" v-if="userStore.isVip">
          <text class="toolbar-icon">🎤</text>
        </view>
      </view>
      
      <view class="input-row">
        <textarea
          class="message-input"
          v-model="inputMessage"
          placeholder="输入消息..."
          :maxlength="500"
          :auto-height="true"
          :fixed="true"
          :show-confirm-bar="false"
          @confirm="sendMessage"
        />
        <button 
          class="send-btn" 
          :disabled="!canSend || isSending"
          @click="sendMessage"
        >
          <text v-if="!isSending">发送</text>
          <text v-else>...</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { request } from '@/utils/request'
import dayjs from 'dayjs'

const userStore = useUserStore()
const companion = computed(() => userStore.currentCompanion)

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
const scrollTop = ref(0)
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
    
    const res = await request({
      url: `/chat/messages/${companion.value.id}`,
      method: 'GET',
      data: {
        page: page.value,
        pageSize: 20
      },
      showLoading: isRefresh
    })

    if (isRefresh) {
      messages.value = res.list
    } else {
      messages.value = [...res.list, ...messages.value]
    }
    
    hasMore.value = res.list.length === 20
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
    
    const res = await request({
      url: '/chat/send',
      method: 'POST',
      data: {
        companionId: companion.value.id,
        content
      },
      showLoading: false
    })

    // 更新消息状态
    const index = messages.value.findIndex(m => m.id === tempId)
    if (index > -1) {
      messages.value[index].id = res.messageId
      messages.value[index].status = 'sent'
    }

    // 添加AI回复
    if (res.reply) {
      setTimeout(() => {
        messages.value.push({
          id: res.replyId,
          content: res.reply,
          isSelf: false,
          timestamp: Date.now(),
          status: 'sent'
        })
        scrollToBottom()
      }, 500 + Math.random() * 1000) // 模拟打字延迟
    }
  } catch (error) {
    // 更新为发送失败
    const index = messages.value.findIndex(m => m.id === tempId)
    if (index > -1) {
      messages.value[index].status = 'failed'
    }
    uni.showToast({
      title: '发送失败',
      icon: 'none'
    })
  } finally {
    isSending.value = false
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    scrollTop.value = messages.value.length * 1000 + Math.random()
  })
}

// 加载更多
const loadMoreMessages = () => {
  if (!isLoadingMore.value && hasMore.value) {
    loadMessages(false)
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
  uni.navigateBack()
}

// 更多选项
const showMore = () => {
  uni.showActionSheet({
    itemList: ['清空聊天记录', '导出聊天记录'],
    success: (res) => {
      if (res.tapIndex === 0) {
        clearChat()
      } else if (res.tapIndex === 1) {
        exportChat()
      }
    }
  })
}

// 清空聊天记录
const clearChat = () => {
  uni.showModal({
    title: '提示',
    content: '确定要清空聊天记录吗？',
    success: (res) => {
      if (res.confirm) {
        messages.value = []
        uni.showToast({
          title: '已清空',
          icon: 'success'
        })
      }
    }
  })
}

// 导出聊天记录
const exportChat = () => {
  uni.showToast({
    title: '功能开发中',
    icon: 'none'
  })
}

// 显示表情
const showEmoji = () => {
  uni.showToast({
    title: '表情功能',
    icon: 'none'
  })
}

// 选择图片
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      uni.showToast({
        title: '图片已选择',
        icon: 'none'
      })
    }
  })
}

// 开始语音
const startVoice = () => {
  uni.showToast({
    title: '语音功能',
    icon: 'none'
  })
}

onMounted(() => {
  loadMessages(true)
})

onShow(() => {
  // 刷新消息
  if (messages.value.length === 0) {
    loadMessages(true)
  }
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
  padding: 20rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #eee;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 40rpx;
  color: #333;
}

.companion-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.companion-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
}

.info-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.companion-name {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.online-status {
  font-size: 24rpx;
  color: #07c160;
}

.more-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-icon {
  font-size: 40rpx;
  color: #333;
}

.chat-container {
  flex: 1;
  padding: 20rpx;
}

.message-list {
  display: flex;
  flex-direction: column;
}

.load-more {
  text-align: center;
  padding: 20rpx;
}

.load-text {
  font-size: 24rpx;
  color: #999;
}

.message-item {
  margin-bottom: 20rpx;
}

.time-divider {
  text-align: center;
  margin: 20rpx 0;
}

.time-text {
  font-size: 24rpx;
  color: #999;
  background: #e0e0e0;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 20rpx;
}

.message-self .message-content {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
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
  padding: 24rpx;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.bubble-self {
  background: #95ec69;
}

.message-text {
  font-size: 30rpx;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
}

.message-status {
  margin-top: 8rpx;
}

.status-text {
  font-size: 22rpx;
  color: #999;
}

.status-text.failed {
  color: #ff4d4f;
}

.input-area {
  background: #fff;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #eee;
}

.input-toolbar {
  display: flex;
  gap: 30rpx;
  margin-bottom: 20rpx;
}

.toolbar-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-icon {
  font-size: 40rpx;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 20rpx;
}

.message-input {
  flex: 1;
  min-height: 80rpx;
  max-height: 200rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 20rpx 24rpx;
  font-size: 30rpx;
  line-height: 1.4;
}

.send-btn {
  width: 120rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 16rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.send-btn[disabled] {
  opacity: 0.5;
}
</style>