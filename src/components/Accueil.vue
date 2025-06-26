<template>
    <div class="produits-container">
        <div class="produits-grid">
            <div v-for="(produit, index) in produits" :key="index">
                <Router-link :to="`detail-produits/${produit.id_produit}`" class="produit-link">
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
import { app } from '@/stores/axiosInstance';

const message = ref('Connexion au back end');
const produits = ref([]);

const rechargeProduit = async () => {
    try {
        const res2 = await app.get('/produits');
        produits.value = res2.data;
    } catch (err) {
        message.value = 'Erreur de connexion au backend'
    }
}

onMounted(async () => {
    rechargeProduit();
}); 
</script>
