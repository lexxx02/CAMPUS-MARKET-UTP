// ============================================================
// Product Service — Conectado directamente a Supabase
// ============================================================
// Reemplaza las llamadas al backend de Render (Spring Boot).
// Tablas: producto, categoria, kiosco
// ============================================================

import { supabase } from '../lib/supabaseClient';
import * as XLSX from 'xlsx';

// ─── Mapeo: Fila Supabase → Formato Frontend ─────────────────
const mapProduct = (p) => ({
  id: p.id_producto,
  name: p.nombre_producto,
  description: p.descripcion || '',
  price: parseFloat(p.precio) || 0,
  image: p.imagen_url || '',
  category: p.id_categoria,
  categoryName: p.categoria?.nombre || '',
  categoryIcon: '',
  active: p.activo,
  stock: {
    'kiosk-1': p.stock_piso2 || 0,
    'kiosk-2': p.stock_piso7 || 0,
  },
  stockPiso2: p.stock_piso2 || 0,
  stockPiso7: p.stock_piso7 || 0,
});

// ─── Mapeo: Frontend Form → Fila Supabase ────────────────────
const mapProductToSupabase = (data) => ({
  nombre_producto: data.name,
  descripcion: data.description || '',
  precio: data.price,
  stock_piso2: data.stock?.['kiosk-1'] ?? data.stockPiso2 ?? 0,
  stock_piso7: data.stock?.['kiosk-2'] ?? data.stockPiso7 ?? 0,
  imagen_url: data.image || '',
  id_categoria: data.category || data.categoryId,
});

// ─── Mapeo: Categoria ─────────────────────────────────────────
const mapCategory = (c) => ({
  id: c.id_categoria,
  name: c.nombre,
  icon: c.icono || '',
  active: c.activo,
});

// ─── Mapeo: Kiosko ────────────────────────────────────────────
const mapKiosk = (k) => ({
  id: k.id_kiosco === 1 ? 'kiosk-1' : k.id_kiosco === 2 ? 'kiosk-2' : `kiosk-${k.id_kiosco}`,
  name: k.nombre,
  floor: parseInt(k.piso?.replace(/\D/g, '')) || k.id_kiosco,
  location: k.ubicacion,
});

// ════════════════════════════════════════════════════════════
// PRODUCTOS
// ════════════════════════════════════════════════════════════

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('producto')
    .select('*, categoria(id_categoria, nombre)')
    .eq('activo', true)
    .order('id_producto', { ascending: true });

  if (error) throw new Error(error.message);
  return data.map(mapProduct);
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('producto')
    .select('*, categoria(id_categoria, nombre)')
    .eq('id_producto', id)
    .single();

  if (error) throw new Error(error.message);
  return mapProduct(data);
};

export const createProduct = async (productData) => {
  const { data, error } = await supabase
    .from('producto')
    .insert([mapProductToSupabase(productData)])
    .select('*, categoria(id_categoria, nombre)')
    .single();

  if (error) throw new Error(error.message);
  return mapProduct(data);
};

export const updateProduct = async (id, productData) => {
  const { data, error } = await supabase
    .from('producto')
    .update(mapProductToSupabase(productData))
    .eq('id_producto', id)
    .select('*, categoria(id_categoria, nombre)')
    .single();

  if (error) throw new Error(error.message);
  return mapProduct(data);
};

export const deleteProduct = async (id) => {
  // Soft delete: marcar como inactivo
  const { error } = await supabase
    .from('producto')
    .update({ activo: false })
    .eq('id_producto', id);

  if (error) throw new Error(error.message);
  return { success: true };
};

export const searchProducts = async (query) => {
  const { data, error } = await supabase
    .from('producto')
    .select('*, categoria(id_categoria, nombre)')
    .eq('activo', true)
    .or(`nombre_producto.ilike.%${query}%,descripcion.ilike.%${query}%`);

  if (error) throw new Error(error.message);
  return data.map(mapProduct);
};

// ════════════════════════════════════════════════════════════
// CATEGORÍAS
// ════════════════════════════════════════════════════════════

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categoria')
    .select('*')
    .eq('activo', true)
    .order('id_categoria', { ascending: true });

  if (error) throw new Error(error.message);
  return data.map(mapCategory);
};

