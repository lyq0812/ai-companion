<template>
  <view class="create-page">
    <view class="header">
      <text class="title">创建数字人</text>
      <text class="subtitle">仅需4步，打造专属陪伴</text>
    </view>

    <view class="steps">
      <view class="step-item" v-for="(step, index) in steps" :key="index">
        <view class="step-number">{{ index + 1 }}</view>
        <text class="step-title">{{ step.title }}</text>
        <text class="step-desc">{{ step.desc }}</text>
      </view>
    </view>

    <view class="tips-section">
      <text class="tips-title">温馨提示</text>
      <view class="tips-list">
        <text class="tips-item">• 请上传清晰的正面照片，效果会更好</text>
        <text class="tips-item">• 填写的资料越详细，对话越真实自然</text>
        <text class="tips-item">• 所有数据均加密存储，保障您的隐私</text>
      </view>
    </view>

    <button class="btn-primary start-btn" @click="startCreate">开始创建</button>

    <text class="agreement-hint">
      创建即表示同意<text class="link" @click="goToPrivacy">《隐私政策》</text>
    </text>
  </view>
</template>

<script setup lang="ts">
const steps = [
  { title: '上传照片', desc: '上传逝者清晰正面照片' },
  { title: '设置场景', desc: '选择居家活动场景' },
  { title: '填写资料', desc: '完善性格、习惯等信息' },
  { title: '语音配置', desc: '上传语音片段（可选）' }
]

const startCreate = () => {
  uni.navigateTo({
    url: '/pages/create/step1'
  })
}

const goToPrivacy = () => {
  uni.navigateTo({
    url: '/pages/agreement/privacy'
  })
}
</script>

<style scoped>
.create-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #fff 100%);
  padding: 60rpx 40rpx;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
}

.steps {
  margin-bottom: 60rpx;
}

.step-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.step-number {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.step-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.step-desc {
  font-size: 26rpx;
  color: #666;
}

.tips-section {
  background: #fff8f0;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 60rpx;
}

.tips-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.tips-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.start-btn {
  width: 80%;
  margin: 0 auto 40rpx;
}

.agreement-hint {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #999;
}

.link {
  color: #667eea;
}
</style>
