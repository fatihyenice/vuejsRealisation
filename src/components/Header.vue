<template>
  <header>
    <!-- Topbar -->
    <div class="topbar">
      <p>Livraison gratuite à partir de 50€ 🎁</p>
    </div>

    <!-- Main Header -->
    <div class="main-header">
      <RouterLink to="/" class="logo">
        <i class="bi bi-bag-heart-fill"></i> FYDEV-Shop
      </RouterLink>

      <div class="header-right">
        <nav>
          <LinkHeader link="/" class="nav-btn" label="Accueil" />
          <LinkHeader link="/add" class="nav-btn" label="Ajouter un produit" />
          <LinkHeader v-if="!auth.isLogged" link="/connexion" class="nav-btn" label="Connexion" />
          <LinkHeader v-if="!auth.isLogged" link="/inscription" class="nav-btn" label="Inscription" />
          <LinkHeader v-if="auth.isLogged" link="/me" class="nav-btn" label="Moi" />
          <LinkHeader v-if="auth.isLogged" class="nav-btn" @click="deconnect" label="Déconnexion" />
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import LinkHeader from './LinkHeader.vue';
import { authStore } from '@/stores/auth';
import { computed } from 'vue';

const auth = authStore();

const isLogged = computed(() => auth.isLogged);

const deconnect = () => {
  auth.logout();
}

</script>
