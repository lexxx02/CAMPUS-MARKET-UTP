// ============================================================
// Auth Store – Zustand
// ============================================================

import { create } from 'zustand';
import { loginAdmin, logoutAdmin, getStoredAuth } from '../services/authService';

const useAuthStore = create((set) => {
  // Initialize from localStorage
  const stored = getStoredAuth();

  return {
    user: stored?.user || null,
    token: stored?.token || null,
    isAuthenticated: !!stored,
    isLoading: false,
    error: null,

    login: async (username, password) => {
      set({ isLoading: true, error: null });
      try {
        const { token, user } = await loginAdmin(username, password);
        set({ user, token, isAuthenticated: true, isLoading: false });
        return true;
      } catch (err) {
        set({ error: err.message, isLoading: false });
        return false;
      }
    },

    logout: async () => {
      await logoutAdmin();
      set({ user: null, token: null, isAuthenticated: false });
    },

    clearError: () => set({ error: null }),
  };
});

export default useAuthStore;
