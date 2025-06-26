<template>
  <Header />
  <RouterView />
</template>

<script setup>
import Header from './components/Header.vue';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { panierStore } from './stores/panier';

const panier = panierStore();
const route = useRoute();

onMounted(() => {
  panier.countPanier(); // au chargement initial
});

watch(
  () => route.fullPath,   // on observe les changements d'URL (donc les changements de page)
  () => {
    panier.countPanier(); // on recharge à chaque changement de page
  }
);
</script>