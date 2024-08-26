import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'


import routes from "./routes.ts";
import {createWebHistory, createRouter} from "vue-router";
import {isAuthenticated} from "@/domain/stores.ts";



const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, _) => {
    if (
        !isAuthenticated.value &&
        to.name !== 'login-view' && to.meta.loginRequired
    ) {
        // redirect the user to the login page
        return { name: 'login-view' }
    }
})

createApp(App).use(router)
    .mount('#app')