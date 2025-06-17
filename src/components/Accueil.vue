<template>
    <div class="container mt-5">
        <div class="row g-4">
            <Card title="Whey protéine" urlImage="https://www.optigura.fr/img/prods/1153/main-w500h500@2x.08209.webp"
                description="Protéine en poudre de 1000g, sans lactose" @detail="afficheDetail" />
        </div>

        <div class="container mt-3" v-if="detail">
            {{ detail }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from './Card.vue';

const detail = ref(null);

const afficheDetail = (details) => {
    if (detail.value === details) {
        detail.value = null;
    } else {
        detail.value = details;
    }
}
</script>
