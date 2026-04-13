<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Fuse from 'fuse.js'
import { useMealsStore } from '@/stores/meals'
import { useTagsStore } from '@/stores/tags'
import type { Meal } from '@/types'

const mealsStore = useMealsStore()
const tagsStore = useTagsStore()

// ── Filter + search ──────────────────────────────────────────
const activeTagId = ref<string | null>(null)
const query = ref('')

const tagFiltered = computed(() => {
  if (!activeTagId.value) return mealsStore.meals
  return mealsStore.meals.filter(m => m.tags.some(t => t.id === activeTagId.value))
})

const fuse = computed(() => new Fuse(tagFiltered.value, {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'tags.name', weight: 1 },
  ],
  threshold: 0.35,
  minMatchCharLength: 1,
}))

const visibleMeals = computed(() => {
  const q = query.value.trim()
  if (!q) return tagFiltered.value
  return fuse.value.search(q).map(r => r.item)
})

const emptyMessage = computed(() => {
  if (mealsStore.loading) return null
  if (mealsStore.meals.length === 0) return 'No items yet. Add one above.'
  if (visibleMeals.value.length === 0) {
    return query.value.trim() ? `No results for "${query.value.trim()}".` : 'No items match this tag.'
  }
  return null
})

// ── Meal form ─────────────────────────────────────────────────
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
const selectedTagIds = ref<string[]>([])
const formError = ref('')
const submitting = ref(false)

function openCreate() {
  editingId.value = null
  Object.assign(form, emptyForm())
  selectedTagIds.value = []
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
  selectedTagIds.value = meal.tags.map(t => t.id)
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
      reference_calories: form.reference_calories!,
      reference_grams: form.calorie_type === 'per_gram' ? form.reference_grams : null,
      tag_ids: selectedTagIds.value,
    }
    if (editingId.value) {
      await mealsStore.updateMeal(editingId.value, payload)
    } else {
      await mealsStore.createMeal(payload)
    }
    showForm.value = false
    editingId.value = null
  } catch (e) {
    formError.value = e instanceof Error ? e.message : 'Failed to save'
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

onMounted(() => Promise.all([mealsStore.fetchMeals(), tagsStore.fetchTags()]))
</script>

<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Food</h1>
      <button class="btn btn-primary" @click="openCreate">+ Add item</button>
    </div>

    <!-- Search -->
    <div class="search-wrap">
      <input
        v-model="query"
        type="search"
        class="search-input"
        placeholder="Search food..."
        autocomplete="off"
      />
    </div>

    <!-- Tag filter pills -->
    <div v-if="tagsStore.tags.length" class="tag-filter">
      <button
        :class="['tag-pill', activeTagId === null && 'active']"
        @click="activeTagId = null"
      >All</button>
      <button
        v-for="tag in tagsStore.tags"
        :key="tag.id"
        :class="['tag-pill', activeTagId === tag.id && 'active']"
        @click="activeTagId = activeTagId === tag.id ? null : tag.id"
      >{{ tag.name }}</button>
    </div>

    <!-- Food item form -->
    <div v-if="showForm" class="card">
      <h2>{{ editingId ? 'Edit item' : 'New item' }}</h2>
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
            <input id="flat-cal" v-model.number="form.reference_calories" type="number" min="1" step="1" placeholder="e.g. 350" />
          </div>
        </template>

        <template v-else>
          <p class="hint">Enter a reference serving size, e.g. 200 cal for 123g.</p>
          <div class="field-row">
            <div class="field">
              <label for="pg-cal">Calories</label>
              <input id="pg-cal" v-model.number="form.reference_calories" type="number" min="1" step="any" placeholder="e.g. 200" />
            </div>
            <span class="field-row-sep">for</span>
            <div class="field">
              <label for="pg-grams">Grams</label>
              <input id="pg-grams" v-model.number="form.reference_grams" type="number" min="0.1" step="any" placeholder="e.g. 123" />
            </div>
            <span class="field-row-sep">g</span>
          </div>
        </template>

        <!-- Tags -->
        <div v-if="tagsStore.tags.length" class="field">
          <label>Tags</label>
          <div class="checkbox-group">
            <label v-for="tag in tagsStore.tags" :key="tag.id" class="checkbox-label">
              <input type="checkbox" :value="tag.id" v-model="selectedTagIds" />
              {{ tag.name }}
            </label>
          </div>
        </div>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <div class="btn-row">
          <button type="button" class="btn btn-secondary" @click="cancelForm">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Food list -->
    <div v-if="mealsStore.loading" class="muted">Loading...</div>
    <div v-else-if="emptyMessage && !showForm" class="card muted">{{ emptyMessage }}</div>
    <ul v-else class="meal-list">
      <li v-for="meal in visibleMeals" :key="meal.id" class="meal-item card">
        <div class="meal-info">
          <span class="meal-name">{{ meal.name }}</span>
          <span class="meal-detail muted">
            <template v-if="meal.calorie_type === 'flat'">{{ meal.reference_calories }} cal flat</template>
            <template v-else>{{ meal.reference_calories }} cal / {{ meal.reference_grams }}g</template>
          </span>
          <div v-if="meal.tags.length" class="tag-badges">
            <span v-for="tag in meal.tags" :key="tag.id" class="tag-badge">{{ tag.name }}</span>
          </div>
        </div>
        <div class="meal-actions">
          <button class="btn btn-secondary btn-sm" @click="openEdit(meal)">Edit</button>
          <button class="btn btn-danger btn-sm" @click="deleteMeal(meal.id, meal.name)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>
