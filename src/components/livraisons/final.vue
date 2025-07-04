<template>
    <div class="recap-final-container" v-if="panier.recupDonnees.length > 0">
        <div class="recap-final-filtre" v-if="(!panier.passFinal || !panier.passed)">
            Veuillez sélectionner un mode de livraison
        </div>

        <h2>Etape Récapitulatif</h2>

        <ProduitPanier @supprimer="panier.supprimerProduit(produit.id_produit)" v-for="produit in panier.recupDonnees"
            :idProduit="produit.id_produit" :key="produit.id" :url="produit.url" :name="produit.nom_produit"
            v-model:quantite="produit.quantity" :prix="produit.prix" />

        <button type="button">Valider ma comm</button>
    </div>
</template>

<script setup>
import { panierStore } from '@/stores/panier';
import ProduitPanier from '../ProduitPanier.vue';
const panier = panierStore();
</script>