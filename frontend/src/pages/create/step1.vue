<template>
  <div class="step-page">
    <div class="step-header">
      <span class="step-label">步骤 1/4</span>
      <span class="step-title">上传照片</span>
      <span class="step-desc">请上传清晰的正面照片，用于生成数字人形象</span>
    </div>

    <div class="upload-section">
      <div class="upload-box" @click="chooseImage" v-if="!imageUrl">
        <span class="upload-icon">📷</span>
        <span class="upload-text">点击上传照片</span>
        <span class="upload-hint">支持 JPG、PNG 格式</span>
      </div>
      <div class="preview-box" v-else>
        <img class="preview-image" :src="imageUrl" />
        <div class="delete-btn" @click="deleteImage">
          <span class="delete-icon">✕</span>
        </div>
      </div>
      <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleFileChange" />
    </div>

    <div class="example-section">
      <span class="example-title">照片要求</span>
      <div class="example-list">
        <span class="example-item">✓ 正面清晰，五官可见</span>
        <span class="example-item">✓ 光线充足，无遮挡</span>
        <span class="example-item">✓ 建议使用生活照</span>
      </div>
    </div>

    <div class="action-bar">
      <button class="btn-secondary" @click="goBack">返回</button>
      <button class="btn-primary" :disabled="!imageUrl" @click="nextStep">下一步</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const imageUrl = ref('')
const fileInput = ref<HTMLInputElement>()

const chooseImage = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    try {
      // 模拟上传
      imageUrl.value = URL.createObjectURL(file)
    } catch (error) {
      alert('上传失败')
    }
  }
}

const deleteImage = () => {
  imageUrl.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const goBack = () => {
  router.back()
}

const nextStep = () => {
  localStorage.setItem('create_avatar', imageUrl.value)
  router.push('/create/step2')
}
</script>

<style scoped>
.step-page {
  min-height: 100vh;
  background: #f8f9ff;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.step-header {
  margin-bottom: 30px;
}

.step-label {
  display: block;
  font-size: 13px;
  color: #667eea;
  margin-bottom: 8px;
}

.step-title {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.step-desc {
  font-size: 14px;
  color: #666;
}

.upload-section {
  margin-bottom: 30px;
}

.upload-box {
  background: #fff;
  border-radius: 12px;
  padding: 50px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px dashed #ddd;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-box:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.preview-box {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.3s;
}

.delete-btn:hover {
  opacity: 0.8;
}

.delete-icon {
  color: #fff;
  font-size: 14px;
}

.example-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.example-title {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
}

.example-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.example-item {
  font-size: 14px;
  color: #666;
}

.action-bar {
  margin-top: auto;
  display: flex;
  gap: 12px;
}

.action-bar .btn-secondary,
.action-bar .btn-primary {
  flex: 1;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  border-color: #667eea;
  color: #667eea;
}
</style>
