import './assets/styles/app.css'
import 'remixicon/fonts/remixicon.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes';
import { authStore } from './stores/auth' 
import { panierStore } from './stores/panier'

const router = createRouter({
  history: createWebHistory(),
  routes, 
})

router.beforeEach((to, from, next) => {
  const panier = panierStore();
  panier.error = null;  
  next();
});

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);
 
const auth = authStore();

auth.checkSession().finally(() => {
  app.mount("#app");
});
