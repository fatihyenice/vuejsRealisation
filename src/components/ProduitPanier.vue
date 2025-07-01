<template>
    <div class="produit">
        <div>
            <img :src="url" width="80" height="80" alt="Image du produit" />
        </div>
        <div class="detail">
            <h3>{{ name }}</h3>
        </div>
        <div class="detail">
            <h4>Prix</h4>
            <span>{{ prix }}€</span>
        </div>
        <div class="detail">
            <h4>Quantité</h4>
            <select v-model="localQuantite">
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
            </select>
        </div>
        <div class="detail">
            <h4>Action</h4>
            <span>
                <i class="ri-delete-bin-line" @click="sendId"></i>
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    name: String,
    url: String,
    prix: Number,
    quantite: Number,
    idProduit: Number,
});

const emit = defineEmits(['update:quantite'], ["supprimer"]);

const localQuantite = ref(props.quantite);

const sendId = () => {
    emit("supprimer", props.idProduit);
}

watch(localQuantite, (newVal) => {
    emit('update:quantite', Number(newVal));
}); 
</script>
