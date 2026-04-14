<template>
  <div class="companion-page">
    <!-- 场景区域 -->
    <div class="scene-container" @click="onSceneClick">
      <img 
        class="scene-bg" 
        :src="companion?.sceneImage || '/static/default-scene.jpg'" 
      />
      
      <!-- 数字人角色 -->
      <div 
        class="avatar-container"
        :style="avatarStyle"
        @click.stop="onAvatarClick"
      >
        <div class="avatar-wrapper" :class="{ 'is-talking': isTalking }">
          <img 
            class="avatar-image" 
            :src="companion?.avatar || '/static/default-avatar.jpg'" 
          />
          <div class="avatar-glow" v-if="isTalking"></div>
        </div>
        
        <!-- 气泡对话框 -->
        <div class="speech-bubble" v-if="currentSpeech">
          <span class="speech-text">{{ currentSpeech }}</span>
        </div>
      </div>
      
      <!-- 快捷操作按钮 -->
      <div class="scene-actions">
        <div class="action-btn" @click.stop="toggleAnimation">
          <span class="action-icon">{{ isMoving ? '⏸️' : '▶️' }}</span>
        </div>
        <div class="action-btn" @click.stop="triggerGreeting">
          <span class="action-icon">👋</span>
        </div>
        <div class="action-btn" @click.stop="goToChat">
          <span class="action-icon">💬</span>
        </div>
      </div>
    </div>
    
    <!-- 底部信息栏 -->
    <div class="info-bar">
      <div class="companion-info">
        <span class="companion-name">{{ companion?.name || '数字人' }}</span>
        <span class="companion-status">{{ statusText }}</span>
      </div>
      <button class="chat-btn" @click="goToChat">
        开始聊天
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
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
  router.push('/chat')
}

// 初始化
onMounted(() => {
  if (companion.value) {
    // 延迟开始移动
    setTimeout(() => {
      randomMove()
    }, 1000)
    
    // 随机说话定时器
    animationTimer = window.setInterval(() => {
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
  object-fit: cover;
}

.avatar-container {
  position: absolute;
  z-index: 10;
  transition: none;
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-glow {
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 45px;
  border: 2px solid rgba(102, 126, 234, 0.6);
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
  margin-bottom: 10px;
  background: #fff;
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  max-width: 200px;
  animation: fadeInUp 0.3s ease;
}

.speech-bubble::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 8px solid transparent;
  border-top-color: #fff;
}

.speech-text {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.scene-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 20;
}

.action-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.action-icon {
  font-size: 18px;
}

.info-bar {
  background: #fff;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.companion-info {
  display: flex;
  flex-direction: column;
}

.companion-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.companion-status {
  font-size: 12px;
  color: #999;
}

.chat-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 24px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.chat-btn:hover {
  opacity: 0.9;
}
</style>