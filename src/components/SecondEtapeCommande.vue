<template>
    <div class="container-livraison" v-if="panier.recupDonnees.length > 0">
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

    <div v-else>
        Votre panier est vide !
    </div>
</template>

<script setup>
import { panierStore } from '@/stores/panier';
import chronopost from '@/assets/chronopost-mini.png';
import dpd from '@/assets/dpd.png';
import { ref } from 'vue';
import quarantehuit from '@/assets/48.png';
import Livraison from './livraisons/livraison.vue';

const panier = panierStore();

const prixFinal = ref(panier.totalPrix);
const emit = defineEmits(['retourPanier']);

const ajoutPrixLivraison = async (prix) => {
    prixFinal.value = `${panier.totalPrix + prix.prix}`
    await panier.checkEtape();
    if (!panier.passed) {
        emit('retourPanier');
    } else {
        panier.passageEtapeFinal();
    }
}
</script>
