<template>
  <view class="step-page">
    <view class="step-header">
      <text class="step-label">步骤 1/4</text>
      <text class="step-title">上传照片</text>
      <text class="step-desc">请上传清晰的正面照片，用于生成数字人形象</text>
    </view>

    <view class="upload-section">
      <view class="upload-box" @click="chooseImage" v-if="!imageUrl">
        <text class="upload-icon">📷</text>
        <text class="upload-text">点击上传照片</text>
        <text class="upload-hint">支持 JPG、PNG 格式</text>
      </view>
      <view class="preview-box" v-else>
        <image class="preview-image" :src="imageUrl" mode="aspectFill" />
        <view class="delete-btn" @click="deleteImage">
          <text class="delete-icon">✕</text>
        </view>
      </view>
    </view>

    <view class="example-section">
      <text class="example-title">照片要求</text>
      <view class="example-list">
        <text class="example-item">✓ 正面清晰，五官可见</text>
        <text class="example-item">✓ 光线充足，无遮挡</text>
        <text class="example-item">✓ 建议使用生活照</text>
      </view>
    </view>

    <view class="action-bar">
      <button class="btn-secondary" @click="goBack">返回</button>
      <button class="btn-primary" :disabled="!imageUrl" @click="nextStep">下一步</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadFile } from '@/utils/request'

const imageUrl = ref('')

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      try {
        const url = await uploadFile(res.tempFilePaths[0], 'image')
        imageUrl.value = url
      } catch (error) {
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
      }
    }
  })
}

const deleteImage = () => {
  imageUrl.value = ''
}

const goBack = () => {
  uni.navigateBack()
}

const nextStep = () => {
  uni.setStorageSync('create_avatar', imageUrl.value)
  uni.navigateTo({
    url: '/pages/create/step2'
  })
}
</script>

<style scoped>
.step-page {
  min-height: 100vh;
  background: #f8f9ff;
  padding: 40rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.step-header {
  margin-bottom: 60rpx;
}

.step-label {
  display: block;
  font-size: 26rpx;
  color: #667eea;
  margin-bottom: 16rpx;
}

.step-title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.step-desc {
  font-size: 28rpx;
  color: #666;
}

.upload-section {
  margin-bottom: 60rpx;
}

.upload-box {
  background: #fff;
  border-radius: 24rpx;
  padding: 100rpx 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 4rpx dashed #ddd;
}

.upload-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
}

.upload-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 16rpx;
}

.upload-hint {
  font-size: 24rpx;
  color: #999;
}

.preview-box {
  position: relative;
  border-radius: 24rpx;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 600rpx;
}

.delete-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-icon {
  color: #fff;
  font-size: 28rpx;
}

.example-section {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 60rpx;
}

.example-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.example-item {
  font-size: 28rpx;
  color: #666;
}

.action-bar {
  margin-top: auto;
  display: flex;
  gap: 24rpx;
}

.action-bar .btn-secondary,
.action-bar .btn-primary {
  flex: 1;
}
</style>
