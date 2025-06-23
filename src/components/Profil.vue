<template>
    <div v-if="store.isLogged">Connecté !</div>
    <div v-else>Non Connecté !</div>
</template>

<script setup>
import { authStore } from '@/stores/auth';
const store = authStore();
</script>
