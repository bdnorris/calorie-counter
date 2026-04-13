import { onMounted } from 'vue';
import { useLogStore } from '@/stores/log';
import { useProfileStore } from '@/stores/profile';
const logStore = useLogStore();
const profileStore = useProfileStore();
function formatDate(dateStr) {
    const parts = dateStr.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
}
function statusClass(total, goal) {
    const ratio = total / goal;
    if (ratio > 1)
        return 'over';
    if (ratio > 0.9)
        return 'low';
    return 'good';
}
function statusLabel(total, goal) {
    const diff = goal - total;
    if (diff < 0)
        return `${Math.abs(diff).toLocaleString()} over`;
    return `${diff.toLocaleString()} under`;
}
onMounted(async () => {
    await Promise.all([logStore.fetchHistory(), profileStore.fetchProfile()]);
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
if (__VLS_ctx.logStore.historyLoading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "muted" },
    });
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
}
else if (__VLS_ctx.logStore.history.length === 0) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card muted" },
    });
    /** @type {__VLS_StyleScopedClasses['card']} */ ;
    /** @type {__VLS_StyleScopedClasses['muted']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.ul, __VLS_intrinsics.ul)({
        ...{ class: "history-list" },
    });
    /** @type {__VLS_StyleScopedClasses['history-list']} */ ;
    for (const [day] of __VLS_vFor((__VLS_ctx.logStore.history))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.li, __VLS_intrinsics.li)({
            key: (day.log_date),
            ...{ class: "history-item card" },
        });
        /** @type {__VLS_StyleScopedClasses['history-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['card']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "history-date" },
        });
        /** @type {__VLS_StyleScopedClasses['history-date']} */ ;
        (__VLS_ctx.formatDate(day.log_date));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "history-stats" },
        });
        /** @type {__VLS_StyleScopedClasses['history-stats']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "history-calories" },
        });
        /** @type {__VLS_StyleScopedClasses['history-calories']} */ ;
        (day.total_calories.toLocaleString());
        if (__VLS_ctx.profileStore.profile) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "history-status" },
                ...{ class: (__VLS_ctx.statusClass(day.total_calories, __VLS_ctx.profileStore.profile.daily_calorie_goal)) },
            });
            /** @type {__VLS_StyleScopedClasses['history-status']} */ ;
            (__VLS_ctx.statusLabel(day.total_calories, __VLS_ctx.profileStore.profile.daily_calorie_goal));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "muted history-entries" },
        });
        /** @type {__VLS_StyleScopedClasses['muted']} */ ;
        /** @type {__VLS_StyleScopedClasses['history-entries']} */ ;
        (day.entry_count);
        // @ts-ignore
        [logStore, logStore, logStore, formatDate, profileStore, profileStore, profileStore, statusClass, statusLabel,];
    }
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
