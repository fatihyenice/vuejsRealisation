import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const authStore = defineStore('auth', () => {

  const isLogged = ref(false);

  const app = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
  });
  

  const checkSession = async () => {
    try {
      const res = await app.get('/checkSession'); 
      isLogged.value = !!res.data.userId;
    } catch (e) {
      isLogged.value = false;
      console.log("Impossible de récupérer une session", e);
    }
  };
  
  
  const login = () => {
    isLogged.value = true;
  };

  const logout = async () => {
    try {
      const res = await app.get('/logout');
      isLogged.value = false;
    } catch (e) {
      isLogged.value = true; 
    }
  };

  return { checkSession, logout, app, login, isLogged };
});
