import './assets/styles/app.css'
import 'remixicon/fonts/remixicon.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes';
import { authStore } from './stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'activedLink',
  linkExactActiveClass: 'active',
})

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
 
const auth = authStore();

auth.checkSession().finally(() => {
  app.mount("#app");
});
