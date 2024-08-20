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



const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router)
    .use( Vue3Toasity,
        {
            position: "top-right",
            autoClose: 3000,
        } as ToastContainerOptions)
    .mount('#app')