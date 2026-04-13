import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Meal } from '@/types'
import { api } from '@/lib/api'

export const useMealsStore = defineStore('meals', () => {
  const meals = ref<Meal[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchMeals() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/api/meals')
      if (!res.ok) throw new Error('Failed to load meals')
      meals.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function createMeal(data: Omit<Meal, 'id' | 'user_id' | 'created_at'>) {
    const res = await api.post('/api/meals', data)
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error ?? 'Failed to create meal')
    }
    const meal: Meal = await res.json()
    meals.value.push(meal)
    meals.value.sort((a, b) => a.name.localeCompare(b.name))
    return meal
  }

  async function updateMeal(id: string, data: Omit<Meal, 'id' | 'user_id' | 'created_at'>) {
    const res = await api.put(`/api/meals/${id}`, data)
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error ?? 'Failed to update meal')
    }
    const updated: Meal = await res.json()
    const idx = meals.value.findIndex(m => m.id === id)
    if (idx !== -1) meals.value[idx] = updated
    meals.value.sort((a, b) => a.name.localeCompare(b.name))
    return updated
  }

  async function deleteMeal(id: string) {
    const res = await api.delete(`/api/meals/${id}`)
    if (!res.ok) throw new Error('Failed to delete meal')
    meals.value = meals.value.filter(m => m.id !== id)
  }

  return { meals, loading, error, fetchMeals, createMeal, updateMeal, deleteMeal }
})
