import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '@/lib/api';
export const useProfileStore = defineStore('profile', () => {
    const profile = ref(null);
    const loading = ref(false);
    const error = ref(null);
    async function fetchProfile() {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get('/api/profile');
            if (!res.ok)
                throw new Error('Failed to load profile');
            profile.value = await res.json();
        }
        catch (e) {
            error.value = e instanceof Error ? e.message : 'Unknown error';
        }
        finally {
            loading.value = false;
        }
    }
    async function updateGoal(daily_calorie_goal) {
        const res = await api.put('/api/profile', { daily_calorie_goal });
        if (!res.ok)
            throw new Error('Failed to update goal');
        profile.value = await res.json();
    }
    return { profile, loading, error, fetchProfile, updateGoal };
});
