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

  const inputClass = "w-full px-4 py-2.5 bg-brand-surface border border-brand-border rounded-xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all";
  const labelClass = "block text-xs font-medium text-brand-gray-400 mb-1.5 uppercase tracking-wider";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Categorías</h1>
          <p className="text-brand-gray-500 text-sm mt-1">{categories.length} categorías registradas</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-red text-white font-semibold text-sm hover:bg-brand-red-light transition-colors shadow-red">
          <Plus className="w-4 h-4" /> Nueva Categoría
        </button>
      </div>

      {/* Table */}
      <div className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Nombre</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Estado</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-brand-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {categories.map(cat => (
                  <motion.tr key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-b border-brand-border/50 hover:bg-brand-surface/50 transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{cat.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        cat.active !== false
                          ? 'bg-brand-success/15 text-brand-success border-brand-success/25'
                          : 'bg-brand-danger/15 text-brand-danger border-brand-danger/25'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.active !== false ? 'bg-brand-success' : 'bg-brand-danger'}`} />
                        {cat.active !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg text-brand-gray-500 hover:text-brand-red hover:bg-brand-red/10 transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(cat.id)} className="p-1.5 rounded-lg text-brand-gray-500 hover:text-brand-danger hover:bg-brand-danger/10 transition-all">
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
        {categories.length === 0 && <p className="text-center text-brand-gray-500 py-8 text-sm">No hay categorías registradas</p>}
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
            <button type="button" onClick={() => { setShowModal(false); setEditCategory(null); }} className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-brand-gray-400 hover:text-white hover:border-brand-red/30 transition-all text-sm font-medium">Cancelar</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-brand-red text-white font-semibold text-sm hover:bg-brand-red-light transition-colors shadow-red">{editCategory ? 'Actualizar' : 'Crear'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Eliminación" size="sm">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-brand-danger/10 flex items-center justify-center"><Trash2 className="w-6 h-6 text-brand-danger" /></div>
          <p className="text-brand-gray-400 text-sm">¿Estás seguro de que deseas eliminar esta categoría? Se desactivará del sistema.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-brand-border text-brand-gray-400 text-sm font-medium hover:text-white transition-colors">Cancelar</button>
            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-brand-danger text-white text-sm font-semibold hover:bg-brand-danger/80 transition-colors">Eliminar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
