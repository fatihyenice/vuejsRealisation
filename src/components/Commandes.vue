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
            <h1><i class="ri-box-3-fill"></i> Commandes</h1>

            <div class="big-container">
                <div class="container-list-commandes">
                    <ListCommandes nom="Whey protéine" v-for="panier in panier.recupDonnees" :key="panier"
                        :Prix="panier.prix" Date="25/05/2025" />
                </div>
                <div class="container-commandes">

                </div>
            </div>
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
import ListCommandes from './ListCommandes.vue';
import { panierStore } from '@/stores/panier';
import { onMounted } from 'vue';
const auth = authStore();

const panier = panierStore();

onMounted(() => {
    panier.recupPanier();
}) 
</script>