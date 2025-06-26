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
        console.log('> API /getCountPanier:', req.data);
        count.value = req.data.count ?? 0;
      } catch (e) {
        console.error('Erreur /getCountPanier:', e);
      }
    };
   
    watch(myId, (newId) => {
      if (newId) countPanier();
    }, { immediate: true });
  
    watch(count, (newVal) => {
      console.log('🛒 store.count changed:', newVal);
    });
  
    return { count, countPanier };
  });
  