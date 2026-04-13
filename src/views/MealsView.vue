<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useMealsStore } from '@/stores/meals'
import type { Meal } from '@/types'

const mealsStore = useMealsStore()

type MealForm = {
  name: string
  calorie_type: 'per_gram' | 'flat'
  reference_calories: number | null
  reference_grams: number | null
}

function emptyForm(): MealForm {
  return { name: '', calorie_type: 'flat', reference_calories: null, reference_grams: null }
}

const showForm = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<MealForm>(emptyForm())
const formError = ref('')
const submitting = ref(false)

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  formError.value = ''
  showForm.value = true
}

function openEdit(meal: Meal) {
  editingId.value = meal.id
  Object.assign(form, {
    name: meal.name,
    calorie_type: meal.calorie_type,
    reference_calories: meal.reference_calories,
    reference_grams: meal.reference_grams,
  })
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editingId.value = null
}

async function submitForm() {
  formError.value = ''
  if (!form.name.trim()) { formError.value = 'Name is required.'; return }
  if (!form.reference_calories || form.reference_calories < 1) {
    formError.value = 'Calories must be a positive number.'; return
  }
  if (form.calorie_type === 'per_gram' && (!form.reference_grams || form.reference_grams <= 0)) {
    formError.value = 'Grams must be a positive number for per-gram meals.'; return
  }

  submitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      calorie_type: form.calorie_type,
      reference_calories: form.reference_calories,
      reference_grams: form.calorie_type === 'per_gram' ? form.reference_grams : null,
    }
    if (editingId.value) {
      await mealsStore.updateMeal(editingId.value, payload)
    } else {
      await mealsStore.createMeal(payload)
    }
    showForm.value = false
    editingId.value = null
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Failed to save meal'
  } finally {
    submitting.value = false
  }
}

async function deleteMeal(id: string, name: string) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
  try {
    await mealsStore.deleteMeal(id)
  } catch {
    // silent
  }
}

onMounted(() => mealsStore.fetchMeals())
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">My Meals</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add meal</button>
    </div>

    <!-- Meal form -->
    <div v-if="showForm" class="card">
      <h2>{{ editingId ? 'Edit meal' : 'New meal' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="field">
          <label for="meal-name">Name</label>
          <input id="meal-name" v-model="form.name" type="text" required placeholder="e.g. Chicken breast" />
        </div>

        <div class="field">
          <label>Type</label>
          <div class="radio-group">
            <label class="radio-label">
              <input v-model="form.calorie_type" type="radio" value="flat" />
              Flat calories
            </label>
            <label class="radio-label">
              <input v-model="form.calorie_type" type="radio" value="per_gram" />
              Per gram (serving size)
            </label>
          </div>
        </div>

        <template v-if="form.calorie_type === 'flat'">
          <div class="field">
            <label for="flat-cal">Calories</label>
            <input
              id="flat-cal"
              v-model.number="form.reference_calories"
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 350"
            />
          </div>
        </template>

        <template v-else>
          <p class="hint">Enter a reference serving size, e.g. 200 cal for 123g.</p>
          <div class="field-row">
            <div class="field">
              <label for="pg-cal">Calories</label>
              <input
                id="pg-cal"
                v-model.number="form.reference_calories"
                type="number"
                min="1"
                step="any"
                placeholder="e.g. 200"
              />
            </div>
            <span class="field-row-sep">for</span>
            <div class="field">
              <label for="pg-grams">Grams</label>
              <input
                id="pg-grams"
                v-model.number="form.reference_grams"
                type="number"
                min="0.1"
                step="any"
                placeholder="e.g. 123"
              />
            </div>
            <span class="field-row-sep">g</span>
          </div>
        </template>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <div class="btn-row">
          <button type="button" class="btn btn-secondary" @click="cancelForm">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Meals list -->
    <div v-if="mealsStore.loading" class="muted">Loading...</div>
    <div v-else-if="mealsStore.meals.length === 0 && !showForm" class="card muted">
      No meals yet. Add one above.
    </div>
    <ul v-else class="meal-list">
      <li v-for="meal in mealsStore.meals" :key="meal.id" class="meal-item card">
        <div class="meal-info">
          <span class="meal-name">{{ meal.name }}</span>
          <span class="meal-detail muted">
            <template v-if="meal.calorie_type === 'flat'">
              {{ meal.reference_calories }} cal flat
            </template>
            <template v-else>
              {{ meal.reference_calories }} cal / {{ meal.reference_grams }}g
            </template>
          </span>
        </div>
        <div class="meal-actions">
          <button class="btn btn-secondary btn-sm" @click="openEdit(meal)">Edit</button>
          <button class="btn btn-danger btn-sm" @click="deleteMeal(meal.id, meal.name)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>
