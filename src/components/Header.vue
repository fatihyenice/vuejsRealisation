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
          <LinkHeader v-if="auth.isLogged" link="/add" class="nav-btn" label="Ajouter un produit" />
          <LinkHeader v-if="!auth.isLogged" link="/connexion" class="nav-btn" label="Connexion" />
          <LinkHeader v-if="!auth.isLogged" link="/inscription" class="nav-btn" label="Inscription" />
          <LinkHeader v-if="auth.isLogged" link="/connexion" class="nav-btn"
            :label="`${auth.user.nom} ${auth.user.prenom}`" />
          <LinkHeader v-if="auth.isLogged" link="/panier" class="nav-btn">
            <i class="ri-shopping-cart-fill"></i>
            <div class="countProduit">
              <span>{{ count }} </span>
            </div>
          </LinkHeader>
          <LinkHeader v-if="auth.isLogged" class="nav-btn" @click="deconnect" label="Déconnexion" />

        </nav>
      </div>

      <div class="iconBurger" @click="openModal">
        <i class="ri-menu-line"></i>
      </div>

      <div class="menuBurger" v-if="modal">
        <div class="closeModal" @click="openModal">
          <i class="ri-close-circle-line"></i>
        </div>

        <div class="menu">
          <ul>
            <LinkHeader link="/" @click="openModal" label="Accueil" />
            <LinkHeader v-if="auth.isLogged" @click="openModal" link="/add" label="Ajouter un produit" />
            <LinkHeader v-if="!auth.isLogged" @click="openModal" link="/connexion" label="Connexion" />
            <LinkHeader v-if="!auth.isLogged" @click="openModal" link="/inscription" label="Inscription" />
            <LinkHeader v-if="auth.isLogged" @click="openModal" link="/connexion"
              :label="`${auth.user.nom} ${auth.user.prenom}`" />
            <LinkHeader v-if="auth.isLogged" @click="openModal" link="/panier">
              <i class="ri-shopping-cart-fill"></i>
              <div class="countProduit">
                <span>{{ count }} </span>
              </div>
            </LinkHeader>
            <LinkHeader v-if="auth.isLogged" @click="deconnect" label="Déconnexion" />
          </ul>
        </div>

      </div>

    </div>
  </header>
</template>

<script setup>
import { authStore } from '@/stores/auth';
import LinkHeader from './LinkHeader.vue';
import { panierStore } from '@/stores/panier';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

const auth = authStore();
const panier = panierStore();
const isLogged = computed(() => auth.isLogged);
const { count } = storeToRefs(panier);

const modal = ref(false);

const deconnect = () => {
  auth.logout();

  if (modal.value) {
    modal.value = !modal.value
  }
}

const openModal = () => {
  modal.value = !modal.value
}
</script>
