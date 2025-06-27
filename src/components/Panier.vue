<template>
    <div class="container" v-if="auth.isLogged">
        <div class="box">
            <div class="content">
                <div class="content-box">
                    <h1>Panier</h1>

                    <div class="content-panier">
                        <ProduitPanier v-for="produit in panier.recupDonnees"
                            @click="panier.supprimerProduit(produit.id_produit)" :key="produit.id" :url="produit.url"
                            :name="produit.nom_produit" v-model:quantite="produit.quantity" :prix="produit.prix" />
                    </div>
                </div>
                <div class="content-box">

                </div>
                <div class="content-box">
                    <h2>Récapitulatif</h2>

                    <div class="prixTotal">
                        TOTAL: {{ panier.totalPrix }}€
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <router-link to="/profil">
            <div class="error-message-full">
                Vous devez être connecté pour pouvoir voir votre panier ! Cliquez ici pour vous connecter !
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import ProduitPanier from "./ProduitPanier.vue";
import { authStore } from "@/stores/auth";
import { computed } from "vue";
import { panierStore } from "@/stores/panier";


const auth = authStore();
const panier = panierStore();

const myId = computed(() => auth?.user?.userId);

onMounted(async () => {
    if (!auth.isLogged) {
        return;
    }
    panier.totalPrix
    panier.recupPanier();
});
</script>