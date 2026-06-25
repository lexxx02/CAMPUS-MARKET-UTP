import { useState, useEffect } from 'react';
import useProductStore from '../context/useProductStore';

const emptyForm = { name: '', category: '', price: '', description: '', image: '', stock: { 'kiosk-1': '', 'kiosk-2': '' } };

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { categories } = useProductStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, category: product.category, price: String(product.price), description: product.description, image: product.image || '', stock: { ...product.stock } });
    } else {
      setForm({ ...emptyForm, category: categories.length > 0 ? categories[0].id : '' });
    }
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (kioskId, value) => {
    if (value === '') {
      setForm(prev => ({ ...prev, stock: { ...prev.stock, [kioskId]: '' } }));
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0) {
      setForm(prev => ({ ...prev, stock: { ...prev.stock, [kioskId]: num } }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanStock = {
      'kiosk-1': parseInt(form.stock['kiosk-1']) || 0,
      'kiosk-2': parseInt(form.stock['kiosk-2']) || 0
    };
    onSubmit({ ...form, price: parseFloat(form.price) || 0, stock: cleanStock });
  };

  const inputClass = "admin-form-input w-full px-4 py-2.5 rounded-xl text-[#1a1a2e] text-sm placeholder-[#b0b0c0] focus:outline-none transition-all";
  const labelClass = "block text-xs font-semibold text-[#7a7a8a] mb-1.5 uppercase tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Nombre del producto</label>
        <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Ej: Doritos Clásicos" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Categoría</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Precio (S/)</label>
          <input name="price" type="number" step="0.10" min="0" value={form.price} onChange={handleChange} className={inputClass} placeholder="0.00" required />
        </div>
      </div>
      <div>
        <label className={labelClass}>Descripción</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={`${inputClass} resize-none`} placeholder="Descripción breve del producto" />
      </div>
      <div>
        <label className={labelClass}>URL de Imagen</label>
        <input name="image" value={form.image} onChange={handleChange} className={inputClass} placeholder="https://..." />
      </div>
      <div>
        <label className={labelClass}>Stock por Kiosco</label>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div>
            <span className="text-xs text-[#9a9ab0] font-medium">📍 Piso 2</span>
            <input type="number" min="0" value={form.stock['kiosk-1']} onChange={e => handleStockChange('kiosk-1', e.target.value)} className={inputClass} />
          </div>
          <div>
            <span className="text-xs text-[#9a9ab0] font-medium">📍 Piso 7</span>
            <input type="number" min="0" value={form.stock['kiosk-2']} onChange={e => handleStockChange('kiosk-2', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-3">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-[#e0e0ea]/60 text-[#7a7a8a] hover:text-[#D72638] hover:border-[#D72638]/30 transition-all text-sm font-semibold">Cancelar</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-b from-[#E8363D] to-[#D72638] text-white font-semibold text-sm hover:shadow-[0_4px_20px_rgba(215,38,56,0.3)] transition-all">{product ? 'Actualizar' : 'Crear Producto'}</button>
      </div>
    </form>
  );
};

export default ProductForm;
