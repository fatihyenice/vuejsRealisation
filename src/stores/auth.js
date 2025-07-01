import { ref } from "vue";
import { defineStore } from "pinia"; 
import { app } from "./axiosInstance"; 

export const authStore = defineStore("auth", () => {

  const isLogged = ref(false);
  const user = ref(null); 

  const checkSession = async () => {
    try {
      const res = await app.get("/checkSession");
      isLogged.value = !!res.data.userId;
      user.value = res.data;  
    } catch (e) {
      isLogged.value = false;
      user.value = null;
      console.warn("Erreur de session :", e);
    }
  };

  const login = () => {
    isLogged.value = true;
    localStorage.setItem("auth_event", JSON.stringify({ type: "login", time: Date.now() }));
  };

  const logout = async () => {
    try {
      await app.get("/logout");
      isLogged.value = false;
      localStorage.setItem("auth_event", JSON.stringify({ type: "logout", time: Date.now() }));
    } catch (e) {
      console.error("Erreur de logout", e);
    }
  };
 
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === "auth_event") {
        checkSession();  
      }
    });
  } 
 
  const connect = async (email, mdp) => {
    try {
      const res = await app.post('/login', { email, mdp }, { withCredentials: true });
      isLogged.value = !!res.data.userId;
      localStorage.setItem('auth_event', JSON.stringify({ type: 'login', time: Date.now() }));  
      checkSession();
      return { success: true };
    } catch (e) { 
      return { success: false, error: e.response?.data?.message || 'Erreur inconnue' };
    }
  };  
  
  return { checkSession, connect, logout, login, isLogged, user };
});
