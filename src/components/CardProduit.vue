<template>
    <div class="card-produit">
        <img :src="urlImage" alt="Image du produit" class="card-img" />

        <div class="card-content">
            <h5 class="card-title">{{ title }}</h5>
            <p class="card-description">{{ description }}</p>
            <div class="card-footer">
                <span class="card-price">{{ prix }} €</span>
                <button class="card-button">Voir le produit</button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    urlImage: String,
    prix: Number
}) 
</script>