<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useMealsStore } from '@/stores/meals'
import { useTagsStore } from '@/stores/tags'
import type { Meal } from '@/types'
import type { AddEntryInput } from '@/stores/log'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  add: [AddEntryInput]
}>()

const mealsStore = useMealsStore()
const tagsStore = useTagsStore()

const activeTagId = ref<string | null>(null)
const selectedMeal = ref<Meal | null>(null)
const grams = ref<number | null>(null)
const adding = ref(false)

const filteredMeals = computed(() => {
  if (!activeTagId.value) return mealsStore.meals
  return mealsStore.meals.filter(m => m.tags.some(t => t.id === activeTagId.value))
})

const calculatedCalories = computed<number | null>(() => {
  const meal = selectedMeal.value
  if (!meal || meal.calorie_type !== 'per_gram' || !grams.value) return null
  return Math.round((meal.reference_calories / meal.reference_grams!) * grams.value)
})

function close() {
  emit('update:modelValue', false)
}

function selectMeal(meal: Meal) {
  selectedMeal.value = meal
  grams.value = null
}

function clearSelection() {
  selectedMeal.value = null
  grams.value = null
}

async function addEntry() {
  const meal = selectedMeal.value!
  adding.value = true
  try {
    if (meal.calorie_type === 'per_gram') {
      emit('add', {
        meal_id: meal.id,
        meal_name: meal.name,
        calorie_type: 'per_gram',
        grams: grams.value!,
        calories: calculatedCalories.value!,
      })
    } else {
      emit('add', {
        meal_id: meal.id,
        meal_name: meal.name,
        calorie_type: 'flat',
        calories: meal.reference_calories,
      })
    }
    clearSelection()
    close()
  } finally {
    adding.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

document.addEventListener('keydown', onKeydown)
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

watch(() => props.modelValue, (open) => {
  if (open) {
    clearSelection()
    activeTagId.value = null
    if (!mealsStore.meals.length) mealsStore.fetchMeals()
    if (!tagsStore.tags.length) tagsStore.fetchTags()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="backdrop-fade">
      <div v-if="modelValue" class="offcanvas-backdrop" @click="close"></div>
    </Transition>

    <Transition name="offcanvas-slide">
      <div v-if="modelValue" class="offcanvas" role="dialog" aria-modal="true" aria-label="Pick food">

        <!-- Header -->
        <div class="offcanvas-header">
          <h2>Pick food</h2>
          <button class="btn-close" @click="close" aria-label="Close">✕</button>
        </div>

        <!-- Tag filter -->
        <div v-if="tagsStore.tags.length" class="offcanvas-filter">
          <button
            :class="['tag-pill', !activeTagId && 'active']"
            @click="activeTagId = null"
          >All</button>
          <button
            v-for="tag in tagsStore.tags"
            :key="tag.id"
            :class="['tag-pill', activeTagId === tag.id && 'active']"
            @click="activeTagId = activeTagId === tag.id ? null : tag.id"
          >{{ tag.name }}</button>
        </div>

        <!-- Food list -->
        <div class="offcanvas-body">
          <div v-if="mealsStore.loading" class="muted picker-empty">Loading...</div>
          <div v-else-if="mealsStore.meals.length === 0" class="muted picker-empty">
            No food items yet. Add some in the Food section.
          </div>
          <div v-else-if="filteredMeals.length === 0" class="muted picker-empty">
            No items match this tag.
          </div>
          <ul v-else class="picker-list">
            <li
              v-for="meal in filteredMeals"
              :key="meal.id"
              :class="['picker-item', selectedMeal?.id === meal.id && 'picker-item--selected']"
              @click="selectMeal(meal)"
            >
              <div class="picker-item-name">{{ meal.name }}</div>
              <div class="picker-item-detail muted">
                {{ meal.calorie_type === 'flat'
                  ? meal.reference_calories + ' cal'
                  : meal.reference_calories + ' cal / ' + meal.reference_grams + 'g' }}
              </div>
              <div v-if="meal.tags.length" class="tag-badges">
                <span v-for="tag in meal.tags" :key="tag.id" class="tag-badge">{{ tag.name }}</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Selected item footer -->
        <div v-if="selectedMeal" class="offcanvas-footer">
          <div class="picker-footer-name">{{ selectedMeal.name }}</div>

          <template v-if="selectedMeal.calorie_type === 'per_gram'">
            <p class="hint">
              Reference: {{ selectedMeal.reference_grams }}g = {{ selectedMeal.reference_calories }} cal
            </p>
            <div class="picker-grams-row">
              <input
                v-model.number="grams"
                type="number"
                min="0.1"
                step="any"
                placeholder="Grams eaten"
                class="picker-grams-input"
              />
              <span v-if="calculatedCalories !== null" class="cal-preview">
                = {{ calculatedCalories }} cal
              </span>
            </div>
          </template>
          <template v-else>
            <p class="hint">{{ selectedMeal.reference_calories }} calories</p>
          </template>

          <div class="btn-row" style="margin-top: 14px;">
            <button class="btn btn-secondary" @click="clearSelection">Back</button>
            <button
              class="btn btn-primary"
              :disabled="adding || (selectedMeal.calorie_type === 'per_gram' && (!grams || grams <= 0))"
              @click="addEntry"
            >
              {{ adding ? 'Adding...' : 'Add to log' }}
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>
