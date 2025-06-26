<template>

    <div class="container">
        <div class="error-message" v-if="error" role="alert">
            {{ error }}
        </div>

        <div class="success-message" v-if="success" role="alert">
            {{ success }}
        </div>
    </div>

    <div v-if="etat === 'loading'" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Chargement...</span>
        </div>
    </div>

    <div v-else-if="etat === 'ok'">
        <ProduitDetailDisplay @quantiteProd="recupValeur" @ajouterAuPanier="addPanier"
            :produit="donnesProduitRecuperer" />
    </div>

    <div v-else>
        <div class="container">
            <div class="error-message" style="margin: 50px auto;">
                Le produit est introuvable ou une erreur est survenue.
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ProduitDetailDisplay from './ProduitDetailDisplay.vue';
import { app } from '@/stores/axiosInstance';
import { authStore } from '@/stores/auth';

const route = useRoute();
const auth = authStore();
const myUserId = computed(() => auth?.user?.userId);
const idProduct = route.params.id
const donnesProduitRecuperer = ref(null);
const etat = ref('loading');
const quantite = ref(1);
const error = ref("");
const success = ref("");

onMounted(async () => {
    try {
        const recupProduit = await app.post('/produitsDetail', {
            idProd: idProduct
        })
        donnesProduitRecuperer.value = recupProduit.data;
        etat.value = "ok";
    } catch (e) {
        console.log("Une erreur s'est produite !");
        etat.value = "erreur"
    }
});

const recupValeur = (valeur) => {
    quantite.value = valeur;
}

const addPanier = async () => {
    if (myUserId) {
        try {
            const req = await app.post("/addProduitPanier", {
                idProduit: idProduct,
                myId: myUserId.value,
                quantity: quantite.value
            })
            if (req.data.status === "success") {
                success.value = req.data.message;
                error.value = "";
            } else {
                error.value = req.data.message;
                success.value = "";
            }
        } catch (e) {
            console.error(e);
            error.value = "Impossible d'ajouter au panier. Veuillez réessayer.";
            success.value = "";
        }
    }
}
</script>