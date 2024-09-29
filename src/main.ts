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

    if (to.name == "main-view") {
        return {name: "info-map-view", params: {slug: "baidybek_d"}}
    }

    if (
        !isAuthenticated.value &&
        to.name !== 'login-view' && to.meta.loginRequired
    ) {
        
        return { name: 'login-view', query: { redirectRouteName: to.name?.toString(), redirectRouteParams: JSON.stringify(to.params ?? {}) } }
    }
})

createApp(App).use(router)
    .mount('#app')