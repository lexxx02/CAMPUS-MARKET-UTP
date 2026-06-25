import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import useProductStore from '../context/useProductStore';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import StockBadge from '../components/StockBadge';

const ProductsPage = () => {
  const { products, categories, isLoading, fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct, updateKioskStock } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (data) => {
    try {
      if (editProduct) {
        await updateProduct(editProduct.id, data);
        toast.success('Producto actualizado');
      } else {
        await createProduct(data);
        toast.success('Producto creado');
      }
      setShowModal(false);
      setEditProduct(null);
    } catch { toast.error('Error al guardar'); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      toast.success('Producto eliminado');
      setDeleteId(null);
    } catch { toast.error('Error al eliminar'); }
  };

  const handleQuickSale = async (productId, kioskId, currentStock) => {
    if (currentStock <= 0) return;
    try {
      await updateKioskStock(kioskId, productId, currentStock - 1);
      toast.success('Venta rápida: Stock actualizado', { id: `quick-sale-${productId}` });
    } catch {
      toast.error('Error al actualizar stock');
    }
  };

  const openEdit = (product) => { setEditProduct(product); setShowModal(true); };
  const openCreate = () => { setEditProduct(null); setShowModal(true); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Gestión de Productos</h1>
          <p className="text-[#9a9ab0] text-sm mt-1 font-medium">Controla el inventario y disponibilidad en los kioscos.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#E8363D] to-[#D72638] text-white font-semibold text-sm hover:shadow-[0_4px_20px_rgba(215,38,56,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0b0c0]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." className="admin-form-input w-full pl-10 pr-4 py-2.5 rounded-xl text-[#1a1a2e] text-sm placeholder-[#b0b0c0] focus:outline-none transition-all" />
      </div>

      {/* === MOBILE: Product Cards === */}
      <div className="lg:hidden space-y-3">
        <AnimatePresence>
          {filtered.map(p => {
            const cat = categories.find(c => c.id === p.category);
            const totalStock = (p.stock['kiosk-1'] || 0) + (p.stock['kiosk-2'] || 0);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="admin-glass-card rounded-2xl p-4 space-y-3">
                {/* Row 1: Product info + actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/50 shadow-sm" />
                    <div className="min-w-0">
                      <p className="text-[#1a1a2e] font-bold text-sm truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[#D72638] font-bold text-sm">S/ {p.price.toFixed(2)}</span>
                        {cat && <span className="text-[#9a9ab0] text-[11px]">• {cat.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-xl text-[#9a9ab0] hover:text-[#D72638] hover:bg-[#D72638]/[0.06] transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-xl text-[#9a9ab0] hover:text-[#dc2626] hover:bg-[#dc2626]/[0.06] transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Row 2: Stock per kiosk with quick sale buttons */}
                <div className="flex items-center gap-2">
                  {/* Piso 2 */}
                  <div className="flex-1 flex items-center justify-between bg-white/40 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-[#e0e0ea]/40">
                    <div>
                      <p className="text-[10px] font-bold text-[#9a9ab0] uppercase tracking-wider">Piso 2</p>
                      <p className={`text-lg font-black ${p.stock['kiosk-1'] === 0 ? 'text-[#dc2626]' : p.stock['kiosk-1'] < 5 ? 'text-[#d97706]' : 'text-[#1a1a2e]'}`}>{p.stock['kiosk-1']}</p>
                    </div>
                    <button 
                      onClick={() => handleQuickSale(p.id, 'kiosk-1', p.stock['kiosk-1'])}
                      disabled={p.stock['kiosk-1'] <= 0}
                      className="w-9 h-9 rounded-xl bg-white/60 border border-[#e0e0ea]/40 flex items-center justify-center text-[#9a9ab0] hover:text-[#22c55e] hover:border-[#22c55e]/30 active:scale-90 disabled:opacity-30 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Piso 7 */}
                  <div className="flex-1 flex items-center justify-between bg-white/40 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-[#e0e0ea]/40">
                    <div>
                      <p className="text-[10px] font-bold text-[#9a9ab0] uppercase tracking-wider">Piso 7</p>
                      <p className={`text-lg font-black ${p.stock['kiosk-2'] === 0 ? 'text-[#dc2626]' : p.stock['kiosk-2'] < 5 ? 'text-[#d97706]' : 'text-[#1a1a2e]'}`}>{p.stock['kiosk-2']}</p>
                    </div>
                    <button 
                      onClick={() => handleQuickSale(p.id, 'kiosk-2', p.stock['kiosk-2'])}
                      disabled={p.stock['kiosk-2'] <= 0}
                      className="w-9 h-9 rounded-xl bg-white/60 border border-[#e0e0ea]/40 flex items-center justify-center text-[#9a9ab0] hover:text-[#22c55e] hover:border-[#22c55e]/30 active:scale-90 disabled:opacity-30 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Estado */}
                  <div className="flex-shrink-0">
                    <StockBadge stock={p.stock} size="xs" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && <p className="text-center text-[#9a9ab0] py-8 text-sm">No se encontraron productos</p>}
      </div>

      {/* === DESKTOP: Table === */}
      <div className="hidden lg:block admin-glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0e0ea]/40 bg-white/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Precio</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Piso 2</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Piso 7</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(p => {
                  const cat = categories.find(c => c.id === p.category);
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-[#e0e0ea]/30 hover:bg-white/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/50 shadow-sm" />
                          <span className="text-[#1a1a2e] font-semibold truncate max-w-[150px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[#9a9ab0] text-xs font-medium">{cat?.name}</span>
                      </td>
                      <td className="px-4 py-3 text-[#D72638] font-semibold">S/ {p.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#7a7a8a] font-medium w-6">{p.stock['kiosk-1']}</span>
                          <button 
                            onClick={() => handleQuickSale(p.id, 'kiosk-1', p.stock['kiosk-1'])}
                            disabled={p.stock['kiosk-1'] <= 0}
                            className="p-1 rounded-md bg-white/50 border border-[#e0e0ea]/40 text-[#9a9ab0] hover:text-[#22c55e] hover:border-[#22c55e]/30 disabled:opacity-30 transition-all"
                            title="Venta rápida (-1)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[#7a7a8a] font-medium w-6">{p.stock['kiosk-2']}</span>
                          <button 
                            onClick={() => handleQuickSale(p.id, 'kiosk-2', p.stock['kiosk-2'])}
                            disabled={p.stock['kiosk-2'] <= 0}
                            className="p-1 rounded-md bg-white/50 border border-[#e0e0ea]/40 text-[#9a9ab0] hover:text-[#22c55e] hover:border-[#22c55e]/30 disabled:opacity-30 transition-all"
                            title="Venta rápida (-1)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StockBadge stock={p.stock} size="xs" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-[#9a9ab0] hover:text-[#D72638] hover:bg-[#D72638]/[0.06] transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-[#9a9ab0] hover:text-[#dc2626] hover:bg-[#dc2626]/[0.06] transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-[#9a9ab0] py-8 text-sm">No se encontraron productos</p>}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditProduct(null); }} title={editProduct ? 'Editar Producto' : 'Nuevo Producto'}>
        <ProductForm product={editProduct} onSubmit={handleSubmit} onCancel={() => { setShowModal(false); setEditProduct(null); }} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Eliminación" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#dc2626]/[0.08] flex items-center justify-center"><Trash2 className="w-6 h-6 text-[#dc2626]" /></div>
          <p className="text-[#7a7a8a] text-sm">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-[#e0e0ea]/60 text-[#7a7a8a] text-sm font-semibold hover:text-[#1a1a2e] transition-colors">Cancelar</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#dc2626]/90 transition-colors">Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;
