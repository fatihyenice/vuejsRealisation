<template>
    <div class="list-commandes">
        <h2>{{ nom }}</h2>
        <span>
            Total: <div class="prix-list">{{ Prix }}€</div>
            Date: {{ Date }}
        </span>
    </div>
</template>

<script setup>

const props = defineProps({
    nom: String,
    Prix: Number,
    Date: Date,
})

</script>