<template>
    <div class="container mt-5">
        <h1>Connexion</h1>
        <div class="alert alert-success" v-if="success" role="alert">
            {{ success }}
        </div>

        <div class="alert alert-danger" v-if="error" role="alert">
            {{ error }}
        </div>

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
            <button type="submit" class="btn btn-primary float-end mt-3">Me connecter</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const adressemail = ref('');
const mdp = ref('');
const success = ref(false);
const error = ref(false);

const connect = async () => {
    try {
        const connectTeste = await axios.post('http://localhost:3000/login', {
            email: adressemail.value,
            mdp: mdp.value
        })
    } catch (e) {
        if (e.response.data.message) {
            error.value = e.response.data.message;
        }
    }
}
</script>