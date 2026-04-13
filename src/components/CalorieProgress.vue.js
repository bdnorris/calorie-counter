import { computed } from 'vue';
const props = defineProps();
const remaining = computed(() => props.goal - props.consumed);
const percent = computed(() => Math.min((props.consumed / props.goal) * 100, 100));
const barColor = computed(() => {
    const p = (props.consumed / props.goal) * 100;
    if (p >= 100)
        return 'var(--color-danger)';
    if (p >= 80)
        return 'var(--color-warning)';
    return 'var(--color-primary)';
});
const remainingClass = computed(() => {
    if (remaining.value < 0)
        return 'over';
    if (remaining.value < props.goal * 0.2)
        return 'low';
    return '';
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-card" },
});
/** @type {__VLS_StyleScopedClasses['progress-card']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-stats" },
});
/** @type {__VLS_StyleScopedClasses['progress-stats']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat" },
});
/** @type {__VLS_StyleScopedClasses['stat']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.goal.toLocaleString());
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat" },
});
/** @type {__VLS_StyleScopedClasses['stat']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-value" },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.consumed.toLocaleString());
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "stat" },
});
/** @type {__VLS_StyleScopedClasses['stat']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-label" },
});
/** @type {__VLS_StyleScopedClasses['stat-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "stat-value" },
    ...{ class: (__VLS_ctx.remainingClass) },
});
/** @type {__VLS_StyleScopedClasses['stat-value']} */ ;
(__VLS_ctx.remaining < 0 ? '+' + Math.abs(__VLS_ctx.remaining).toLocaleString() + ' over' : __VLS_ctx.remaining.toLocaleString());
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-bar-track" },
});
/** @type {__VLS_StyleScopedClasses['progress-bar-track']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "progress-bar-fill" },
    ...{ style: ({ width: __VLS_ctx.percent + '%', background: __VLS_ctx.barColor }) },
});
/** @type {__VLS_StyleScopedClasses['progress-bar-fill']} */ ;
// @ts-ignore
[goal, consumed, remainingClass, remaining, remaining, remaining, percent, barColor,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
