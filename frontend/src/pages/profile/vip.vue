<template>
  <div class="vip-page">
    <div class="vip-header">
      <span class="vip-title">会员中心</span>
      <span class="vip-subtitle">解锁更多专属功能</span>
    </div>

    <!-- 会员状态 -->
    <div class="vip-status-card" :class="{ 'is-vip': userStore.isVip }">
      <div class="status-content">
        <span class="status-title">{{ userStore.isVip ? '您已是会员' : '开通会员' }}</span>
        <span class="status-desc" v-if="userStore.isVip">有效期至 {{ userStore.vipExpireDate }}</span>
        <span class="status-desc" v-else>享受完整陪伴体验</span>
      </div>
      <div class="vip-badge-large" v-if="userStore.isVip">
        <span>VIP</span>
      </div>
    </div>

    <!-- 会员套餐 -->
    <div class="vip-plans" v-if="!userStore.isVip">
      <div 
        class="plan-card" 
        v-for="plan in plans" 
        :key="plan.type"
        :class="{ active: selectedPlan === plan.type }"
        @click="selectedPlan = plan.type"
      >
        <div class="plan-header">
          <span class="plan-name">{{ plan.name }}</span>
          <div class="plan-badge" v-if="plan.badge">{{ plan.badge }}</div>
        </div>
        <div class="plan-price">
          <span class="price-symbol">¥</span>
          <span class="price-num">{{ plan.price }}</span>
          <span class="price-unit">/{{ plan.unit }}</span>
        </div>
        <div class="plan-features">
          <span class="feature-item" v-for="feature in plan.features" :key="feature">{{ feature }}</span>
        </div>
      </div>
    </div>

    <!-- 会员权益 -->
    <div class="vip-benefits">
      <span class="benefits-title">会员权益</span>
      <div class="benefits-grid">
        <div class="benefit-item" v-for="benefit in benefits" :key="benefit.icon">
          <span class="benefit-icon">{{ benefit.icon }}</span>
          <span class="benefit-name">{{ benefit.name }}</span>
          <span class="benefit-desc">{{ benefit.desc }}</span>
        </div>
      </div>
    </div>

    <!-- 开通按钮 -->
    <button class="btn-primary pay-btn" v-if="!userStore.isVip" @click="handlePay">
      立即开通 ¥{{ currentPlan.price }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const selectedPlan = ref<'month' | 'year' | 'family'>('year')

interface Plan {
  type: 'month' | 'year' | 'family'
  name: string
  price: number
  unit: string
  badge: string
  features: string[]
}

const plans: Plan[] = [
  {
    type: 'month',
    name: '月卡',
    price: 49,
    unit: '月',
    badge: '',
    features: ['✓ 高清数字人', '✓ 自由走动', '✓ 深度AI记忆']
  },
  {
    type: 'year',
    name: '年卡',
    price: 198,
    unit: '年',
    badge: '推荐',
    features: ['✓ 所有月卡权益', '✓ 语音对话', '✓ 无广告体验', '✓ 节省62%']
  },
  {
    type: 'family',
    name: '家庭版',
    price: 298,
    unit: '年',
    badge: '超值',
    features: ['✓ 所有年卡权益', '✓ 5个数字人', '✓ 家庭共享', '✓ 优先客服']
  }
]

const benefits = [
  { icon: '🎨', name: '高清形象', desc: '超清数字人画质' },
  { icon: '🚶', name: '自由走动', desc: '场景自由移动' },
  { icon: '🧠', name: '深度记忆', desc: 'AI长期记忆' },
  { icon: '🎤', name: '语音对话', desc: '语音聊天功能' },
  { icon: '🚫', name: '无广告', desc: '纯净体验' },
  { icon: '💾', name: '云存储', desc: '无限聊天记录' }
]

const currentPlan = computed(() => {
  return plans.find(p => p.type === selectedPlan.value) || plans[1]
})

const handlePay = async () => {
  try {
    // 模拟支付
    alert('支付功能暂未实现')
    // 模拟支付成功
    setTimeout(() => {
      alert('支付成功')
      // 更新会员状态
      const expireTime = new Date()
      expireTime.setFullYear(expireTime.getFullYear() + 1)
      userStore.updateVipStatus(true, expireTime.toISOString(), selectedPlan.value)
    }, 1000)
  } catch (error) {
    alert('支付失败')
  }
}
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  padding: 20px;
  box-sizing: border-box;
}

.vip-header {
  text-align: center;
  margin-bottom: 20px;
}

.vip-title {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 6px;
}

.vip-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.vip-status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.vip-status-card.is-vip {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
}

.status-title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 6px;
}

.status-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.vip-badge-large {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.vip-plans {
  margin-bottom: 20px;
}

.plan-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.plan-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.plan-card.active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.plan-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.plan-name {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.plan-badge {
  background: #ff4d4f;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.plan-price {
  margin-bottom: 10px;
}

.price-symbol {
  font-size: 14px;
  color: #ffd700;
}

.price-num {
  font-size: 28px;
  font-weight: bold;
  color: #ffd700;
}

.price-unit {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.feature-item {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}

.vip-benefits {
  margin-bottom: 20px;
}

.benefits-title {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.benefit-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  transition: background-color 0.3s;
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.benefit-icon {
  display: block;
  font-size: 20px;
  margin-bottom: 6px;
}

.benefit-name {
  display: block;
  font-size: 12px;
  color: #fff;
  margin-bottom: 4px;
}

.benefit-desc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.pay-btn {
  width: 100%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #333;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.3s;
}

.pay-btn:hover {
  opacity: 0.9;
}

.btn-primary {
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 16px;
  transition: opacity 0.3s;
}
</style>
