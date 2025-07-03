<template>
    <div class="container-livraison">
        <h2>Livraison</h2>

        <div class="big-container-livraison">
            <div class="left-livraison">
                <form method="POST">
                    <Livraison nomLivreur="Chronopost" @choixlivraison="ajoutPrixLivraison" :imageurl="chronopost"
                        :prix="4.9" />
                    <Livraison nomLivreur="DPD" @choixlivraison="ajoutPrixLivraison" :imageurl="dpd" :prix="3.9" />
                    <Livraison nomLivreur="48H" @choixlivraison="ajoutPrixLivraison" :imageurl="quarantehuit"
                        :prix="7.9" />
                </form>
            </div>
            <div class="right-livraison">
                TOTAL: {{ prixFinal }}€
            </div>
        </div>
    </div>
</template>

<script setup>
import { panierStore } from '@/stores/panier';
import chronopost from '@/assets/chronopost-mini.png';
import dpd from '@/assets/dpd.png';
import { computed, ref } from 'vue';
import { watch } from 'vue';
import quarantehuit from '@/assets/48.png';
import Livraison from './livraisons/livraison.vue';

const panier = panierStore();

const prixFinal = ref(panier.totalPrix);

const ajoutPrixLivraison = (prix) => {
    prixFinal.value = `${panier.totalPrix + prix.prix} commande: ${panier.totalPrix}`
}
</script>
