<template>
    <div id="products">
        <img :src="urlImage" class="card-img-top img-fixed-size" alt="Produit 1">
        <div class="card-body">
            <h5 class="card-title">{{ title }}</h5>
            <p class="card-text description-fixed"> {{ description }}
                <button type="button" class="btn btn-primary">Voir le
                    produit</button>
                <span class="prixProduit">{{ prix }}€</span>
            </p>
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