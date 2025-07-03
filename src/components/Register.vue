<template>
    <div class="ajout-produit-container" v-if="!auth.isLogged">
        <ErrorAlert v-if="error">{{ error }}</ErrorAlert>
        <SuccessAlert v-if="success">{{ success }}</SuccessAlert>

        <h1>Inscription</h1>
        <form @submit.prevent="inscription" class="formulaire-produit">
            <div class="form-group">
                <label for="nom" class="form-label">Votre nom</label>
                <input type="text" class="form-control" v-model="nom" id="nom" placeholder="Yenice">
            </div>
            <div class="form-group">
                <label for="prenom" class="form-label">Adresse prénom</label>
                <input type="text" class="form-control" v-model="prenom" id="prenom" placeholder="Fatih">
            </div>
            <div class="form-group">
                <label for="email" class="form-label">Adresse e-mail</label>
                <input type="email" class="form-control" v-model="email" id="email" placeholder="exemple@domaine.com">
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Mot de passe</label>
                <input type="password" class="form-control" v-model="mdpUn" id="password" placeholder="Mot de passe">
            </div>
            <div class="form-group">
                <label for="confirm-password" class="form-label">Confirmer le mot de passe</label>
                <input type="password" class="form-control" v-model="mdpDeux" id="confirm-password"
                    placeholder="Répéter le mot de passe">
            </div>
            <button type="submit" class="btn-ajouter">S'inscrire</button>
        </form>
    </div>

    <div v-else>
        <router-link to="/profil">
            <div class="error-message-full">
                Vous devez êtes déjà connecté, déconnectez-vous pour vous inscrire !
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { authStore } from "@/stores/auth";
import { app } from "@/stores/axiosInstance";
import ErrorAlert from "./ErrorAlert.vue";
import SuccessAlert from "./SuccessAlert.vue";

const nom = ref('');
const prenom = ref('');
const email = ref('');
const mdpUn = ref('');
const mdpDeux = ref('');
const success = ref(false);
const error = ref(false);

const auth = authStore();

const inscription = async () => {
    success.value = false;
    error.value = false;
    if (email.value == "" || nom.value == "" || prenom.value == "" || mdpUn.value == "" || mdpDeux.value == "") {
        error.value = "Veuillez remplir les champs vides !";
        return;
    }

    try {
        const axinscription = await app.post('/register', {
            email: email.value,
            nom: nom.value,
            prenom: prenom.value,
            mdpUn: mdpUn.value,
            mdpDeux: mdpDeux.value
        })

        success.value = axinscription.data.message

        email.value = "";
        mdpUn.value = "";
        mdpDeux.value = "";
        error.value = false
    } catch (e) {
        success.value = false;
        if (e.response.data.message) {
            error.value = e.response.data.message;
        } else {
            error.value = "Une erreur s'est produite !";
        }
    }
}
</script>