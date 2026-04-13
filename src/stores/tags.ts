import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tag } from '@/types'
import { api } from '@/lib/api'

export const useTagsStore = defineStore('tags', () => {
  const tags = ref<Tag[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTags() {
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/api/tags')
      if (!res.ok) throw new Error('Failed to load tags')
      tags.value = await res.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  async function createTag(name: string) {
    const res = await api.post('/api/tags', { name })
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error ?? 'Failed to create tag')
    }
    const tag: Tag = await res.json()
    tags.value.push(tag)
    tags.value.sort((a, b) => a.name.localeCompare(b.name))
    return tag
  }

  async function deleteTag(id: string) {
    const res = await api.delete(`/api/tags/${id}`)
    if (!res.ok) throw new Error('Failed to delete tag')
    tags.value = tags.value.filter(t => t.id !== id)
  }

  return { tags, loading, error, fetchTags, createTag, deleteTag }
})
