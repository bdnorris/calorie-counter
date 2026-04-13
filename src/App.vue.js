import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import NavBar from '@/components/NavBar.vue';
const auth = useAuthStore();
const route = useRoute();
onMounted(() => auth.initialize());
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "app",
});
if (!__VLS_ctx.route.meta.public && __VLS_ctx.auth.session) {
    const __VLS_0 = NavBar;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
__VLS_asFunctionalElement1(__VLS_intrinsics.main, __VLS_intrinsics.main)({
    ...{ class: ({ 'with-nav': !__VLS_ctx.route.meta.public && __VLS_ctx.auth.session }) },
});
/** @type {__VLS_StyleScopedClasses['with-nav']} */ ;
let __VLS_5;
/** @ts-ignore @type {typeof __VLS_components.routerView | typeof __VLS_components.RouterView} */
routerView;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({}));
const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
// @ts-ignore
[route, route, auth, auth,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
