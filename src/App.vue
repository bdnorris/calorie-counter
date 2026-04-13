<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NavBar from '@/components/NavBar.vue'

const auth = useAuthStore()
const route = useRoute()

onMounted(() => auth.initialize())
</script>

<template>
  <div id="app">
    <NavBar v-if="!route.meta.public && auth.session" />
    <main :class="{ 'with-nav': !route.meta.public && auth.session }">
      <router-view />
    </main>
  </div>
</template>
