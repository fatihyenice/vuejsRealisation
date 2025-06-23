<template>
    <li class="nav-item">
        <RouterLink class="nav-btn" aria-current="page" :to="link">{{ label }}
        </RouterLink>
    </li>
</template>

<script setup>

defineProps({
    label: String,
    link: String
})
</script>