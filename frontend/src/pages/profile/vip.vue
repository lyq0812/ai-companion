<template>
  <view class="vip-page">
    <view class="vip-header">
      <text class="vip-title">会员中心</text>
      <text class="vip-subtitle">解锁更多专属功能</text>
    </view>

    <!-- 会员状态 -->
    <view class="vip-status-card" :class="{ 'is-vip': userStore.isVip }">
      <view class="status-content">
        <text class="status-title">{{ userStore.isVip ? '您已是会员' : '开通会员' }}</text>
        <text class="status-desc" v-if="userStore.isVip">有效期至 {{ userStore.vipExpireDate }}</text>
        <text class="status-desc" v-else>享受完整陪伴体验</text>
      </view>
      <view class="vip-badge-large" v-if="userStore.isVip">
        <text>VIP</text>
      </view>
    </view>

    <!-- 会员套餐 -->
    <view class="vip-plans" v-if="!userStore.isVip">
      <view 
        class="plan-card" 
        v-for="plan in plans" 
        :key="plan.type"
        :class="{ active: selectedPlan === plan.type }"
        @click="selectedPlan = plan.type"
      >
        <view class="plan-header">
          <text class="plan-name">{{ plan.name }}</text>
          <view class="plan-badge" v-if="plan.badge">{{ plan.badge }}</view>
        </view>
        <view class="plan-price">
          <text class="price-symbol">¥</text>
          <text class="price-num">{{ plan.price }}</text>
          <text class="price-unit">/{{ plan.unit }}</text>
        </view>
        <view class="plan-features">
          <text class="feature-item" v-for="feature in plan.features" :key="feature">{{ feature }}</text>
        </view>
      </view>
    </view>

    <!-- 会员权益 -->
    <view class="vip-benefits">
      <text class="benefits-title">会员权益</text>
      <view class="benefits-grid">
        <view class="benefit-item" v-for="benefit in benefits" :key="benefit.icon">
          <text class="benefit-icon">{{ benefit.icon }}</text>
          <text class="benefit-name">{{ benefit.name }}</text>
          <text class="benefit-desc">{{ benefit.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 开通按钮 -->
    <button class="btn-primary pay-btn" v-if="!userStore.isVip" @click="handlePay">
      立即开通 ¥{{ currentPlan.price }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { request } from '@/utils/request'

const userStore = useUserStore()
const selectedPlan = ref('year')

const plans = [
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
    const res = await request({
      url: '/payment/create-order',
      method: 'POST',
      data: {
        planType: selectedPlan.value,
        amount: currentPlan.value.price
      }
    })

    // 调用微信支付
    uni.requestPayment({
      provider: 'wxpay',
      orderInfo: res.paymentParams,
      success: () => {
        uni.showToast({ title: '支付成功', icon: 'success' })
        // 更新会员状态
        userStore.updateVipStatus(true, res.expireTime, selectedPlan.value as any)
      },
      fail: () => {
        uni.showToast({ title: '支付取消', icon: 'none' })
      }
    })
  } catch (error) {
    uni.showToast({ title: '支付失败', icon: 'none' })
  }
}
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  padding: 40rpx;
  box-sizing: border-box;
}

.vip-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.vip-title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #ffd700;
  margin-bottom: 12rpx;
}

.vip-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}

.vip-status-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.vip-status-card.is-vip {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
}

.status-title {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 12rpx;
}

.status-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.vip-badge-large {
  width: 100rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.vip-plans {
  margin-bottom: 40rpx;
}

.plan-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  border: 2rpx solid transparent;
}

.plan-card.active {
  border-color: #ffd700;
  background: rgba(255, 215, 0, 0.1);
}

.plan-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.plan-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
}

.plan-badge {
  background: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.plan-price {
  margin-bottom: 20rpx;
}

.price-symbol {
  font-size: 28rpx;
  color: #ffd700;
}

.price-num {
  font-size: 56rpx;
  font-weight: bold;
  color: #ffd700;
}

.price-unit {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}

.plan-features {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.feature-item {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.vip-benefits {
  margin-bottom: 40rpx;
}

.benefits-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 24rpx;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.benefit-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
}

.benefit-icon {
  display: block;
  font-size: 40rpx;
  margin-bottom: 12rpx;
}

.benefit-name {
  display: block;
  font-size: 24rpx;
  color: #fff;
  margin-bottom: 8rpx;
}

.benefit-desc {
  font-size: 20rpx;
  color: rgba(255, 255, 255, 0.5);
}

.pay-btn {
  width: 100%;
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #333;
  font-weight: bold;
}
</style>
