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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Productos</h1>
          <p className="text-brand-gray-500 text-sm mt-1">{products.length} productos registrados</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red text-white font-semibold text-sm hover:bg-brand-red-light transition-colors shadow-red">
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..." className="w-full pl-10 pr-4 py-2.5 bg-brand-surface border border-brand-border rounded-xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 transition-all" />
      </div>

      {/* === MOBILE: Product Cards === */}
      <div className="lg:hidden space-y-3">
        <AnimatePresence>
          {filtered.map(p => {
            const cat = categories.find(c => c.id === p.category);
            const totalStock = (p.stock['kiosk-1'] || 0) + (p.stock['kiosk-2'] || 0);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-brand-card rounded-2xl border border-brand-border p-4 space-y-3">
                {/* Row 1: Product info + actions */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10" />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-brand-red font-bold text-sm">S/ {p.price.toFixed(2)}</span>
                        {cat && <span className="text-brand-gray-500 text-[11px]">• {cat.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="p-2 rounded-xl text-brand-gray-400 hover:text-brand-red hover:bg-brand-red/10 transition-all"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-xl text-brand-gray-400 hover:text-brand-danger hover:bg-brand-danger/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                {/* Row 2: Stock per kiosk with quick sale buttons */}
                <div className="flex items-center gap-2">
                  {/* Piso 2 */}
                  <div className="flex-1 flex items-center justify-between bg-brand-surface/50 rounded-xl px-3 py-2.5 border border-brand-border/50">
                    <div>
                      <p className="text-[10px] font-bold text-brand-gray-500 uppercase tracking-wider">Piso 2</p>
                      <p className={`text-lg font-black ${p.stock['kiosk-1'] === 0 ? 'text-brand-danger' : p.stock['kiosk-1'] < 5 ? 'text-brand-warning' : 'text-white'}`}>{p.stock['kiosk-1']}</p>
                    </div>
                    <button 
                      onClick={() => handleQuickSale(p.id, 'kiosk-1', p.stock['kiosk-1'])}
                      disabled={p.stock['kiosk-1'] <= 0}
                      className="w-9 h-9 rounded-xl bg-brand-card border border-brand-border flex items-center justify-center text-brand-gray-400 hover:text-brand-success hover:border-brand-success/50 active:scale-90 disabled:opacity-30 transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Piso 7 */}
                  <div className="flex-1 flex items-center justify-between bg-brand-surface/50 rounded-xl px-3 py-2.5 border border-brand-border/50">
                    <div>
                      <p className="text-[10px] font-bold text-brand-gray-500 uppercase tracking-wider">Piso 7</p>
                      <p className={`text-lg font-black ${p.stock['kiosk-2'] === 0 ? 'text-brand-danger' : p.stock['kiosk-2'] < 5 ? 'text-brand-warning' : 'text-white'}`}>{p.stock['kiosk-2']}</p>
                    </div>
                    <button 
                      onClick={() => handleQuickSale(p.id, 'kiosk-2', p.stock['kiosk-2'])}
                      disabled={p.stock['kiosk-2'] <= 0}
                      className="w-9 h-9 rounded-xl bg-brand-card border border-brand-border flex items-center justify-center text-brand-gray-400 hover:text-brand-success hover:border-brand-success/50 active:scale-90 disabled:opacity-30 transition-all"
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
        {filtered.length === 0 && <p className="text-center text-brand-gray-500 py-8 text-sm">No se encontraron productos</p>}
      </div>

      {/* === DESKTOP: Table === */}
      <div className="hidden lg:block bg-brand-card rounded-2xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Producto</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Categoría</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Precio</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Piso 2</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Piso 7</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map(p => {
                  const cat = categories.find(c => c.id === p.category);
                  return (
                    <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-brand-border/50 hover:bg-brand-surface/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                          <span className="text-white font-medium truncate max-w-[150px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-brand-gray-500 text-xs">{cat?.name}</span>
                      </td>
                      <td className="px-4 py-3 text-brand-red font-semibold">S/ {p.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-brand-gray-400 font-medium w-6">{p.stock['kiosk-1']}</span>
                          <button 
                            onClick={() => handleQuickSale(p.id, 'kiosk-1', p.stock['kiosk-1'])}
                            disabled={p.stock['kiosk-1'] <= 0}
                            className="p-1 rounded-md bg-brand-surface border border-brand-border text-brand-gray-400 hover:text-brand-success hover:border-brand-success/50 disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-brand-gray-400 transition-all"
                            title="Venta rápida (-1)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-brand-gray-400 font-medium w-6">{p.stock['kiosk-2']}</span>
                          <button 
                            onClick={() => handleQuickSale(p.id, 'kiosk-2', p.stock['kiosk-2'])}
                            disabled={p.stock['kiosk-2'] <= 0}
                            className="p-1 rounded-md bg-brand-surface border border-brand-border text-brand-gray-400 hover:text-brand-success hover:border-brand-success/50 disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-brand-gray-400 transition-all"
                            title="Venta rápida (-1)"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StockBadge stock={p.stock} size="xs" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-brand-gray-500 hover:text-brand-red hover:bg-brand-red/10 transition-all"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-lg text-brand-gray-500 hover:text-brand-danger hover:bg-brand-danger/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-brand-gray-500 py-8 text-sm">No se encontraron productos</p>}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditProduct(null); }} title={editProduct ? 'Editar Producto' : 'Nuevo Producto'}>
        <ProductForm product={editProduct} onSubmit={handleSubmit} onCancel={() => { setShowModal(false); setEditProduct(null); }} />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Eliminación" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-brand-danger/10 flex items-center justify-center"><Trash2 className="w-6 h-6 text-brand-danger" /></div>
          <p className="text-brand-gray-400 text-sm">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-brand-border text-brand-gray-400 text-sm font-medium hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-brand-danger text-white text-sm font-semibold hover:bg-brand-danger/80 transition-colors">Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductsPage;
