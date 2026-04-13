<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLogStore } from '@/stores/log'
import { useMealsStore } from '@/stores/meals'
import { useProfileStore } from '@/stores/profile'
import CalorieProgress from '@/components/CalorieProgress.vue'
import type { Meal } from '@/types'

const logStore = useLogStore()
const mealsStore = useMealsStore()
const profileStore = useProfileStore()

// Add entry form state
const selectedMealId = ref<string>('')
const grams = ref<number | null>(null)
const customName = ref('')
const customCalories = ref<number | null>(null)
const formError = ref('')
const submitting = ref(false)

const selectedMeal = computed<Meal | null>(() => {
  if (!selectedMealId.value || selectedMealId.value === 'custom') return null
  return mealsStore.meals.find(m => m.id === selectedMealId.value) ?? null
})

const calculatedCalories = computed<number | null>(() => {
  const meal = selectedMeal.value
  if (!meal || meal.calorie_type !== 'per_gram' || !grams.value) return null
  return Math.round((meal.reference_calories / meal.reference_grams!) * grams.value)
})

function resetForm() {
  selectedMealId.value = ''
  grams.value = null
  customName.value = ''
  customCalories.value = null
  formError.value = ''
}

async function addEntry() {
  formError.value = ''

  if (!selectedMealId.value) {
    formError.value = 'Please select a meal or choose Custom.'
    return
  }

  try {
    submitting.value = true
    if (selectedMealId.value === 'custom') {
      if (!customCalories.value || customCalories.value < 1) {
        formError.value = 'Please enter a calorie amount.'
        return
      }
      await logStore.addEntry({
        meal_name: customName.value.trim() || 'Custom',
        calorie_type: 'arbitrary',
        calories: customCalories.value,
      })
    } else {
      const meal = selectedMeal.value!
      if (meal.calorie_type === 'per_gram') {
        if (!grams.value || grams.value <= 0) {
          formError.value = 'Please enter grams.'
          return
        }
        await logStore.addEntry({
          meal_id: meal.id,
          meal_name: meal.name,
          calorie_type: 'per_gram',
          grams: grams.value,
          calories: calculatedCalories.value!,
        })
      } else {
        await logStore.addEntry({
          meal_id: meal.id,
          meal_name: meal.name,
          calorie_type: 'flat',
          calories: meal.reference_calories,
        })
      }
    }
    resetForm()
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Failed to add entry'
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
  // dateStr is YYYY-MM-DD local
  const parts = dateStr.split('-').map(Number)
  return new Date(parts[0]!, parts[1]! - 1, parts[2]!).toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

const today = (() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
})()

onMounted(async () => {
  await Promise.all([
    logStore.fetchTodayEntries(),
    mealsStore.fetchMeals(),
    profileStore.fetchProfile(),
  ])
})
</script>

<template>
  <div class="page">
    <h1 class="page-title">{{ formatDate(today) }}</h1>

    <CalorieProgress
      v-if="profileStore.profile"
      :consumed="logStore.totalCalories"
      :goal="profileStore.profile.daily_calorie_goal"
    />

    <!-- Add Entry Form -->
    <div class="card">
      <h2>Add Entry</h2>
      <form @submit.prevent="addEntry">
        <div class="field">
          <label for="meal-select">Meal</label>
          <select id="meal-select" v-model="selectedMealId" @change="grams = null">
            <option value="">— Select —</option>
            <optgroup v-if="mealsStore.meals.length" label="Your meals">
              <option v-for="meal in mealsStore.meals" :key="meal.id" :value="meal.id">
                {{ meal.name }}
                ({{ meal.calorie_type === 'flat'
                  ? meal.reference_calories + ' cal flat'
                  : meal.reference_calories + ' cal / ' + meal.reference_grams + 'g' }})
              </option>
            </optgroup>
            <option value="custom">Custom calories</option>
          </select>
        </div>

        <!-- Per gram meal: enter grams -->
        <template v-if="selectedMeal?.calorie_type === 'per_gram'">
          <p class="hint">
            Reference: {{ selectedMeal.reference_grams }}g = {{ selectedMeal.reference_calories }} cal
          </p>
          <div class="field">
            <label for="grams-input">Grams eaten</label>
            <input
              id="grams-input"
              v-model.number="grams"
              type="number"
              min="0.1"
              step="any"
              placeholder="e.g. 150"
            />
          </div>
          <p v-if="calculatedCalories !== null" class="cal-preview">
            = <strong>{{ calculatedCalories }}</strong> calories
          </p>
        </template>

        <!-- Flat meal: show info only -->
        <template v-if="selectedMeal?.calorie_type === 'flat'">
          <p class="hint">
            This adds <strong>{{ selectedMeal.reference_calories }}</strong> calories.
          </p>
        </template>

        <!-- Custom calories -->
        <template v-if="selectedMealId === 'custom'">
          <div class="field">
            <label for="custom-name">Label (optional)</label>
            <input
              id="custom-name"
              v-model="customName"
              type="text"
              placeholder="e.g. Coffee, Snack..."
            />
          </div>
          <div class="field">
            <label for="custom-cal">Calories</label>
            <input
              id="custom-cal"
              v-model.number="customCalories"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 250"
              required
            />
          </div>
        </template>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="submitting || !selectedMealId"
        >
          {{ submitting ? 'Adding...' : 'Add' }}
        </button>
      </form>
    </div>

    <!-- Today's entries -->
    <div class="card">
      <h2>Today's log</h2>
      <div v-if="logStore.loading" class="muted">Loading...</div>
      <div v-else-if="logStore.entries.length === 0" class="muted">Nothing logged yet.</div>
      <ul v-else class="entry-list">
        <li v-for="entry in logStore.entries" :key="entry.id" class="entry-item">
          <div class="entry-info">
            <span class="entry-name">{{ entry.meal_name }}</span>
            <span class="entry-detail muted">
              <template v-if="entry.calorie_type === 'per_gram'">
                {{ entry.grams }}g &mdash;
              </template>
              {{ entry.calories }} cal
            </span>
          </div>
          <button class="btn-delete" @click="deleteEntry(entry.id)" title="Remove">✕</button>
        </li>
      </ul>
    </div>
  </div>
</template>
