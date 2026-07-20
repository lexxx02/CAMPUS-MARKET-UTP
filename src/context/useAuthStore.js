// ============================================================
// Auth Store – Zustand (conectado a Supabase Auth)
// ============================================================

import { create } from 'zustand';
import * as authService from '../services/authService';

const useAuthStore = create((set) => {
  // Inicializar desde localStorage de forma síncrona
  const user = authService.getUser();

  return {
    user: user || null,
    isAuthenticated: !!user,
    isLoading: false,
    error: null,

    /**
     * Login: autentica contra Supabase Auth.
     */
    login: async (correo, contrasena) => {
      set({ isLoading: true, error: null });
      try {
        const data = await authService.login(correo, contrasena);
        set({
          user: { rol: data.rol, nombre: data.nombre, idUsuario: data.idUsuario },
          isAuthenticated: true,
          isLoading: false,
        });
        return data;
      } catch (err) {
        set({ error: err.message, isLoading: false });
        return null;
      }
    },

    /**
     * Logout: cierra la sesión en Supabase y limpia el estado.
     */
    logout: async () => {
      await authService.logout();
      set({ user: null, isAuthenticated: false });
    },

    /**
     * Verifica la sesión activa al cargar la app.
     */
    checkSession: async () => {
      const authenticated = await authService.isAuthenticated();
      if (!authenticated) {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      }
    },

    clearError: () => set({ error: null }),
  };
});

export default useAuthStore;
