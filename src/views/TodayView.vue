<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLogStore } from '@/stores/log'
import { useProfileStore } from '@/stores/profile'
import CalorieProgress from '@/components/CalorieProgress.vue'
import FoodPicker from '@/components/FoodPicker.vue'
import type { AddEntryInput } from '@/stores/log'

const logStore = useLogStore()
const profileStore = useProfileStore()

// Food picker
const pickerOpen = ref(false)

async function handlePickerAdd(entry: AddEntryInput) {
  await logStore.addEntry(entry)
}

// Custom calorie entry
const customName = ref('')
const customCalories = ref<number | null>(null)
const customError = ref('')
const submitting = ref(false)

async function addCustomEntry() {
  customError.value = ''
  if (!customCalories.value || customCalories.value < 1) {
    customError.value = 'Please enter a calorie amount.'
    return
  }
  submitting.value = true
  try {
    await logStore.addEntry({
      meal_name: customName.value.trim() || 'Custom',
      calorie_type: 'arbitrary',
      calories: customCalories.value,
    })
    customName.value = ''
    customCalories.value = null
  } catch (e) {
    customError.value = e instanceof Error ? e.message : 'Failed to add entry'
  } finally {
    submitting.value = false
  }
}

async function deleteEntry(id: string) {
  try {
    await logStore.deleteEntry(id)
  } catch {
    // silent
  }
}

function formatDate(dateStr: string) {
  const parts = dateStr.split('-').map(Number)
  return new Date(parts[0]!, parts[1]! - 1, parts[2]!).toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

const today = (() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})()

onMounted(() => Promise.all([logStore.fetchTodayEntries(), profileStore.fetchProfile()]))
</script>

<template>
  <div class="page">
    <h1 class="page-title">{{ formatDate(today) }}</h1>

    <CalorieProgress
      v-if="profileStore.profile"
      :consumed="logStore.totalCalories"
      :goal="profileStore.profile.daily_calorie_goal"
    />

    <!-- Add entry -->
    <div class="card">
      <h2>Add entry</h2>
      <button class="btn btn-primary btn-full" @click="pickerOpen = true">
        Browse food library
      </button>
      <div class="custom-or">or</div>
      <form @submit.prevent="addCustomEntry" class="custom-entry-form">
        <input
          v-model="customName"
          type="text"
          placeholder="Label (optional)"
        />
        <input
          v-model.number="customCalories"
          type="number"
          min="1"
          step="1"
          placeholder="Calories"
        />
        <button
          type="submit"
          class="btn btn-secondary"
          :disabled="submitting || !customCalories || customCalories < 1"
        >Add</button>
      </form>
      <p v-if="customError" class="form-error" style="margin-top: 8px;">{{ customError }}</p>
    </div>

    <!-- Today's log -->
    <div class="card">
      <h2>Today's log</h2>
      <div v-if="logStore.loading" class="muted">Loading...</div>
      <div v-else-if="logStore.entries.length === 0" class="muted">Nothing logged yet.</div>
      <ul v-else class="entry-list">
        <li v-for="entry in logStore.entries" :key="entry.id" class="entry-item">
          <div class="entry-info">
            <span class="entry-name">{{ entry.meal_name }}</span>
            <span class="entry-detail muted">
              <template v-if="entry.calorie_type === 'per_gram'">{{ entry.grams }}g &mdash; </template>
              {{ entry.calories }} cal
            </span>
          </div>
          <button class="btn-delete" @click="deleteEntry(entry.id)" title="Remove">✕</button>
        </li>
      </ul>
    </div>
  </div>

  <FoodPicker v-model="pickerOpen" @add="handlePickerAdd" />
</template>
