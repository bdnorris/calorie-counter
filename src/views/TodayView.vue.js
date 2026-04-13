import { ref, computed, onMounted } from 'vue';
import { useLogStore } from '@/stores/log';
import { useMealsStore } from '@/stores/meals';
import { useProfileStore } from '@/stores/profile';
import CalorieProgress from '@/components/CalorieProgress.vue';
const logStore = useLogStore();
const mealsStore = useMealsStore();
const profileStore = useProfileStore();
// Add entry form state
const selectedMealId = ref('');
const grams = ref(null);
const customName = ref('');
const customCalories = ref(null);
const formError = ref('');
const submitting = ref(false);
const selectedMeal = computed(() => {
    if (!selectedMealId.value || selectedMealId.value === 'custom')
        return null;
    return mealsStore.meals.find(m => m.id === selectedMealId.value) ?? null;
});
const calculatedCalories = computed(() => {
    const meal = selectedMeal.value;
    if (!meal || meal.calorie_type !== 'per_gram' || !grams.value)
        return null;
    return Math.round((meal.reference_calories / meal.reference_grams) * grams.value);
});
function resetForm() {
    selectedMealId.value = '';
    grams.value = null;
    customName.value = '';
    customCalories.value = null;
    formError.value = '';
}
async function addEntry() {
    formError.value = '';
    if (!selectedMealId.value) {
        formError.value = 'Please select a meal or choose Custom.';
        return;
    }
    try {
        submitting.value = true;
        if (selectedMealId.value === 'custom') {
            if (!customCalories.value || customCalories.value < 1) {
                formError.value = 'Please enter a calorie amount.';
                return;
            }
            await logStore.addEntry({
                meal_name: customName.value.trim() || 'Custom',
                calorie_type: 'arbitrary',
                calories: customCalories.value,
            });
        }
        else {
            const meal = selectedMeal.value;
            if (meal.calorie_type === 'per_gram') {
                if (!grams.value || grams.value <= 0) {
                    formError.value = 'Please enter grams.';
                    return;
                }
                await logStore.addEntry({
                    meal_id: meal.id,
                    meal_name: meal.name,
                    calorie_type: 'per_gram',
                    grams: grams.value,
                    calories: calculatedCalories.value,
                });
            }
            else {
                await logStore.addEntry({
                    meal_id: meal.id,
                    meal_name: meal.name,
                    calorie_type: 'flat',
                    calories: meal.reference_calories,
                });
            }
        }
        resetForm();
    }
    catch (e) {
        formError.value = e instanceof Error ? e.message : 'Failed to add entry';
    }
    finally {
        submitting.value = false;
    }
}
async function deleteEntry(id) {
    try {
        await logStore.deleteEntry(id);
    }
    catch {
        // silent
    }
}
function formatDate(dateStr) {
    // dateStr is YYYY-MM-DD local
    const parts = dateStr.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(undefined, {
        weekday: 'long', month: 'long', day: 'numeric',
    });
}
const today = (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
})();
onMounted(async () => {
    await Promise.all([
        logStore.fetchTodayEntries(),
        mealsStore.fetchMeals(),
        profileStore.fetchProfile(),
    ]);
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page" },
});
/** @type {__VLS_StyleScopedClasses['page']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "page-title" },
});
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
(__VLS_ctx.formatDate(__VLS_ctx.today));
if (__VLS_ctx.profileStore.profile) {
    const __VLS_0 = CalorieProgress;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        consumed: (__VLS_ctx.logStore.totalCalories),
        goal: (__VLS_ctx.profileStore.profile.daily_calorie_goal),
    }));
    const __VLS_2 = __VLS_1({
        consumed: (__VLS_ctx.logStore.totalCalories),
        goal: (__VLS_ctx.profileStore.profile.daily_calorie_goal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.addEntry) },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "meal-select",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    ...{ onChange: (...[$event]) => {
            __VLS_ctx.grams = null;
            // @ts-ignore
            [formatDate, today, profileStore, profileStore, logStore, addEntry, grams,];
        } },
    id: "meal-select",
    value: (__VLS_ctx.selectedMealId),
});
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "",
});
if (__VLS_ctx.mealsStore.meals.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.optgroup, __VLS_intrinsics.optgroup)({
        label: "Your meals",
    });
    for (const [meal] of __VLS_vFor((__VLS_ctx.mealsStore.meals))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
            key: (meal.id),
            value: (meal.id),
        });
        (meal.name);
        (meal.calorie_type === 'flat'
            ? meal.reference_calories + ' cal flat'
            : meal.reference_calories + ' cal / ' + meal.reference_grams + 'g');
        // @ts-ignore
        [selectedMealId, mealsStore, mealsStore,];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
    value: "custom",
});
if (__VLS_ctx.selectedMeal?.calorie_type === 'per_gram') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "hint" },
    });
    /** @type {__VLS_StyleScopedClasses['hint']} */ ;
    (__VLS_ctx.selectedMeal.reference_grams);
    (__VLS_ctx.selectedMeal.reference_calories);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "grams-input",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "grams-input",
        type: "number",
        min: "0.1",
        step: "any",
        placeholder: "e.g. 150",
    });
    (__VLS_ctx.grams);
    if (__VLS_ctx.calculatedCalories !== null) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "cal-preview" },
        });
        /** @type {__VLS_StyleScopedClasses['cal-preview']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
        (__VLS_ctx.calculatedCalories);
    }
}
if (__VLS_ctx.selectedMeal?.calorie_type === 'flat') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "hint" },
    });
    /** @type {__VLS_StyleScopedClasses['hint']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.strong, __VLS_intrinsics.strong)({});
    (__VLS_ctx.selectedMeal.reference_calories);
}
if (__VLS_ctx.selectedMealId === 'custom') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "custom-name",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "custom-name",
        value: (__VLS_ctx.customName),
        type: "text",
        placeholder: "e.g. Coffee, Snack...",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "custom-cal",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "custom-cal",
        type: "number",
        min: "1",
        step: "1",
        placeholder: "e.g. 250",
        required: true,
    });
    (__VLS_ctx.customCalories);
}
if (__VLS_ctx.formError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "form-error" },
    });
    /** @type {__VLS_StyleScopedClasses['form-error']} */ ;
    (__VLS_ctx.formError);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    ...{ class: "btn btn-primary" },
    disabled: (__VLS_ctx.submitting || !__VLS_ctx.selectedMealId),
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
(__VLS_ctx.submitting ? 'Adding...' : 'Add');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
if (__VLS_ctx.logStore.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "muted" },
    });
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
}
else if (__VLS_ctx.logStore.entries.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "muted" },
    });
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "entry-list" },
    });
    /** @type {__VLS_StyleScopedClasses['entry-list']} */ ;
    for (const [entry] of __VLS_vFor((__VLS_ctx.logStore.entries))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (entry.id),
            ...{ class: "entry-item" },
        });
        /** @type {__VLS_StyleScopedClasses['entry-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "entry-info" },
        });
        /** @type {__VLS_StyleScopedClasses['entry-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "entry-name" },
        });
        /** @type {__VLS_StyleScopedClasses['entry-name']} */ ;
        (entry.meal_name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "entry-detail muted" },
        });
        /** @type {__VLS_StyleScopedClasses['entry-detail']} */ ;
        /** @type {__VLS_StyleScopedClasses['muted']} */ ;
        if (entry.calorie_type === 'per_gram') {
            (entry.grams);
        }
        (entry.calories);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.logStore.loading))
                        return;
                    if (!!(__VLS_ctx.logStore.entries.length === 0))
                        return;
                    __VLS_ctx.deleteEntry(entry.id);
                    // @ts-ignore
                    [logStore, logStore, logStore, grams, selectedMealId, selectedMealId, selectedMeal, selectedMeal, selectedMeal, selectedMeal, selectedMeal, calculatedCalories, calculatedCalories, customName, customCalories, formError, formError, submitting, submitting, deleteEntry,];
                } },
            ...{ class: "btn-delete" },
            title: "Remove",
        });
        /** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
