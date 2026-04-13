import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginView from '@/views/LoginView.vue'
import TodayView from '@/views/TodayView.vue'
import MealsView from '@/views/MealsView.vue'
import HistoryView from '@/views/HistoryView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView, meta: { public: true } },
    { path: '/', component: TodayView },
    { path: '/meals', component: MealsView },
    { path: '/history', component: HistoryView },
    { path: '/settings', component: SettingsView },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  // Wait for initial auth check to complete
  if (auth.loading) {
    await new Promise<void>(resolve => {
      const stop = setInterval(() => {
        if (!auth.loading) { clearInterval(stop); resolve() }
      }, 50)
    })
  }
  if (!to.meta.public && !auth.session) return '/login'
  if (to.meta.public && auth.session) return '/'
})

export default router
