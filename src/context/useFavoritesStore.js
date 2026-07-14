// ============================================================
// Favorites Store – Zustand con persistencia en localStorage
// ============================================================
// Permite a los estudiantes guardar sus productos favoritos
// sin necesidad de estar logueados. Los favoritos se persisten
// en el navegador del usuario.
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [], // Array de IDs de productos favoritos

      // ─── Toggle favorito (agregar/quitar) ──────────
      toggleFavorite: (productId) => {
        const { favorites } = get();
        const isFav = favorites.includes(productId);
        set({
          favorites: isFav
            ? favorites.filter(id => id !== productId)
            : [...favorites, productId],
        });
      },

      // ─── Verificar si un producto es favorito ──────
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },

      // ─── Contar favoritos ──────────────────────────
      favoritesCount: () => {
        return get().favorites.length;
      },

      // ─── Limpiar todos los favoritos ───────────────
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'cm_favorites', // clave en localStorage
    }
  )
);

export default useFavoritesStore;
