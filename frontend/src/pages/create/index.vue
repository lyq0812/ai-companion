<template>
  <div class="create-page">
    <div class="header">
      <span class="title">创建数字人</span>
      <span class="subtitle">仅需4步，打造专属陪伴</span>
    </div>

    <div class="steps">
      <div class="step-item" v-for="(step, index) in steps" :key="index">
        <div class="step-number">{{ index + 1 }}</div>
        <span class="step-title">{{ step.title }}</span>
        <span class="step-desc">{{ step.desc }}</span>
      </div>
    </div>

    <div class="tips-section">
      <span class="tips-title">温馨提示</span>
      <div class="tips-list">
        <span class="tips-item">• 请上传清晰的正面照片，效果会更好</span>
        <span class="tips-item">• 填写的资料越详细，对话越真实自然</span>
        <span class="tips-item">• 所有数据均加密存储，保障您的隐私</span>
      </div>
    </div>

    <button class="btn-primary start-btn" @click="startCreate">开始创建</button>

    <span class="agreement-hint">
      创建即表示同意<span class="link" @click="goToPrivacy">《隐私政策》</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const steps = [
  { title: '上传照片', desc: '上传逝者清晰正面照片' },
  { title: '设置场景', desc: '选择居家活动场景' },
  { title: '填写资料', desc: '完善性格、习惯等信息' },
  { title: '语音配置', desc: '上传语音片段（可选）' }
]

const startCreate = () => {
  router.push('/create/step1')
}

const goToPrivacy = () => {
  router.push('/agreement/privacy')
}
</script>

<style scoped>
.create-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9ff 0%, #fff 100%);
  padding: 30px 20px;
  box-sizing: border-box;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #666;
}

.steps {
  margin-bottom: 30px;
}

.step-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s;
}

.step-item:hover {
  transform: translateY(-2px);
}

.step-number {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.step-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 6px;
}

.step-desc {
  font-size: 13px;
  color: #666;
}

.tips-section {
  background: #fff8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 30px;
}

.tips-title {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tips-item {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}

.start-btn {
  width: 80%;
  margin: 0 auto 20px;
}

.agreement-hint {
  display: block;
  text-align: center;
  font-size: 12px;
  color: #999;
}

.link {
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
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
  display: block;
}

.btn-primary:hover {
  opacity: 0.9;
}
</style>
