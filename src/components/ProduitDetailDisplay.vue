<template>
    <div class="detail-container" v-if="produit">

        <div class="detail-content">
            <div class="detail-image">
                <img :src="produit.url" alt="Produit" />
            </div>

            <div class="detail-info">
                <h1>{{ produit.nom_produit }}</h1>
                <p>{{ produit.description }}</p>
                <h3 class="prix">{{ produit.prix }} €</h3>

                <div class="quantite-group">
                    <label for="quantite">Quantité</label>
                    <input type="number" id="quantite" v-model.number="quantite" min="1" />
                </div>

                <button class="btn-ajouter" v-if="auth.isLogged" @click="ajouterAuPanier">Ajouter au panier</button>
                <RouterLink class="btn-noconnecte" to="/connexion" v-else @click="ajouterAuPanier">Me connecter
                </RouterLink>
            </div>
        </div>
    </div>

    <div v-else class="error-message">
        <p>Le produit est introuvable !</p>
    </div>
</template>

<script setup>
import { authStore } from "@/stores/auth"

const auth = authStore();

const props = defineProps({
    produit: Object
})
</script>