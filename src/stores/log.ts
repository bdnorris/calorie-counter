import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LogEntry, DaySummary } from '@/types'
import { api } from '@/lib/api'

function getLocalDateString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export interface AddEntryInput {
  meal_id?: string
  meal_name: string
  calorie_type: 'per_gram' | 'flat' | 'arbitrary'
  grams?: number
  calories: number
}

export const useLogStore = defineStore('log', () => {
  const entries = ref<LogEntry[]>([])
  const history = ref<DaySummary[]>([])
  const loading = ref(false)
  const historyLoading = ref(false)
  const error = ref<string | null>(null)

  const totalCalories = computed(() =>
    entries.value.reduce((sum, e) => sum + Number(e.calories), 0)
  )

  async function fetchTodayEntries() {
    loading.value = true
    error.value = null
    try {
      const date = getLocalDateString()
      const res = await api.get(`/api/log-entries?date=${date}`)
      if (!res.ok) throw new Error('Failed to load log entries')
      entries.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function addEntry(input: AddEntryInput) {
    const date = getLocalDateString()
    const res = await api.post('/api/log-entries', {
      log_date: date,
      meal_id: input.meal_id ?? null,
      meal_name: input.meal_name,
      calorie_type: input.calorie_type,
      grams: input.grams ?? null,
      calories: input.calories,
    })
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error ?? 'Failed to add entry')
    }
    const entry: LogEntry = await res.json()
    entries.value.push(entry)
    return entry
  }

  async function deleteEntry(id: string) {
    const res = await api.delete(`/api/log-entries/${id}`)
    if (!res.ok) throw new Error('Failed to delete entry')
    entries.value = entries.value.filter(e => e.id !== id)
  }

  async function fetchHistory() {
    historyLoading.value = true
    try {
      const res = await api.get('/api/history')
      if (!res.ok) throw new Error('Failed to load history')
      history.value = await res.json()
    } finally {
      historyLoading.value = false
    }
  }

  async function clearHistory() {
    const res = await api.delete('/api/history')
    if (!res.ok) throw new Error('Failed to clear history')
    history.value = []
  }

  return {
    entries,
    history,
    loading,
    historyLoading,
    error,
    totalCalories,
    fetchTodayEntries,
    addEntry,
    deleteEntry,
    fetchHistory,
    clearHistory,
  }
})
