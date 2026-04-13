import { ref, reactive, onMounted } from 'vue';
import { useMealsStore } from '@/stores/meals';
const mealsStore = useMealsStore();
function emptyForm() {
    return { name: '', calorie_type: 'flat', reference_calories: null, reference_grams: null };
}
const showForm = ref(false);
const editingId = ref(null);
const form = reactive(emptyForm());
const formError = ref('');
const submitting = ref(false);
function openCreate() {
    editingId.value = null;
    Object.assign(form, emptyForm());
    formError.value = '';
    showForm.value = true;
}
function openEdit(meal) {
    editingId.value = meal.id;
    Object.assign(form, {
        name: meal.name,
        calorie_type: meal.calorie_type,
        reference_calories: meal.reference_calories,
        reference_grams: meal.reference_grams,
    });
    formError.value = '';
    showForm.value = true;
}
function cancelForm() {
    showForm.value = false;
    editingId.value = null;
}
async function submitForm() {
    formError.value = '';
    if (!form.name.trim()) {
        formError.value = 'Name is required.';
        return;
    }
    if (!form.reference_calories || form.reference_calories < 1) {
        formError.value = 'Calories must be a positive number.';
        return;
    }
    if (form.calorie_type === 'per_gram' && (!form.reference_grams || form.reference_grams <= 0)) {
        formError.value = 'Grams must be a positive number for per-gram meals.';
        return;
    }
    submitting.value = true;
    try {
        const payload = {
            name: form.name.trim(),
            calorie_type: form.calorie_type,
            reference_calories: form.reference_calories,
            reference_grams: form.calorie_type === 'per_gram' ? form.reference_grams : null,
        };
        if (editingId.value) {
            await mealsStore.updateMeal(editingId.value, payload);
        }
        else {
            await mealsStore.createMeal(payload);
        }
        showForm.value = false;
        editingId.value = null;
    }
    catch (e) {
        formError.value = e instanceof Error ? e.message : 'Failed to save meal';
    }
    finally {
        submitting.value = false;
    }
}
async function deleteMeal(id, name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`))
        return;
    try {
        await mealsStore.deleteMeal(id);
    }
    catch {
        // silent
    }
}
onMounted(() => mealsStore.fetchMeals());
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-header" },
});
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "page-title" },
});
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.openCreate) },
    ...{ class: "btn btn-primary" },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
if (__VLS_ctx.showForm) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card" },
    });
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
    (__VLS_ctx.editingId ? 'Edit meal' : 'New meal');
    __VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
        ...{ onSubmit: (__VLS_ctx.submitForm) },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        for: "meal-name",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        id: "meal-name",
        value: (__VLS_ctx.form.name),
        type: "text",
        required: true,
        placeholder: "e.g. Chicken breast",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "field" },
    });
    /** @type {__VLS_StyleScopedClasses['field']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "radio-group" },
    });
    /** @type {__VLS_StyleScopedClasses['radio-group']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "radio-label" },
    });
    /** @type {__VLS_StyleScopedClasses['radio-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "radio",
        value: "flat",
    });
    (__VLS_ctx.form.calorie_type);
    __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
        ...{ class: "radio-label" },
    });
    /** @type {__VLS_StyleScopedClasses['radio-label']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
        type: "radio",
        value: "per_gram",
    });
    (__VLS_ctx.form.calorie_type);
    if (__VLS_ctx.form.calorie_type === 'flat') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field" },
        });
        /** @type {__VLS_StyleScopedClasses['field']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
            for: "flat-cal",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            id: "flat-cal",
            type: "number",
            min: "1",
            step: "1",
            placeholder: "e.g. 350",
        });
        (__VLS_ctx.form.reference_calories);
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "hint" },
        });
        /** @type {__VLS_StyleScopedClasses['hint']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field-row" },
        });
        /** @type {__VLS_StyleScopedClasses['field-row']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field" },
        });
        /** @type {__VLS_StyleScopedClasses['field']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
            for: "pg-cal",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            id: "pg-cal",
            type: "number",
            min: "1",
            step: "any",
            placeholder: "e.g. 200",
        });
        (__VLS_ctx.form.reference_calories);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "field-row-sep" },
        });
        /** @type {__VLS_StyleScopedClasses['field-row-sep']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "field" },
        });
        /** @type {__VLS_StyleScopedClasses['field']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
            for: "pg-grams",
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.input)({
            id: "pg-grams",
            type: "number",
            min: "0.1",
            step: "any",
            placeholder: "e.g. 123",
        });
        (__VLS_ctx.form.reference_grams);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "field-row-sep" },
        });
        /** @type {__VLS_StyleScopedClasses['field-row-sep']} */ ;
    }
    if (__VLS_ctx.formError) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            ...{ class: "form-error" },
        });
        /** @type {__VLS_StyleScopedClasses['form-error']} */ ;
        (__VLS_ctx.formError);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "btn-row" },
    });
    /** @type {__VLS_StyleScopedClasses['btn-row']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (__VLS_ctx.cancelForm) },
        type: "button",
        ...{ class: "btn btn-secondary" },
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        type: "submit",
        ...{ class: "btn btn-primary" },
        disabled: (__VLS_ctx.submitting),
    });
    /** @type {__VLS_StyleScopedClasses['btn']} */ ;
    /** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
    (__VLS_ctx.submitting ? 'Saving...' : 'Save');
}
if (__VLS_ctx.mealsStore.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "muted" },
    });
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
}
else if (__VLS_ctx.mealsStore.meals.length === 0 && !__VLS_ctx.showForm) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card muted" },
    });
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "meal-list" },
    });
    /** @type {__VLS_StyleScopedClasses['meal-list']} */ ;
    for (const [meal] of __VLS_vFor((__VLS_ctx.mealsStore.meals))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (meal.id),
            ...{ class: "meal-item card" },
        });
        /** @type {__VLS_StyleScopedClasses['meal-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "meal-info" },
        });
        /** @type {__VLS_StyleScopedClasses['meal-info']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "meal-name" },
        });
        /** @type {__VLS_StyleScopedClasses['meal-name']} */ ;
        (meal.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "meal-detail muted" },
        });
        /** @type {__VLS_StyleScopedClasses['meal-detail']} */ ;
        /** @type {__VLS_StyleScopedClasses['muted']} */ ;
        if (meal.calorie_type === 'flat') {
            (meal.reference_calories);
        }
        else {
            (meal.reference_calories);
            (meal.reference_grams);
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "meal-actions" },
        });
        /** @type {__VLS_StyleScopedClasses['meal-actions']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.mealsStore.loading))
                        return;
                    if (!!(__VLS_ctx.mealsStore.meals.length === 0 && !__VLS_ctx.showForm))
                        return;
                    __VLS_ctx.openEdit(meal);
                    // @ts-ignore
                    [openCreate, showForm, showForm, editingId, submitForm, form, form, form, form, form, form, form, formError, formError, cancelForm, submitting, submitting, mealsStore, mealsStore, mealsStore, openEdit,];
                } },
            ...{ class: "btn btn-secondary btn-sm" },
        });
        /** @type {__VLS_StyleScopedClasses['btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.mealsStore.loading))
                        return;
                    if (!!(__VLS_ctx.mealsStore.meals.length === 0 && !__VLS_ctx.showForm))
                        return;
                    __VLS_ctx.deleteMeal(meal.id, meal.name);
                    // @ts-ignore
                    [deleteMeal,];
                } },
            ...{ class: "btn btn-danger btn-sm" },
        });
        /** @type {__VLS_StyleScopedClasses['btn']} */ ;
        /** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['btn-sm']} */ ;
        // @ts-ignore
        [];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
