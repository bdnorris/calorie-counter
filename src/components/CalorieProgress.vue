<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  consumed: number
  goal: number
}>()

const remaining = computed(() => props.goal - props.consumed)
const percent = computed(() => Math.min((props.consumed / props.goal) * 100, 100))

const barColor = computed(() => {
  const p = (props.consumed / props.goal) * 100
  if (p >= 100) return 'var(--color-danger)'
  if (p >= 80) return 'var(--color-warning)'
  return 'var(--color-primary)'
})

const remainingClass = computed(() => {
  if (remaining.value < 0) return 'over'
  if (remaining.value < props.goal * 0.2) return 'low'
  return ''
})
</script>

<template>
  <div class="progress-card">
    <div class="progress-stats">
      <div class="stat">
        <span class="stat-label">Goal</span>
        <span class="stat-value">{{ goal.toLocaleString() }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Consumed</span>
        <span class="stat-value">{{ consumed.toLocaleString() }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Remaining</span>
        <span class="stat-value" :class="remainingClass">
          {{ remaining < 0 ? '+' + Math.abs(remaining).toLocaleString() + ' over' : remaining.toLocaleString() }}
        </span>
      </div>
    </div>
    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        :style="{ width: percent + '%', background: barColor }"
      ></div>
    </div>
  </div>
</template>
