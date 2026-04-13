<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useLogStore } from '@/stores/log'

const profileStore = useProfileStore()
const logStore = useLogStore()

const goalInput = ref<number | null>(null)
const goalError = ref('')
const goalSaving = ref(false)
const goalSaved = ref(false)

watch(() => profileStore.profile, (p) => {
  if (p) goalInput.value = p.daily_calorie_goal
}, { immediate: true })

async function saveGoal() {
  goalError.value = ''
  goalSaved.value = false
  if (!goalInput.value || goalInput.value < 1) {
    goalError.value = 'Please enter a positive number.'
    return
  }
  goalSaving.value = true
  try {
    await profileStore.updateGoal(goalInput.value)
    goalSaved.value = true
    setTimeout(() => { goalSaved.value = false }, 2500)
  } catch (e) {
    goalError.value = e instanceof Error ? e.message : 'Failed to save'
  } finally {
    goalSaving.value = false
  }
}

async function clearHistory() {
  if (!confirm('Clear all history? This deletes all past log entries and cannot be undone. Today\'s log will be kept.')) return
  try {
    await logStore.clearHistory()
    alert('History cleared.')
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Failed to clear history')
  }
}

onMounted(() => profileStore.fetchProfile())
</script>

<template>
  <div class="page">
    <h1 class="page-title">Settings</h1>

    <div class="card">
      <h2>Daily calorie goal</h2>
      <form @submit.prevent="saveGoal">
        <div class="field">
          <label for="goal-input">Calories per day</label>
          <input
            id="goal-input"
            v-model.number="goalInput"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 2000"
          />
        </div>
        <p v-if="goalError" class="form-error">{{ goalError }}</p>
        <p v-if="goalSaved" class="form-success">Saved!</p>
        <button type="submit" class="btn btn-primary" :disabled="goalSaving">
          {{ goalSaving ? 'Saving...' : 'Save goal' }}
        </button>
      </form>
    </div>

    <div class="card danger-zone">
      <h2>Danger zone</h2>
      <p class="muted">Clears all past days from your history. Today's log is not affected.</p>
      <button class="btn btn-danger" @click="clearHistory">Clear history</button>
    </div>
  </div>
</template>
