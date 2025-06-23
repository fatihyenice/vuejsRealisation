import Accueil from "./components/Accueil.vue" 
import AddProduit from "./components/AddProduit.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
import DetailProduit from "./components/DetailProduit.vue"
import Profil from "./components/Profil.vue"
import Panier from "./components/Panier.vue"

export const routes = [
    { path: "/", component: Accueil }, 
    { path: "/add", component: AddProduit },
    { path: "/connexion", component: Login },
    { path: "/inscription", component: Register },
    { path: "/detail-produits/:id", component: DetailProduit},
    { path: "/me", component: Profil},
    { path: "/panier", component: Panier }, 
    { path: '/:pathMatch(.*)*', redirect: '/' }
]