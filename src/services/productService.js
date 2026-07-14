// ============================================================
// Product Service — Conectado al backend Spring Boot real
// ============================================================
// Todas las operaciones usan JWT Bearer token para autenticación.
// Los datos se mapean del formato backend al formato frontend.
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ─── Helper: Headers con JWT ────────────────────────────────
const headers = () => {
  const token = localStorage.getItem('cm_token');
  const h = { 'Content-Type': 'application/json' };
  if (token && token !== 'null') {
    h['Authorization'] = `Bearer ${token}`;
  }
  return h;
};

// ─── Helper: Manejo de respuesta ────────────────────────────
const handle = async (res) => {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Error HTTP ${res.status}`);
  }
  // DELETE retorna 204 sin body
  if (res.status === 204) return { success: true };
  return res.json();
};

// ─── Mapeo: Backend DTO → Formato Frontend ──────────────────
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  description: p.description || '',
  price: parseFloat(p.price) || 0,
  image: p.image || '',
  category: p.categoryId,
  categoryName: p.categoryName || '',
  categoryIcon: p.categoryIcon || '',
  active: p.active,
  stock: {
    'kiosk-1': p.stockPiso2 || 0,
    'kiosk-2': p.stockPiso7 || 0,
  },
  stockPiso2: p.stockPiso2 || 0,
  stockPiso7: p.stockPiso7 || 0,
});

// ─── Mapeo: Frontend Form → Backend DTO ─────────────────────
const mapProductToBackend = (data) => ({
  name: data.name,
  description: data.description || '',
  price: data.price,
  stockPiso2: data.stock?.['kiosk-1'] ?? data.stockPiso2 ?? 0,
  stockPiso7: data.stock?.['kiosk-2'] ?? data.stockPiso7 ?? 0,
  image: data.image || '',
  categoryId: data.category || data.categoryId,
});

// ─── Mapeo: Backend Category → Frontend ─────────────────────
const mapCategory = (c) => ({
  id: c.id,
  name: c.name,
  icon: c.icon || '',
  active: c.active,
});

// ─── Mapeo: Backend Kiosk → Frontend ────────────────────────
const mapKiosk = (k) => ({
  id: k.id === 1 ? 'kiosk-1' : k.id === 2 ? 'kiosk-2' : `kiosk-${k.id}`,
  name: k.name,
  floor: parseInt(k.floor?.replace(/\D/g, '')) || k.id,
  location: k.location,
});

// ════════════════════════════════════════════════════════════
// PRODUCTOS
// ════════════════════════════════════════════════════════════

export const getProducts = async () => {
  const data = await fetch(`${API_URL}/products`, { headers: headers() }).then(handle);
  return data.map(mapProduct);
};

export const getProductById = async (id) => {
  const data = await fetch(`${API_URL}/products/${id}`, { headers: headers() }).then(handle);
  return mapProduct(data);
};

export const createProduct = async (productData) => {
  const data = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(mapProductToBackend(productData)),
  }).then(handle);
  return mapProduct(data);
};

export const updateProduct = async (id, productData) => {
  const data = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(mapProductToBackend(productData)),
  }).then(handle);
  return mapProduct(data);
};

export const deleteProduct = async (id) => {
  return fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: headers(),
  }).then(handle);
};

export const searchProducts = async (query) => {
  const data = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`, {
    headers: headers(),
  }).then(handle);
  return data.map(mapProduct);
};

// ════════════════════════════════════════════════════════════
// CATEGORÍAS
// ════════════════════════════════════════════════════════════

export const getCategories = async () => {
  const data = await fetch(`${API_URL}/categories`, { headers: headers() }).then(handle);
  return data.map(mapCategory);
};

export const createCategory = async (categoryData) => {
  const data = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(categoryData),
  }).then(handle);
  return mapCategory(data);
};

export const updateCategory = async (id, categoryData) => {
  const data = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(categoryData),
  }).then(handle);
  return mapCategory(data);
};

export const deleteCategory = async (id) => {
  return fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: headers(),
  }).then(handle);
};

// ════════════════════════════════════════════════════════════
// KIOSCOS
// ════════════════════════════════════════════════════════════

export const getKiosks = async () => {
  const data = await fetch(`${API_URL}/kiosks`, { headers: headers() }).then(handle);
  return data.map(mapKiosk);
};

export const updateKioskStock = async (kiosk, productId, cantidad) => {
  // kiosk viene como "kiosk-1" o "kiosk-2", convertir a "piso2" o "piso7"
  const kioskParam = kiosk === 'kiosk-1' ? 'piso2' : 'piso7';
  const data = await fetch(`${API_URL}/kiosks/${kioskParam}/products/${productId}/stock`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({ cantidad }),
  }).then(handle);
  return mapProduct(data);
};

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════

export const getDashboardStats = async () => {
  const data = await fetch(`${API_URL}/products/dashboard`, { headers: headers() }).then(handle);
  return {
    totalProducts: data.totalProductos,
    available: data.disponibles,
    lowStock: data.bajoStock,
    outOfStock: data.agotados,
    totalStockUnits: data.totalUnidades,
    criticalProducts: (data.stockCritico || []).map(mapProduct),
  };
};

// ════════════════════════════════════════════════════════════
// REPORTES (descarga Excel)
// ════════════════════════════════════════════════════════════

export const downloadReport = async (type) => {
  const token = localStorage.getItem('cm_token');
  const reqHeaders = {};
  if (token && token !== 'null') {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}/reports/${type}`, {
    headers: reqHeaders,
  });
  if (!res.ok) throw new Error('Error al generar reporte');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte_${type.replace('/', '_')}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ════════════════════════════════════════════════════════════
// HELPER: Stock Status (usado por StockBadge)
// ════════════════════════════════════════════════════════════

export const getStockStatus = (stock, kioskId) => {
  const qty = kioskId
    ? (stock[kioskId] || 0)
    : Object.values(stock).reduce((a, b) => a + b, 0);
  if (qty === 0) return { label: 'Agotado', type: 'out', color: 'brand-danger' };
  if (qty < 5) return { label: 'Bajo stock', type: 'low', color: 'brand-warning' };
  return { label: 'Disponible', type: 'available', color: 'brand-success' };
};
