<template>
    <div class="container mt-4" v-if="produit">
        <h1>{{ produit.nom_produit }}</h1>

        <div class="container py-5">
            <div class="row">
                <div class="col-md-6">
                    <img :src="produit.url" alt="Produit" class="img-fluid rounded">
                </div>

                <div class="col-md-6">
                    <h1 class="mb-3">{{ produit.nom_produit }}</h1>
                    <p>{{ produit.description }}</p>
                    <h4 class="text-success">{{ produit.prix }}€</h4>

                    <div class="my-3">
                        <label for="quantite" class="form-label">Quantité</label>
                        <input type="number" id="quantite" class="form-control w-25" value="1" min="1">
                    </div>

                    <button class="btn btn-primary btn-lg mt-3">Ajouter au panier</button>
                </div>
            </div>
        </div>
    </div>

    <div v-else>
        <div class="container mt-4">
            <div class="alert alert-danger" role="alert">
                Le produit est introuvable !
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    produit: Object
})
</script>