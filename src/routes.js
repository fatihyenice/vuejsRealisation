import Accueil from "./components/Accueil.vue" 
import AddProduit from "./components/AddProduit.vue" 
import Register from "./components/Register.vue"
import DetailProduit from "./components/DetailProduit.vue" 
import Panier from "./components/Panier.vue"
import Commandes from "./components/Commandes.vue" 
import Profil from "./components/Profil.vue" 
import Reclamations from "./components/Reclamations.vue" 
import Supprimer from "./components/Supprimer.vue" 

export const routes = [
    { path: "/", component: Accueil }, 
    { path: "/add", component: AddProduit },
    { path: "/profil", component: Profil },
    { path: "/inscription", component: Register },
    { path: "/detail-produits/:id", component: DetailProduit}, 
    { path: "/panier", component: Panier }, 
    { path: "/commandes", component: Commandes}, 
    { path: "/reclamations", component: Reclamations},
    { path: "/supprimer", component: Supprimer},
    { path: '/:pathMatch(.*)*', redirect: '/' }
]