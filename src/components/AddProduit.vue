<template>
    <div class="ajout-produit-container">
        <div class="error-message" v-if="error" role="alert">
            {{ error }}
        </div>

        <div class="success-message" v-if="success" role="alert">
            {{ success }}
        </div>
        <h1 class="form-title">Ajouter un produit</h1>

        <form @submit.prevent="ajouterProduit" class="formulaire-produit">
            <div class="form-group">
                <label for="nom">Nom du produit</label>
                <input type="text" v-model="nom_produit" id="nom" placeholder="Entrez le nom du produit" />
            </div>

            <div class="form-group">
                <label for="descriptif">Descriptif du produit</label>
                <textarea id="descriptif" v-model="descriptif_produit" placeholder="Description du produit"></textarea>
            </div>

            <div class="form-group">
                <label for="prix">Prix du produit (€)</label>
                <input type="number" v-model.number="prix_produit" id="prix" min="5" />
            </div>

            <div class="form-group">
                <label for="urlimg">URL image du produit</label>
                <input type="text" v-model="urlimage" id="urlimg" placeholder="https://..." />
            </div>

            <button type="submit" class="btn-ajouter">Ajouter le produit</button>
        </form>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const nom_produit = ref('');
const descriptif_produit = ref('');
const prix_produit = ref('');
const urlimage = ref('');
const success = ref(false);
const error = ref(false);

const ajouterProduit = async () => {
    error.value = false;
    success.value = false;
    try {
        const addProduct = await axios.post("http://localhost:3000/addProduits/", {
            nom_produit: nom_produit.value,
            descriptif_produit: descriptif_produit.value,
            prix_produit: prix_produit.value,
            urlimage: urlimage.value
        })

        nom_produit.value = ''
        descriptif_produit.value = ''
        prix_produit.value = 0
        urlimage.value = ''
    } catch (e) {
        if (e.response.data.message) {
            error.value = e.response.data.message;
        }
    }
}
</script>