// ============================================================
// Product Store – Zustand (conectado al backend real)
// ============================================================

import { create } from 'zustand';
import * as productService from '../services/productService';

const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  kiosks: [],
  dashboardStats: null,
  isLoading: false,
  error: null,
  selectedKiosk: null,
  searchQuery: '',
  selectedCategory: null,

  // ─── Fetch Products ───────────────────────────────
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const products = await productService.getProducts();
      set({ products, isLoading: false, error: null });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // ─── Fetch Categories ─────────────────────────────
  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories();
      set({ categories });
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  },

  // ─── Fetch Kiosks ─────────────────────────────────
  fetchKiosks: async () => {
    try {
      const kiosks = await productService.getKiosks();
      set({ kiosks });
    } catch (err) {
      console.error('Error fetching kiosks:', err);
    }
  },

  // ─── Fetch Dashboard Stats ────────────────────────
  fetchDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const stats = await productService.getDashboardStats();
      set({ dashboardStats: stats, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // ─── CRUD Productos ───────────────────────────────
  createProduct: async (data) => {
    try {
      const newProduct = await productService.createProduct(data);
      set(state => ({ products: [...state.products, newProduct] }));
      return newProduct;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateProduct: async (id, data) => {
    try {
      const updated = await productService.updateProduct(id, data);
      set(state => ({
        products: state.products.map(p => (p.id === Number(id) ? updated : p)),
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateKioskStock: async (kiosk, productId, cantidad) => {
    try {
      const updated = await productService.updateKioskStock(kiosk, productId, cantidad);
      set(state => ({
        products: state.products.map(p => (p.id === Number(productId) ? updated : p)),
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      await productService.deleteProduct(id);
      set(state => ({
        products: state.products.filter(p => p.id !== Number(id)),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // ─── CRUD Categorías ──────────────────────────────
  createCategory: async (data) => {
    try {
      const newCat = await productService.createCategory(data);
      set(state => ({ categories: [...state.categories, newCat] }));
      return newCat;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  updateCategory: async (id, data) => {
    try {
      const updated = await productService.updateCategory(id, data);
      set(state => ({
        categories: state.categories.map(c => (c.id === Number(id) ? updated : c)),
      }));
      return updated;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  deleteCategory: async (id) => {
    try {
      await productService.deleteCategory(id);
      set(state => ({
        categories: state.categories.filter(c => c.id !== Number(id)),
      }));
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },

  // ─── Filters ──────────────────────────────────────
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (cat) => set({ selectedCategory: cat }),
  setSelectedKiosk: (kiosk) => set({ selectedKiosk: kiosk }),

  // ─── Filtered products getter ─────────────────────
  getFilteredProducts: () => {
    const { products, searchQuery, selectedCategory, selectedKiosk } = get();
    let filtered = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedKiosk) {
      filtered = filtered.filter(p => (p.stock[selectedKiosk] || 0) > 0);
    }

    return filtered;
  },
}));

export default useProductStore;
