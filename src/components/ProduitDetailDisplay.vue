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
                    <input type="number" id="quantite" @input="envoyerQuantite" @click="delValue"
                        v-model.number="quantite" min="1" max="5" />
                </div>

                <button class="btn-ajouter" v-if="auth.isLogged" @click="$emit('ajouterAuPanier')">Ajouter au
                    panier</button>
                <RouterLink class="btn-noconnecte" :to="routeConnexion" v-else @click="ajouterAuPanier">Me connecter
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
import axios from "axios";
import { computed, ref } from "vue";

const auth = authStore();
const routeConnexion = '/profil'
const quantite = ref(1);
const quantiteFinal = computed(() => quantite.value);

const props = defineProps({
    produit: Object
});

const emits = defineEmits(["quantiteProd", "ajouterAuPanier"])

const envoyerQuantite = () => {
    if (quantite.value > 5) {
        emits("quantiteProd", 5)
        return quantite.value = 5;
    }

    emits("quantiteProd", quantiteFinal.value);
}

const delValue = () => {
    quantite.value = 1
}
</script>