<template>
    <div class="ajout-produit-container" v-if="auth.isLogged">
        <div v-if="auth.user.role == 'admin'">
            <ErrorAlert v-if="error">{{ error }}</ErrorAlert>
            <SuccessAlert v-if="success">{{ success }}</SuccessAlert>

            <h1 class="form-title">Ajouter un produit</h1>

            <form @submit.prevent="ajouterProduit" class="formulaire-produit">
                <div class="form-group">
                    <label for="nom">Nom du produit</label>
                    <input type="text" v-model="nom_produit" id="nom" placeholder="Entrez le nom du produit" />
                </div>

                <div class="form-group">
                    <label for="descriptif">Descriptif du produit</label>
                    <textarea id="descriptif" v-model="descriptif_produit"
                        placeholder="Description du produit"></textarea>
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
        <div v-else>
            <router-link to="/profil">
                <div class="error-message-full">
                    Vous n'avez pas les autorisations nécessaires pour pouvoir ajouter un produit !
                </div>
            </router-link>
        </div>
    </div>

    <div v-else>
        <router-link to="/profil">
            <div class="error-message-full">
                Vous devez être connecté pour pouvoir ajouter des produits ! Cliquez ici pour vous connecter !
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { authStore } from "@/stores/auth";
import axios from "axios";
import { ref } from "vue";
import { app } from "@/stores/axiosInstance";
import ErrorAlert from "./ErrorAlert.vue";
import SuccessAlert from "./SuccessAlert.vue";

const nom_produit = ref('');
const descriptif_produit = ref('');
const prix_produit = ref('');
const urlimage = ref('');
const success = ref(false);
const error = ref(false);

const auth = authStore();

const ajouterProduit = async () => {
    error.value = false;
    success.value = false;
    try {
        const addProduct = await app.post("/addProduits", {
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