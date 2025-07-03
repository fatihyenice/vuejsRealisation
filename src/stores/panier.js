import { defineStore } from 'pinia';
import { authStore } from './auth';
import { computed, ref, watch } from 'vue';
import { app } from './axiosInstance';

export const panierStore = defineStore('panier', () => {
    const auth = authStore();
    const myId = computed(() => auth.user?.userId);
    const count = ref(0);
  
    const countPanier = async () => {
      if (!myId.value) {
        count.value = 0;
        return;
      }
      try {
        const req = await app.post('/getCountPanier', { monId: myId.value }); 
        count.value = req.data.count ?? 0;
      } catch (e) {
        console.error('Erreur /getCountPanier:', e);
      }
    };

    const recupDonnees = ref(null);
    const totalPrix = computed(() => {
      if (!Array.isArray(recupDonnees.value)) return 0;
    
      return recupDonnees.value.reduce((acc, produit) => {
        return acc + produit.prix * produit.quantity;
      }, 0);
    });

    const recupPanier = async () => {
      try {
          const req = await app.post("/getPanier", {
              userId: myId.value
          })
  
          if (Array.isArray(req.data)) {
            recupDonnees.value = req.data;
          } else {
              recupDonnees.value = [];
          }
      } catch (e) {
          console.log("Impossible d'envoyer la requête côté front-end !" + e)
      }
    }

    const supprimerProduit = async(idProduit) => {
        try {
          const requete = await app.post("/supprimerPanier", {
            userId: myId.value,
            idProduit: idProduit 
          }) 
          recupDonnees.value = recupDonnees.value.filter(p => p.id_produit !== idProduit);
 
    count.value = recupDonnees.value.reduce((acc, p) => acc + p.quantity, 0);
        }catch(e) {
          console.log("Impossible d'envoyer la requête côté front-end !")
        }
    }
   
    watch(myId, (newId) => {
      if (newId) countPanier();
    }, { immediate: true }); 
  
    return { count, countPanier, supprimerProduit, recupPanier, totalPrix, recupDonnees };
  });
  