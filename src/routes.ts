import MainView from "@/views/main-view.vue";

const routes = [
    {
        path: '',
        name: 'main-view',
        component: MainView
    },
    {
        path: '/login',
        name: 'login-view',
        component: () => import('@/views/login-view.vue')
    },
    {
        path: '/info/:slug',
        name: 'info-map-view',
        component: () => import('@/views/info-map-view.vue')
    },
    {
        path: '/editor/:slug',
        name: 'editor-map-view',
        component: () => import('@/views/editor-map-view.vue'),
        meta: {
            loginRequired: true
        }
    },
    {
        path: '/create-info',
        name: 'create-info-view',
        component: () => import('@/views/create-info-view.vue'),
        meta: {
            loginRequired: true
        }
    }
]




export default routes;