<template>
  <view class="companion-page">
    <!-- 场景区域 -->
    <view class="scene-container" @click="onSceneClick">
      <image 
        class="scene-bg" 
        :src="companion?.sceneImage || '/static/default-scene.jpg'" 
        mode="aspectFill"
      />
      
      <!-- 数字人角色 -->
      <view 
        class="avatar-container"
        :style="avatarStyle"
        @click.stop="onAvatarClick"
      >
        <view class="avatar-wrapper" :class="{ 'is-talking': isTalking }">
          <image 
            class="avatar-image" 
            :src="companion?.avatar || '/static/default-avatar.jpg'" 
            mode="aspectFill"
          />
          <view class="avatar-glow" v-if="isTalking"></view>
        </view>
        
        <!-- 气泡对话框 -->
        <view class="speech-bubble" v-if="currentSpeech">
          <text class="speech-text">{{ currentSpeech }}</text>
        </view>
      </view>
      
      <!-- 快捷操作按钮 -->
      <view class="scene-actions">
        <view class="action-btn" @click.stop="toggleAnimation">
          <text class="action-icon">{{ isMoving ? '⏸️' : '▶️' }}</text>
        </view>
        <view class="action-btn" @click.stop="triggerGreeting">
          <text class="action-icon">👋</text>
        </view>
        <view class="action-btn" @click.stop="goToChat">
          <text class="action-icon">💬</text>
        </view>
      </view>
    </view>
    
    <!-- 底部信息栏 -->
    <view class="info-bar">
      <view class="companion-info">
        <text class="companion-name">{{ companion?.name || '数字人' }}</text>
        <text class="companion-status">{{ statusText }}</text>
      </view>
      <button class="chat-btn" @click="goToChat">
        <text>开始聊天</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { request } from '@/utils/request'

const userStore = useUserStore()
const companion = computed(() => userStore.currentCompanion)

// 数字人状态
const avatarPosition = ref({ x: 50, y: 60 }) // 百分比位置
const isMoving = ref(true)
const isTalking = ref(false)
const currentSpeech = ref('')
const statusText = ref('正在自由活动')

// 动画相关
let animationTimer: number | null = null
let speechTimer: number | null = null

// 计算数字人样式
const avatarStyle = computed(() => {
  return {
    left: `${avatarPosition.value.x}%`,
    top: `${avatarPosition.value.y}%`,
    transform: 'translate(-50%, -50%)'
  }
})

// 随机移动逻辑
const randomMove = () => {
  if (!isMoving.value || !companion.value) return
  
  // 随机目标位置（保持在场景中央区域）
  const targetX = 30 + Math.random() * 40 // 30% - 70%
  const targetY = 50 + Math.random() * 30 // 50% - 80%
  
  // 平滑移动
  const startX = avatarPosition.value.x
  const startY = avatarPosition.value.y
  const duration = 2000 + Math.random() * 2000 // 2-4秒
  const startTime = Date.now()
  
  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // 缓动函数
    const easeProgress = 1 - Math.pow(1 - progress, 3)
    
    avatarPosition.value.x = startX + (targetX - startX) * easeProgress
    avatarPosition.value.y = startY + (targetY - startY) * easeProgress
    
    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // 移动完成后，随机停顿一段时间
      const pauseTime = 1000 + Math.random() * 3000
      setTimeout(() => {
        if (isMoving.value) {
          randomMove()
        }
      }, pauseTime)
    }
  }
  
  animate()
}

// 随机说话
const randomSpeech = () => {
  if (!companion.value) return
  
  const speeches = [
    '今天过得怎么样？',
    '想聊聊吗？',
    '我在这里陪着你',
    '记得按时吃饭哦',
    '天气不错，出去走走吧',
    '有什么开心的事想分享吗？',
    '我一直都在',
    '你看起来有点累，休息一下吧'
  ]
  
  const randomIndex = Math.floor(Math.random() * speeches.length)
  showSpeech(speeches[randomIndex])
}

// 显示对话
const showSpeech = (text: string) => {
  currentSpeech.value = text
  isTalking.value = true
  
  if (speechTimer) {
    clearTimeout(speechTimer)
  }
  
  speechTimer = setTimeout(() => {
    currentSpeech.value = ''
    isTalking.value = false
  }, 4000)
}

// 切换动画状态
const toggleAnimation = () => {
  isMoving.value = !isMoving.value
  statusText.value = isMoving.value ? '正在自由活动' : '已暂停'
  
  if (isMoving.value) {
    randomMove()
  }
}

// 触发问候
const triggerGreeting = () => {
  const greetings = [
    '你好呀！',
    '很高兴见到你！',
    '今天想聊点什么？',
    '我一直在等你呢'
  ]
  const randomIndex = Math.floor(Math.random() * greetings.length)
  showSpeech(greetings[randomIndex])
}

// 点击场景
const onSceneClick = (e: any) => {
  // 可以添加点击场景的逻辑
  console.log('Scene clicked', e)
}

// 点击数字人
const onAvatarClick = () => {
  triggerGreeting()
}

// 跳转到聊天
const goToChat = () => {
  uni.navigateTo({
    url: '/pages/chat/index'
  })
}

// 初始化
onMounted(() => {
  if (companion.value) {
    // 延迟开始移动
    setTimeout(() => {
      randomMove()
    }, 1000)
    
    // 随机说话定时器
    animationTimer = setInterval(() => {
      if (Math.random() > 0.7) { // 30%概率说话
        randomSpeech()
      }
    }, 15000) // 每15秒检查一次
  }
})

onUnmounted(() => {
  if (animationTimer) {
    clearInterval(animationTimer)
  }
  if (speechTimer) {
    clearTimeout(speechTimer)
  }
})

onShow(() => {
  // 页面显示时恢复动画
  if (companion.value && !isMoving.value) {
    isMoving.value = true
    randomMove()
  }
})
</script>

<style scoped>
.companion-page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.scene-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.scene-bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.avatar-container {
  position: absolute;
  z-index: 10;
  transition: none;
}

.avatar-wrapper {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  border: 4rpx solid rgba(255, 255, 255, 0.8);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-glow {
  position: absolute;
  top: -10rpx;
  left: -10rpx;
  right: -10rpx;
  bottom: -10rpx;
  border-radius: 90rpx;
  border: 4rpx solid rgba(102, 126, 234, 0.6);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.6;
  }
}

.speech-bubble {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 20rpx;
  background: #fff;
  padding: 20rpx 32rpx;
  border-radius: 24rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  min-width: 200rpx;
  max-width: 400rpx;
  animation: fadeInUp 0.3s ease;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 16rpx solid transparent;
  border-top-color: #fff;
}

.speech-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.scene-actions {
  position: absolute;
  top: 40rpx;
  right: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  z-index: 20;
}

.action-btn {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.action-icon {
  font-size: 36rpx;
}

.info-bar {
  background: #fff;
  padding: 32rpx 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.companion-info {
  display: flex;
  flex-direction: column;
}

.companion-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.companion-status {
  font-size: 24rpx;
  color: #999;
}

.chat-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 24rpx 48rpx;
  border-radius: 40rpx;
  font-size: 30rpx;
  font-weight: 500;
  border: none;
}
</style>