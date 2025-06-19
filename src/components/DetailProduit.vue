<template>
    <div v-if="etat === 'loading'" class="d-flex justify-content-center py-5">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Chargement...</span>
        </div>
    </div>

    <div v-else-if="etat === 'ok'">
        <ProduitDetailDisplay :produit="donnesProduitRecuperer" />
    </div>

    <div v-else>
        <div class="alert alert-danger text-center mt-5">
            Le produit est introuvable ou une erreur est survenue.
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProduitDetailDisplay from './ProduitDetailDisplay.vue';
import axios from 'axios';

const route = useRoute();
const idProduct = route.params.id
const donnesProduitRecuperer = ref(null);
const etat = ref('loading')

onMounted(async () => {
    try {
        const recupProduit = await axios.post('http://localhost:3000/produitsDetail', {
            idProd: idProduct
        })
        donnesProduitRecuperer.value = recupProduit.data;
        etat.value = "ok";
    } catch (e) {
        console.log("Une erreur s'est produite !")
    }

})
</script>