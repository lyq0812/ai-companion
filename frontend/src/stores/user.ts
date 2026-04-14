import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  isVip: boolean
  vipExpireTime: string | null
  vipType: 'month' | 'year' | 'family' | null
  createdAt: string
}

interface Companion {
  id: string
  name: string
  avatar: string
  sceneImage: string
  gender: 'male' | 'female'
  birthYear: number
  deathYear: number
  personality: string
  catchphrase: string
  speakingStyle: string
  habits: string
  memories: string
  hobbies: string
  values: string
  voiceUrl: string | null
  isActive: boolean
  createdAt: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)
  const companions = ref<Companion[]>([])
  const currentCompanion = ref<Companion | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const isVip = computed(() => userInfo.value?.isVip || false)
  const vipExpireDate = computed(() => {
    if (!userInfo.value?.vipExpireTime) return null
    return new Date(userInfo.value.vipExpireTime).toLocaleDateString('zh-CN')
  })

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  const initUserInfo = () => {
    const storedToken = localStorage.getItem('token')
    const storedUserInfo = localStorage.getItem('userInfo')
    
    if (storedToken) {
      token.value = storedToken
    }
    
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
      } catch (e) {
        console.error('Parse user info failed:', e)
      }
    }
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    companions.value = []
    currentCompanion.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  const setCompanions = (list: Companion[]) => {
    companions.value = list
  }

  const setCurrentCompanion = (companion: Companion | null) => {
    currentCompanion.value = companion
    if (companion) {
      localStorage.setItem('currentCompanionId', companion.id)
    } else {
      localStorage.removeItem('currentCompanionId')
    }
  }

  const addCompanion = (companion: Companion) => {
    companions.value.unshift(companion)
  }

  const removeCompanion = (companionId: string) => {
    const index = companions.value.findIndex(c => c.id === companionId)
    if (index > -1) {
      companions.value.splice(index, 1)
    }
    if (currentCompanion.value?.id === companionId) {
      currentCompanion.value = companions.value[0] || null
    }
  }

  const updateVipStatus = (isVipStatus: boolean, expireTime: string | null, type: 'month' | 'year' | 'family' | null) => {
    if (userInfo.value) {
      userInfo.value.isVip = isVipStatus
      userInfo.value.vipExpireTime = expireTime
      userInfo.value.vipType = type
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    }
  }

  return {
    token,
    userInfo,
    companions,
    currentCompanion,
    isLoggedIn,
    isVip,
    vipExpireDate,
    setToken,
    setUserInfo,
    initUserInfo,
    logout,
    setCompanions,
    setCurrentCompanion,
    addCompanion,
    removeCompanion,
    updateVipStatus
  }
})