<template>
    <div class="ajout-produit-container" v-if="!auth.isLogged">
        <div class="error-message" v-if="error" role="alert">
            {{ error }}
        </div>

        <div class="success-message" v-if="success" role="alert">
            {{ success }}
        </div>

        <h1>Connexion</h1>
        <form @submit.prevent="handleConnect">
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

    <div v-else>
        <div class="container-profil">
            <div class="menu-profil">
                <div class="navigation-profil">
                    <ul>
                        <MenuProfil />
                    </ul>
                </div>
            </div>
            <div class="boite">
                <h1>Mon profil</h1>

                <div class="bigBox">
                    <MenuParametres />

                    <div class="droite-boite-context">
                        ddd
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { authStore } from '@/stores/auth';
import MenuProfil from './MenuProfil.vue';
import MenuParametres from './MenuParametres.vue';

const adressemail = ref("");
const mdp = ref("");
const error = ref("");
const success = ref("");
const auth = authStore();

watch(() => auth.isLogged, (isLogged) => {
    if (!isLogged) {
        adressemail.value = "";
        mdp.value = "";
        success.value = false;
        error.value = false;
    }
});

const handleConnect = async () => {
    const result = await auth.connect(adressemail.value, mdp.value);
    if (result.success) {
        success.value = "Connecté !";
    } else {
        error.value = result.error;
    }
};

</script>