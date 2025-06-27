<template>
    <div class="container-profil" v-if="auth.isLogged">
        <div class="menu-profil">
            <div class="navigation-profil">
                <ul>
                    <MenuProfil />
                </ul>
            </div>
        </div>
        <div class="boite">
            <h1>Commandes</h1>
        </div>
    </div>

    <div v-else>
        <router-link to="/profil">
            <div class="error-message-full">
                Vous devez être connecté pour pouvoir accéder à cette page ! Cliquez ici pour vous connecter !
            </div>
        </router-link>
    </div>
</template>

<script setup>
import { authStore } from '@/stores/auth';
import MenuProfil from './MenuProfil.vue';
const auth = authStore();

</script>