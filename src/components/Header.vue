<template> 

    <nav class="navbar navbar-expand-lg navbar-custom shadow">
  <div class="container-fluid">
    <a class="navbar-brand text-white fw-bold" href="#">
      <i class="bi bi-bag-heart-fill me-2"></i>FYDEV-Shop
    </a>
    <button class="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <LinkHeader link="/" label="Accueil"/>
        <LinkHeader label="Inscription"/>
        <LinkHeader link="connexion" label="Connexion"/>
      </ul>

      <form class="d-flex search-bar me-3" role="search">
        <input class="form-control me-2" type="search" placeholder="Rechercher un produit..." aria-label="Search">
        <button class="btn btn-light" type="submit"><i class="bi bi-search"></i></button>
      </form> 

    </div>
  </div>
</nav>
</template>

<script setup>
import LinkHeader from './LinkHeader.vue';
</script> 