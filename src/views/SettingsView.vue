<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import { useTagsStore } from '@/stores/tags'

const router = useRouter()
const profileStore = useProfileStore()
const tagsStore = useTagsStore()

// ── Daily goal ────────────────────────────────────────────────
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

// ── Tags ──────────────────────────────────────────────────────
const newTagName = ref('')
const tagError = ref('')
const tagSaving = ref(false)

async function addTag() {
  tagError.value = ''
  const name = newTagName.value.trim()
  if (!name) { tagError.value = 'Tag name is required.'; return }
  tagSaving.value = true
  try {
    await tagsStore.createTag(name)
    newTagName.value = ''
  } catch (e) {
    tagError.value = e instanceof Error ? e.message : 'Failed to add tag'
  } finally {
    tagSaving.value = false
  }
}

async function deleteTag(id: string, name: string) {
  if (!confirm(`Delete tag "${name}"? It will be removed from all food items.`)) return
  try {
    await tagsStore.deleteTag(id)
  } catch {
    // silent
  }
}

onMounted(() => Promise.all([profileStore.fetchProfile(), tagsStore.fetchTags()]))
</script>

<template>
  <div class="page">
    <h1 class="page-title">Settings</h1>

    <!-- Daily goal -->
    <div class="card">
      <h2>Daily calorie goal</h2>
      <form @submit.prevent="saveGoal">
        <div class="field">
          <label for="goal-input">Calories per day</label>
          <input id="goal-input" v-model.number="goalInput" type="number" min="1" step="1" placeholder="e.g. 2000" />
        </div>
        <p v-if="goalError" class="form-error">{{ goalError }}</p>
        <p v-if="goalSaved" class="form-success">Saved!</p>
        <button type="submit" class="btn btn-primary" :disabled="goalSaving">
          {{ goalSaving ? 'Saving...' : 'Save goal' }}
        </button>
      </form>
    </div>

    <!-- Tags -->
    <div class="card">
      <h2>Tags</h2>
      <p class="muted" style="margin-bottom: 14px;">Tags help you organize and filter your food items.</p>

      <ul v-if="tagsStore.tags.length" class="tag-manage-list">
        <li v-for="tag in tagsStore.tags" :key="tag.id" class="tag-manage-item">
          <span class="tag-badge">{{ tag.name }}</span>
          <button class="btn-delete" @click="deleteTag(tag.id, tag.name)" title="Delete tag">✕</button>
        </li>
      </ul>
      <p v-else class="muted" style="margin-bottom: 12px;">No tags yet.</p>

      <form @submit.prevent="addTag" class="tag-add-form">
        <input
          v-model="newTagName"
          type="text"
          placeholder="New tag name"
          maxlength="40"
        />
        <button type="submit" class="btn btn-primary" :disabled="tagSaving">
          {{ tagSaving ? '...' : 'Add' }}
        </button>
      </form>
      <p v-if="tagError" class="form-error" style="margin-top: 8px;">{{ tagError }}</p>
    </div>

    <!-- History -->
    <div class="card">
      <h2>History</h2>
      <p class="muted" style="margin-bottom: 14px;">View your past days' calorie logs.</p>
      <button class="btn btn-secondary" @click="router.push('/history')">View history</button>
    </div>

  </div>
</template>
