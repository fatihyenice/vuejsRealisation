<template>
    <div class="container mt-5">
        <h1>Ajouter un produit</h1>

        <form @submit.prevent="ajouterProduit">
            <div class="form-group">
                <label for="exampleInputEmail1">Nom du produit</label>
                <input type="text" class="form-control mt-2" v-model="nom_produit" id="exampleInputEmail1"
                    aria-describedby="emailHelp" placeholder="Entrez le nom du produit">
            </div>

            <label for="descriptif" class="mt-3">Descriptif du produit</label>
            <div class="form-floating mt-2">
                <textarea class="form-control" v-model="descriptif_produit" placeholder="Leave a comment here"
                    id="descriptif" style="height: 100px"></textarea>
                <label for="floatingTextarea2">Description du produit</label>
            </div>

            <div class="form-group mt-2">
                <label for="prix">Prix du produit</label><br>
                <input type="number" v-model="prix_produit" class="form-control d-block w-75" min="5" value="5"
                    id="prix">
                <span>€</span>
            </div>

            <div class="form-group mt-2">
                <label for="urlimg">URL image du produit</label>
                <input type="text" v-model="urlimage" class="form-control mt-2" id="urlimg" aria-describedby="emailHelp"
                    placeholder="Entrez le nom du produit">
            </div>

            <button type="submit" class="btn btn-primary float-end mt-3">Ajouter le produit</button>
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

const ajouterProduit = async () => {
    try {
        await axios.post("http://localhost:3000/addProduits/", {
            nom_produit: nom_produit.value,
            descriptif_produit: descriptif_produit.value,
            prix_produit: prix_produit.value,
            urlimage: urlimage.value
        })

        nom_produit.value = ''
        descriptif_produit.value = ''
        prix_produit.value = 0
        urlimage.value = ''
    } catch (error) {
        console.error("Erreur lors de l'ajout du produit ❌", error);
    }
}
</script>