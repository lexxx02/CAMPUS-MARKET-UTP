// ============================================================
// Auth Store – Zustand (conectado al backend real)
// ============================================================

import { create } from 'zustand';
import * as authService from '../services/authService';

const useAuthStore = create((set) => {
  // Inicializar desde localStorage
  const user = authService.getUser();
  const token = authService.getToken();

  return {
    user: user || null,
    token: token || null,
    isAuthenticated: authService.isAuthenticated(),
    isLoading: false,
    error: null,

    /**
     * Login: autentica contra el backend real con JWT.
     * Retorna los datos del usuario si el login es exitoso.
     */
    login: async (correo, contrasena) => {
      set({ isLoading: true, error: null });
      try {
        const data = await authService.login(correo, contrasena);
        set({
          user: { rol: data.rol, nombre: data.nombre, idUsuario: data.idUsuario },
          token: data.token,
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
     * Logout: elimina token y datos del localStorage.
     */
    logout: () => {
      authService.logout();
      set({ user: null, token: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null }),
  };
});

export default useAuthStore;
