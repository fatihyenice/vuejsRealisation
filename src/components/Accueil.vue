<template>
    <div class="produits-container">
        <div class="produits-grid">
            <div v-for="(produit, index) in produits" :key="index">
                <Router-link :to="`detail-produits/${produit.id}`" class="produit-link">
                    <Card :prix="produit.prix" :title="produit.nom_produit" :urlImage="produit.url"
                        :description="produit.description" />
                </Router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Card from './CardProduit.vue';
import axios from 'axios';

const message = ref('Connexion au back end');
const produits = ref([]);

const rechargeProduit = async () => {
    try {
        const res2 = await axios.get('http://localhost:3000/produits');
        produits.value = res2.data;
    } catch (err) {
        message.value = 'Erreur de connexion au backend'
    }
}

onMounted(async () => {
    rechargeProduit();
}); 
</script>
