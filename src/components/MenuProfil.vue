<template>
    <li v-for="item in menuItems" :key="item.to">
        <RouterLink :to="item.to" class="navigation-link">
            {{ item.label }} <i :class="item.icon"></i>
        </RouterLink>
    </li>
</template>

<script setup>
const menuItems = [
    { to: '/profil', label: 'Mon profil', icon: 'ri-user-6-fill' },
    { to: '/commandes', label: 'Mes commandes', icon: 'ri-box-3-fill' },
    { to: '/parametres', label: 'Mes paramètres', icon: 'ri-settings-3-line' },
    { to: '/reclamations', label: 'Réclamations', icon: 'ri-shake-hands-line' },
    { to: '/supprimer', label: 'Supprimer mon compte', icon: 'ri-delete-bin-line' },
];
</script>