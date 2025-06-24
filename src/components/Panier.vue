<template>
    <div class="container" v-if="auth.isLogged">
        <div class="box">
            <div class="content">
                <div class="content-box">
                    <h1>Panier</h1>

                    <div class="content-panier">
                        <ProduitPanier v-for="produit in recupDonnees" :key="produit.id" :url="produit.url"
                            :name="produit.nom_produit" v-model:quantite="produit.quantity" :prix="produit.prix" />
                    </div>
                </div>
                <div class="content-box">

                </div>
                <div class="content-box">
                    <h2>Récapitulatif</h2>

                    <div class="prixTotal">
                        TOTAL: {{ totalPrix }}€
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <router-link to="/connexion">
            <div class="error-message-full">
                Vous devez être connecté pour pouvoir voir votre panier ! Cliquez ici pour vous connecter !
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import ProduitPanier from "./ProduitPanier.vue";
import { authStore } from "@/stores/auth";
import axios from "axios";
import { computed } from "vue";
const auth = authStore();

const myId = auth?.user?.userId;
const recupDonnees = ref(null);

const totalPrix = computed(() => {
    if (!recupDonnees.value) return 0;

    return recupDonnees.value.reduce((acc, produit) => {
        return acc + produit.prix * produit.quantity
    }, 0)
});

onMounted(async () => {
    if (!auth.isLogged) {
        return;
    }
    recupPanier();
});

// FONCTION MET LE PANIER A JOUR
const app = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
});

const recupPanier = async () => {
    try {
        const req = await app.post("http://localhost:3000/getPanier", {
            userId: myId
        })

        recupDonnees.value = req.data;
    } catch (e) {
        console.log("Impossible d'envoyer la requête côté front-end !")
    }
}
</script>