export const createCategory = async (categoryData) => {
  const { data, error } = await supabase
    .from('categoria')
    .insert([{ nombre: categoryData.name, activo: true }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapCategory(data);
};

export const updateCategory = async (id, categoryData) => {
  const { data, error } = await supabase
    .from('categoria')
    .update({ nombre: categoryData.name })
    .eq('id_categoria', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapCategory(data);
};

export const deleteCategory = async (id) => {
  const { error } = await supabase
    .from('categoria')
    .update({ activo: false })
    .eq('id_categoria', id);

  if (error) throw new Error(error.message);
  return { success: true };
};

// ════════════════════════════════════════════════════════════
// KIOSCOS
// ════════════════════════════════════════════════════════════

export const getKiosks = async () => {
  const { data, error } = await supabase
    .from('kiosco')
    .select('*')
    .eq('activo', true)
    .order('id_kiosco', { ascending: true });

  if (error) throw new Error(error.message);
  return data.map(mapKiosk);
};

export const updateKioskStock = async (kiosk, productId, cantidad) => {
  const stockField = kiosk === 'kiosk-1' ? 'stock_piso2' : 'stock_piso7';

  const { data, error } = await supabase
    .from('producto')
    .update({ [stockField]: cantidad })
    .eq('id_producto', productId)
    .select('*, categoria(id_categoria, nombre)')
    .single();

  if (error) throw new Error(error.message);
  return mapProduct(data);
};

// ════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════

export const getDashboardStats = async () => {
  const { data: productos, error } = await supabase
    .from('producto')
    .select('*, categoria(id_categoria, nombre)')
    .eq('activo', true);

  if (error) throw new Error(error.message);

  const UMBRAL = 5;
  let disponibles = 0;
  let bajoStock = 0;
  let agotados = 0;
  let totalUnidades = 0;
  const stockCritico = [];

  productos.forEach((p) => {
    const total = (p.stock_piso2 || 0) + (p.stock_piso7 || 0);
    totalUnidades += total;
    if (total === 0) {
      agotados++;
    } else if (p.stock_piso2 < UMBRAL || p.stock_piso7 < UMBRAL) {
      bajoStock++;
      stockCritico.push(mapProduct(p));
    } else {
      disponibles++;
    }
  });

  return {
    totalProducts: productos.length,
    available: disponibles,
    lowStock: bajoStock,
    outOfStock: agotados,
    totalStockUnits: totalUnidades,
    criticalProducts: stockCritico,
  };
};

// ════════════════════════════════════════════════════════════
// REPORTES (genera Excel en el navegador con xlsx)
// ════════════════════════════════════════════════════════════

export const downloadReport = async (type) => {
  const { data: productos, error } = await supabase
    .from('producto')
    .select('*, categoria(id_categoria, nombre)')
    .eq('activo', true);

  if (error) throw new Error(error.message);

  const UMBRAL = 5;
  const now = new Date().toLocaleString('es-PE');
  let rows = [];
  let headers = [];
  let sheetName = '';
  let fileName = '';

  if (type === 'general') {
    sheetName = 'Inventario General';
    fileName = 'reporte_inventario_general.xlsx';
    headers = ['Código', 'Producto', 'Categoría', 'Stock Piso 2', 'Stock Piso 7', 'Stock Total', 'Estado'];
    rows = productos.map((p) => {
      const total = (p.stock_piso2 || 0) + (p.stock_piso7 || 0);
      const estado = total === 0 ? 'Agotado' :
        (p.stock_piso2 < UMBRAL || p.stock_piso7 < UMBRAL) ? 'Bajo Stock' : 'Disponible';
      return [p.id_producto, p.nombre_producto, p.categoria?.nombre || 'Sin categoría', p.stock_piso2 || 0, p.stock_piso7 || 0, total, estado];
    });

  } else if (type === 'critical-stock') {
    sheetName = 'Stock Crítico';
    fileName = 'reporte_stock_critico.xlsx';
    headers = ['Producto', 'Categoría', 'Stock Piso 2', 'Stock Piso 7', 'Kiosco con bajo stock', 'Unidades restantes'];
    rows = productos
      .filter((p) => (p.stock_piso2 || 0) < UMBRAL || (p.stock_piso7 || 0) < UMBRAL)
      .map((p) => {
        const kioscoBajo = [];
        let restantes = 0;
        if ((p.stock_piso2 || 0) < UMBRAL) { kioscoBajo.push('Piso 2'); restantes += (p.stock_piso2 || 0); }
        if ((p.stock_piso7 || 0) < UMBRAL) { kioscoBajo.push('Piso 7'); restantes += (p.stock_piso7 || 0); }
        return [p.nombre_producto, p.categoria?.nombre || 'Sin categoría', p.stock_piso2 || 0, p.stock_piso7 || 0, kioscoBajo.join(', '), restantes];
      });

  } else if (type === 'kiosk/piso2') {
    sheetName = 'Inventario Piso 2';
    fileName = 'reporte_kiosco_piso2.xlsx';
    headers = ['Código', 'Producto', 'Categoría', 'Cantidad disponible', 'Estado'];
    rows = productos.map((p) => {
      const stock = p.stock_piso2 || 0;
      const estado = stock === 0 ? 'Agotado' : stock < UMBRAL ? 'Bajo stock' : 'Disponible';
      return [p.id_producto, p.nombre_producto, p.categoria?.nombre || 'Sin categoría', stock, estado];
    });

  } else if (type === 'kiosk/piso7') {
    sheetName = 'Inventario Piso 7';
    fileName = 'reporte_kiosco_piso7.xlsx';
    headers = ['Código', 'Producto', 'Categoría', 'Cantidad disponible', 'Estado'];
    rows = productos.map((p) => {
      const stock = p.stock_piso7 || 0;
      const estado = stock === 0 ? 'Agotado' : stock < UMBRAL ? 'Bajo stock' : 'Disponible';
      return [p.id_producto, p.nombre_producto, p.categoria?.nombre || 'Sin categoría', stock, estado];
    });
  }

  // Crear workbook
  const wb = XLSX.utils.book_new();
  const titleRow = [`CAMPUS MARKET UTP — ${sheetName.toUpperCase()}`];
  const dateRow = [`Generado: ${now}`];
  const wsData = [titleRow, dateRow, headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Ancho de columnas automático
  ws['!cols'] = headers.map((_, i) => ({
    wch: Math.max(headers[i]?.length || 10, ...rows.map((r) => String(r[i] || '').length)) + 4,
  }));

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
};

// ════════════════════════════════════════════════════════════
// HELPER: Stock Status
// ════════════════════════════════════════════════════════════

export const getStockStatus = (stock, kioskId) => {
  const qty = kioskId
    ? (stock[kioskId] || 0)
    : Object.values(stock).reduce((a, b) => a + b, 0);
  if (qty === 0) return { label: 'Agotado', type: 'out', color: 'brand-danger' };
  if (qty < 5) return { label: 'Bajo stock', type: 'low', color: 'brand-warning' };
  return { label: 'Disponible', type: 'available', color: 'brand-success' };
};
