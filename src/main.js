import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap/dist/js/bootstrap.bundle.min.js' 
import './assets/styles/app.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

const app = createApp(App)
app.use(router)

app.mount("#app")
