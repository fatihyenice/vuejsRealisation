<template>
    <div class="container mt-5">
        <div class="row g-5">
            <div class="col-md-4" v-for="(produit, index) in produits" :key="index">
                <Router-link :to="`detail-produits/${produit.id}`" class="text-decoration-none text-dark">
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
