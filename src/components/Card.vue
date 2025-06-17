<template>
    <div class="col-md-4">
        <img :src="urlImage" class="card-img-top" alt="Produit 1">
        <div class="card-body">
            <h5 class="card-title">{{ title }}</h5>
            <p class="card-text"> {{ description }}
                <button type="button" class="btn btn-primary" @click="emitDetail">Voir le produit</button>
            </p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    description: String,
    urlImage: String
})

const emits = defineEmits(['detail'])

const emitDetail = () => {
    emits('detail', props.description)
}
</script>