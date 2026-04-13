<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

async function logout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/">Calorie Counter</router-link>
    </div>
    <div class="navbar-links">
      <router-link to="/">Today</router-link>
      <router-link to="/meals">Meals</router-link>
      <router-link to="/history">History</router-link>
      <router-link to="/settings">Settings</router-link>
      <button class="btn-link" @click="logout">Sign out</button>
    </div>
  </nav>
</template>
