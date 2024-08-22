import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet';
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import routes from "./routes.ts";
import {createWebHistory, createRouter} from "vue-router";
import {isAuthenticated} from "@/domain/stores.ts";



const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach(async (to, _) => {
    if (
        !isAuthenticated &&
        to.name !== 'login-view' && to.meta.loginRequired
    ) {
        // redirect the user to the login page
        return { name: 'login-view' }
    }
})

createApp(App).use(router)
    .use( Vue3Toasity,
        {
            position: "top-right",
            autoClose: 3000,
        } as ToastContainerOptions)
    .mount('#app')