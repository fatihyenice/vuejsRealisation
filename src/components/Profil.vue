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
                        <h3>Modifier mes informations personnelles</h3>
                        <div class="error-message" v-if="errorModifProfil" role="alert">
                            {{ errorModifProfil }}
                        </div>

                        <div class="success-message" v-if="successModifProfil" role="alert">
                            {{ successModifProfil }}
                        </div>

                        <form class="information-perso" :key="profil">
                            <div>
                                <label for="nom">Nom <input type="text" id="nom" v-model="nom"></label>
                                <label for="prenom">Prénom <input type="text" id="prenom" v-model="prenom"></label>
                            </div>

                            <div>
                                <label for="mail">Adresse mail <input type="text" id="mail" v-model="mail"></label>
                            </div>

                            <button type="submit" id="informationbtn" @click.prevent="changeInfo"
                                class="btn-ajouter">Modifier mes
                                informations</button>
                        </form>
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
import { app } from '@/stores/axiosInstance';

const adressemail = ref("");
const mdp = ref("");
const error = ref("");
const success = ref("");
const errorModifProfil = ref("");
const successModifProfil = ref("");
const auth = authStore();

const nom = ref(auth.user.nom);
const prenom = ref(auth.user.prenom);
const mail = ref(auth.user.email);

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

const changeInfo = async () => {
    try {
        const update = await app.post("/updateProfil", {
            userId: auth.user.userId,
            nom: nom.value,
            prenom: prenom.value,
            email: mail.value
        })


        auth.user.nom = nom.value;
        auth.user.prenom = prenom.value;
        auth.user.email = mail.value;

        successModifProfil.value = update.data.message;
        errorModifProfil.value = false;
    } catch (e) {
        errorModifProfil.value = e.response.data.message;
        successModifProfil.value = false;
    }
}
</script>