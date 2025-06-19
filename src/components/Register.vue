<template>
    <div class="container mt-5">
        <h1>Inscription</h1>
        <form @submit.prevent="inscription">

            <div class="alert alert-success" v-if="success" role="alert">
                {{ success }}
            </div>

            <div class="alert alert-danger" v-if="error" role="alert">
                {{ error }}
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">Adresse e-mail</label>
                <input type="email" class="form-control" v-model="email" id="email" placeholder="exemple@domaine.com">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input type="password" class="form-control" v-model="mdpUn" id="password" placeholder="Mot de passe">
            </div>
            <div class="mb-3">
                <label for="confirm-password" class="form-label">Confirmer le mot de passe</label>
                <input type="password" class="form-control" v-model="mdpDeux" id="confirm-password"
                    placeholder="Répéter le mot de passe">
            </div>
            <button type="submit" class="btn btn-primary float-end">S'inscrire</button>
        </form>
    </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";

const email = ref('');
const mdpUn = ref('');
const mdpDeux = ref('');
const success = ref(false);
const error = ref(false);

const inscription = async () => {
    if (email.value == "" || mdpUn.value == "" || mdpDeux.value == "") {
        error.value = "Veuillez remplir les champs vides !";
        return;
    }

    try {
        const axinscription = await axios.post('http://localhost:3000/register/', {
            email: email.value,
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