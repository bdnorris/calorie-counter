<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const registered = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(email.value, password.value)
      router.push('/')
    } else {
      await auth.register(email.value, password.value)
      registered.value = true
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'An error occurred'
  } finally {
    loading.value = false
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
  registered.value = false
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1>Calorie Counter</h1>

      <div v-if="registered" class="alert alert-success">
        Account created! Check your email to confirm, then sign in.
      </div>

      <form v-else @submit.prevent="submit">
        <h2>{{ mode === 'login' ? 'Sign in' : 'Create account' }}</h2>

        <div v-if="error" class="alert alert-error">{{ error }}</div>

        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="Password"
            minlength="6"
          />
        </div>

        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account' }}
        </button>
      </form>

      <p class="auth-toggle">
        {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
        <button class="btn-link" @click="toggleMode">
          {{ mode === 'login' ? 'Register' : 'Sign in' }}
        </button>
      </p>
    </div>
  </div>
</template>
