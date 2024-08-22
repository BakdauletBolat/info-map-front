import MainView from "@/views/main-view.vue";

const routes = [
    {
        path: '',
        name: 'main-view',
        component: MainView
    },
    {
        path: '/info/:slug',
        name: 'info-map-view',
        component: () => import('@/views/info-map-view.vue')
    },
    {
        path: '/editor/:slug',
        name: 'editor-map-view',
        component: () => import('@/views/editor-map-view.vue')
    },
    {
        path: '/editor/info/create-welcome',
        name: 'editor-info-create-welcome',
        component: () => import('@/views/editor-info-create-welcome.vue')
    },
    {
        path: '/editor/info/create-form/:regionId/:categoryId',
        name: 'editor-info-create-form',
        component: () => import('@/views/editor-info-create-form.vue')
    }
]


export default routes;