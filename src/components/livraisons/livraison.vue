<template>
    <div>
        <input type="radio" :value="nomLivreur" :id="nomLivreur" v-model="choix" @change="envoyer" name="livraison">
        <label :for="nomLivreur"><img :src="imageurl" alt="logo de chronopost" width="40">
            {{ nomLivreur }}
            {{ prix }}€</label>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    nomLivreur: String,
    imageurl: String,
    prix: Number,
})

const choix = ref('')

const emits = defineEmits("choixlivraison");

const envoyer = () => {
    emits('choixlivraison', { nomLivreur: choix.value, prix: props.prix })
}
</script>