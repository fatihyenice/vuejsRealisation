import Accueil from "./components/Accueil.vue" 
import AddProduit from "./components/AddProduit.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
import DetailProduit from "./components/DetailProduit.vue"

export const routes = [
    { path: "/", component: Accueil }, 
    { path: "/add", component: AddProduit },
    { path: "/connexion", component: Login },
    { path: "/inscription", component: Register },
    { path: "/detail-produits/:id", component: DetailProduit},
    { path: '/:pathMatch(.*)*', redirect: '/' }
]