import { ref, watch, onMounted } from 'vue';
import { useProfileStore } from '@/stores/profile';
import { useLogStore } from '@/stores/log';
import { useTagsStore } from '@/stores/tags';
const profileStore = useProfileStore();
const logStore = useLogStore();
const tagsStore = useTagsStore();
// ── Daily goal ────────────────────────────────────────────────
const goalInput = ref(null);
const goalError = ref('');
const goalSaving = ref(false);
const goalSaved = ref(false);
watch(() => profileStore.profile, (p) => {
    if (p)
        goalInput.value = p.daily_calorie_goal;
}, { immediate: true });
async function saveGoal() {
    goalError.value = '';
    goalSaved.value = false;
    if (!goalInput.value || goalInput.value < 1) {
        goalError.value = 'Please enter a positive number.';
        return;
    }
    goalSaving.value = true;
    try {
        await profileStore.updateGoal(goalInput.value);
        goalSaved.value = true;
        setTimeout(() => { goalSaved.value = false; }, 2500);
    }
    catch (e) {
        goalError.value = e instanceof Error ? e.message : 'Failed to save';
    }
    finally {
        goalSaving.value = false;
    }
}
// ── Tags ──────────────────────────────────────────────────────
const newTagName = ref('');
const tagError = ref('');
const tagSaving = ref(false);
async function addTag() {
    tagError.value = '';
    const name = newTagName.value.trim();
    if (!name) {
        tagError.value = 'Tag name is required.';
        return;
    }
    tagSaving.value = true;
    try {
        await tagsStore.createTag(name);
        newTagName.value = '';
    }
    catch (e) {
        tagError.value = e instanceof Error ? e.message : 'Failed to add tag';
    }
    finally {
        tagSaving.value = false;
    }
}
async function deleteTag(id, name) {
    if (!confirm(`Delete tag "${name}"? It will be removed from all food items.`))
        return;
    try {
        await tagsStore.deleteTag(id);
    }
    catch {
        // silent
    }
}
// ── History ───────────────────────────────────────────────────
async function clearHistory() {
    if (!confirm("Clear all history? This deletes all past log entries and cannot be undone. Today's log will be kept."))
        return;
    try {
        await logStore.clearHistory();
        alert('History cleared.');
    }
    catch (e) {
        alert(e instanceof Error ? e.message : 'Failed to clear history');
    }
}
onMounted(() => Promise.all([profileStore.fetchProfile(), tagsStore.fetchTags()]));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.saveGoal) },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "field" },
});
/** @type {__VLS_StyleScopedClasses['field']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "goal-input",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    id: "goal-input",
    type: "number",
    min: "1",
    step: "1",
    placeholder: "e.g. 2000",
});
(__VLS_ctx.goalInput);
if (__VLS_ctx.goalError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "form-error" },
    });
    /** @type {__VLS_StyleScopedClasses['form-error']} */ ;
    (__VLS_ctx.goalError);
}
if (__VLS_ctx.goalSaved) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "form-success" },
    });
    /** @type {__VLS_StyleScopedClasses['form-success']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    ...{ class: "btn btn-primary" },
    disabled: (__VLS_ctx.goalSaving),
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
(__VLS_ctx.goalSaving ? 'Saving...' : 'Save goal');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "muted" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
if (__VLS_ctx.tagsStore.tags.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "tag-manage-list" },
    });
    /** @type {__VLS_StyleScopedClasses['tag-manage-list']} */ ;
    for (const [tag] of __VLS_vFor((__VLS_ctx.tagsStore.tags))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (tag.id),
            ...{ class: "tag-manage-item" },
        });
        /** @type {__VLS_StyleScopedClasses['tag-manage-item']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "tag-badge" },
        });
        /** @type {__VLS_StyleScopedClasses['tag-badge']} */ ;
        (tag.name);
        __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.tagsStore.tags.length))
                        return;
                    __VLS_ctx.deleteTag(tag.id, tag.name);
                    // @ts-ignore
                    [saveGoal, goalInput, goalError, goalError, goalSaved, goalSaving, goalSaving, tagsStore, tagsStore, deleteTag,];
                } },
            ...{ class: "btn-delete" },
            title: "Delete tag",
        });
        /** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
        // @ts-ignore
        [];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "muted" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.form, __VLS_intrinsics.form)({
    ...{ onSubmit: (__VLS_ctx.addTag) },
    ...{ class: "tag-add-form" },
});
/** @type {__VLS_StyleScopedClasses['tag-add-form']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.input)({
    value: (__VLS_ctx.newTagName),
    type: "text",
    placeholder: "New tag name",
    maxlength: "40",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    type: "submit",
    ...{ class: "btn btn-primary" },
    disabled: (__VLS_ctx.tagSaving),
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
(__VLS_ctx.tagSaving ? '...' : 'Add');
if (__VLS_ctx.tagError) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "form-error" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['form-error']} */ ;
    (__VLS_ctx.tagError);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card danger-zone" },
});
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['danger-zone']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "muted" },
});
/** @type {__VLS_StyleScopedClasses['muted']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.clearHistory) },
    ...{ class: "btn btn-danger" },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-danger']} */ ;
// @ts-ignore
[addTag, newTagName, tagSaving, tagSaving, tagError, tagError, clearHistory,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
