<template>
    <li class="nav-item">
        <RouterLink class="nav-btn" aria-current="page" :to="link">
            <slot>{{ label }}</slot>
        </RouterLink>
    </li>
</template>

<script setup>

defineProps({
    label: String,
    link: {
        type: String,
        default: '/'
    }
})
</script>