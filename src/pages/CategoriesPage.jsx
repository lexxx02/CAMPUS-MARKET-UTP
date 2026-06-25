import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Tags } from 'lucide-react';
import toast from 'react-hot-toast';
import useProductStore from '../context/useProductStore';
import Modal from '../components/Modal';

const CategoriesPage = () => {
  const { categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '' });

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await updateCategory(editCategory.id, form);
        toast.success('Categoría actualizada');
      } else {
        await createCategory(form);
        toast.success('Categoría creada');
      }
      setShowModal(false);
      setEditCategory(null);
      setForm({ name: '', icon: '' });
    } catch {
      toast.error('Error al guardar la categoría');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory(deleteId);
      toast.success('Categoría eliminada');
      setDeleteId(null);
    } catch {
      toast.error('Error al eliminar la categoría');
    }
  };

  const openEdit = (cat) => {
    setEditCategory(cat);
    setForm({ name: cat.name, icon: cat.icon || '' });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditCategory(null);
    setForm({ name: '', icon: '' });
    setShowModal(true);
  };

  const inputClass = "admin-form-input w-full px-4 py-2.5 rounded-xl text-[#1a1a2e] text-sm placeholder-[#b0b0c0] focus:outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-[#7a7a8a] mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Gestión de Categorías</h1>
          <p className="text-[#9a9ab0] text-sm mt-1 font-medium">{categories.length} categorías registradas</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-[#E8363D] to-[#D72638] text-white font-semibold text-sm hover:shadow-[0_4px_20px_rgba(215,38,56,0.3)] transition-all">
          <Plus className="w-4 h-4" /> Nueva Categoría
        </button>
      </div>

      {/* Table */}
      <div className="admin-glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e0e0ea]/40 bg-white/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#7a7a8a] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {categories.map(cat => (
                  <motion.tr key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-[#e0e0ea]/30 hover:bg-white/30 transition-colors">
                    <td className="px-4 py-3 text-[#1a1a2e] font-semibold">{cat.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        cat.active !== false
                          ? 'bg-[#22c55e]/[0.08] text-[#16a34a] border-[#22c55e]/20'
                          : 'bg-[#dc2626]/[0.08] text-[#dc2626] border-[#dc2626]/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.active !== false ? 'bg-[#22c55e]' : 'bg-[#dc2626]'}`} />
                        {cat.active !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-[#9a9ab0] hover:text-[#D72638] hover:bg-[#D72638]/[0.06] transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded-lg text-[#9a9ab0] hover:text-[#dc2626] hover:bg-[#dc2626]/[0.06] transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {categories.length === 0 && <p className="text-center text-[#9a9ab0] py-8 text-sm">No hay categorías registradas</p>}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditCategory(null); }} title={editCategory ? 'Editar Categoría' : 'Nueva Categoría'} size="sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className={inputClass}
              placeholder="Ej: Snack"
              required
            />
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => { setShowModal(false); setEditCategory(null); }} className="flex-1 px-4 py-2.5 rounded-xl border border-[#e0e0ea]/60 text-[#7a7a8a] hover:text-[#D72638] hover:border-[#D72638]/30 transition-all text-sm font-semibold">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#E8363D] to-[#D72638] text-white font-semibold text-sm hover:shadow-[0_4px_20px_rgba(215,38,56,0.3)] transition-all">{editCategory ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Eliminación" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#dc2626]/[0.08] flex items-center justify-center"><Trash2 className="w-6 h-6 text-[#dc2626]" /></div>
          <p className="text-[#7a7a8a] text-sm">¿Estás seguro de que deseas eliminar esta categoría? Se desactivará del sistema.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-[#e0e0ea]/60 text-[#7a7a8a] text-sm font-semibold hover:text-[#1a1a2e] transition-colors">Cancelar</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#dc2626]/90 transition-colors">Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
