<template>
    <div class="ajout-produit-container">
        <div class="error-message" v-if="error" role="alert">
            {{ error }}
        </div>

        <div class="success-message" v-if="success" role="alert">
            {{ success }}
        </div>

        <h1>Connexion</h1>
        <form @submit.prevent="connect">
            <div class="form-group">
                <label for="exampleInputEmail1">Adresse mail</label>
                <input type="email" class="form-control" v-model="adressemail" placeholder="Azerty@exemple.com"
                    id="exampleInputEmail1" aria-describedby="emailHelp">
            </div>
            <div class="form-group">
                <label for="exampleInputPassword1">Mot de passe</label>
                <input type="password" class="form-control" v-model="mdp" placeholder="Mot de passe..."
                    id="exampleInputPassword1">
            </div>
            <button type="submit" class="btn-ajouter">Me connecter</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { provide } from 'vue';
import axios from 'axios';
import { authStore } from '@/stores/auth';

const adressemail = ref('');
const mdp = ref('');
const success = ref(false);
const error = ref(false);
const auth = authStore();

const connect = async () => {
    success.value = false;
    error.value = false;
    try {
        const connectTeste = await axios.post('http://localhost:3000/login', {
            email: adressemail.value,
            mdp: mdp.value
        }, {
            withCredentials: true
        })

        auth.login();
    } catch (e) {
        if (e.response.data.message) {
            error.value = e.response.data.message;
        }
    }
}
</script>