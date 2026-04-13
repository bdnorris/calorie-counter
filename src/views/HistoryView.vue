<script setup lang="ts">
import { onMounted } from 'vue'
import { useLogStore } from '@/stores/log'
import { useProfileStore } from '@/stores/profile'

const logStore = useLogStore()
const profileStore = useProfileStore()

async function clearHistory() {
  if (!confirm("Clear all history? This deletes all past log entries and cannot be undone. Today's log will be kept.")) return
  try {
    await logStore.clearHistory()
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Failed to clear history')
  }
}

function formatDate(dateStr: string) {
  const parts = dateStr.split('-').map(Number)
  return new Date(parts[0]!, parts[1]! - 1, parts[2]!).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

function statusClass(total: number, goal: number) {
  const ratio = total / goal
  if (ratio > 1) return 'over'
  if (ratio > 0.9) return 'low'
  return 'good'
}

function statusLabel(total: number, goal: number) {
  const diff = goal - total
  if (diff < 0) return `${Math.abs(diff).toLocaleString()} over`
  return `${diff.toLocaleString()} under`
}

onMounted(async () => {
  await Promise.all([logStore.fetchHistory(), profileStore.fetchProfile()])
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">History</h1>

    <div v-if="logStore.historyLoading" class="muted">Loading...</div>

    <template v-else>
      <div v-if="logStore.history.length === 0" class="card muted">
        No history yet. Past days will appear here.
      </div>

      <ul v-else class="history-list">
      <li v-for="day in logStore.history" :key="day.log_date" class="history-item card">
        <div class="history-date">{{ formatDate(day.log_date) }}</div>
        <div class="history-stats">
          <span class="history-calories">{{ day.total_calories.toLocaleString() }} cal</span>
          <span
            v-if="profileStore.profile"
            class="history-status"
            :class="statusClass(day.total_calories, profileStore.profile.daily_calorie_goal)"
          >
            {{ statusLabel(day.total_calories, profileStore.profile.daily_calorie_goal) }}
          </span>
          <span class="muted history-entries">{{ day.entry_count }} entries</span>
        </div>
      </li>
      </ul>

      <div v-if="logStore.history.length > 0" class="card danger-zone">
        <h2>Danger zone</h2>
        <p class="muted">Clears all past days from your history. Today's log is not affected.</p>
        <button class="btn btn-danger" @click="clearHistory">Clear history</button>
      </div>
    </template>
  </div>
</template>
