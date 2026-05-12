// ============================================================
// Product Service – Simulated API with mock data
// ============================================================

import { PRODUCTS, CATEGORIES, KIOSKS, SALES_DATA } from '../data/mockData';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory product store (mutable copy)
let products = [...PRODUCTS.map(p => ({ ...p, stock: { ...p.stock } }))];
let nextId = Math.max(...products.map(p => p.id)) + 1;

// ─── Products ─────────────────────────────────────────────

export const getProducts = async () => {
  await delay();
  return [...products.map(p => ({ ...p, stock: { ...p.stock } }))];
};

export const getProductById = async (id) => {
  await delay(200);
  const product = products.find(p => p.id === Number(id));
  if (!product) throw new Error('Producto no encontrado');
  return { ...product, stock: { ...product.stock } };
};

export const getProductsByKiosk = async (kioskId) => {
  await delay();
  return products
    .filter(p => (p.stock[kioskId] || 0) > 0)
    .map(p => ({
      ...p,
      stock: { ...p.stock },
      kioskStock: p.stock[kioskId] || 0,
    }));
};

export const getProductsByCategory = async (categoryId) => {
  await delay();
  return products
    .filter(p => p.category === categoryId)
    .map(p => ({ ...p, stock: { ...p.stock } }));
};

export const searchProducts = async (query) => {
  await delay(200);
  const lower = query.toLowerCase();
  return products
    .filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
    )
    .map(p => ({ ...p, stock: { ...p.stock } }));
};

export const createProduct = async (productData) => {
  await delay(400);
  const newProduct = {
    ...productData,
    id: nextId++,
    stock: productData.stock || { 'kiosk-1': 0, 'kiosk-2': 0 },
    popular: false,
    salesCount: 0,
  };
  products.push(newProduct);
  return { ...newProduct, stock: { ...newProduct.stock } };
};

export const updateProduct = async (id, updates) => {
  await delay(400);
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) throw new Error('Producto no encontrado');
  products[index] = {
    ...products[index],
    ...updates,
    id: products[index].id,
    stock: updates.stock
      ? { ...updates.stock }
      : { ...products[index].stock },
  };
  return { ...products[index], stock: { ...products[index].stock } };
};

export const deleteProduct = async (id) => {
  await delay(300);
  const index = products.findIndex(p => p.id === Number(id));
  if (index === -1) throw new Error('Producto no encontrado');
  products.splice(index, 1);
  return { success: true };
};

// ─── Categories ───────────────────────────────────────────

export const getCategories = async () => {
  await delay(100);
  return [...CATEGORIES];
};

// ─── Kiosks ───────────────────────────────────────────────

export const getKiosks = async () => {
  await delay(100);
  return [...KIOSKS];
};

// ─── Dashboard Stats ──────────────────────────────────────

export const getDashboardStats = async () => {
  await delay(300);

  const totalProducts = products.length;
  let available = 0;
  let lowStock = 0;
  let outOfStock = 0;

  products.forEach(p => {
    const totalStock = Object.values(p.stock).reduce((a, b) => a + b, 0);
    if (totalStock === 0) outOfStock++;
    else if (totalStock < 5) lowStock++;
    else available++;
  });

  const totalStockUnits = products.reduce(
    (sum, p) => sum + Object.values(p.stock).reduce((a, b) => a + b, 0),
    0
  );

  return {
    totalProducts,
    available,
    lowStock,
    outOfStock,
    totalStockUnits,
    salesData: SALES_DATA,
    criticalProducts: products
      .filter(p => {
        const total = Object.values(p.stock).reduce((a, b) => a + b, 0);
        return total < 5;
      })
      .map(p => ({
        ...p,
        totalStock: Object.values(p.stock).reduce((a, b) => a + b, 0),
      })),
  };
};

// ─── Stock helpers ────────────────────────────────────────

export const getStockStatus = (stock, kioskId) => {
  const qty = kioskId ? (stock[kioskId] || 0) : Object.values(stock).reduce((a, b) => a + b, 0);
  if (qty === 0) return { label: 'Agotado', type: 'out', color: 'brand-danger' };
  if (qty < 5) return { label: 'Bajo stock', type: 'low', color: 'brand-warning' };
  return { label: 'Disponible', type: 'available', color: 'brand-success' };
};
