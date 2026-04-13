import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Profile } from '@/types'
import { api } from '@/lib/api'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref<Profile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/api/profile')
      if (!res.ok) throw new Error('Failed to load profile')
      profile.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function updateGoal(daily_calorie_goal: number) {
    const res = await api.put('/api/profile', { daily_calorie_goal })
    if (!res.ok) throw new Error('Failed to update goal')
    profile.value = await res.json()
  }

  return { profile, loading, error, fetchProfile, updateGoal }
})
