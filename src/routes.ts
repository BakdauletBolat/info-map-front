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
    }
]


export default routes;