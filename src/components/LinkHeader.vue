<template>
    <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#">{{ link }}</a>
    </li> 
</template>

<script setup>
defineProps({
    link: String
})
</script>