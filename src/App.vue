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
  panier.countPanier();
});

watch(() => route.fullPath, () => {
  panier.countPanier();
}
);
</script>