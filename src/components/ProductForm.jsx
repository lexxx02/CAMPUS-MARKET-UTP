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

  const inputClass = "w-full px-4 py-2.5 bg-brand-surface border border-brand-border rounded-xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all";
  const labelClass = "block text-xs font-medium text-brand-gray-400 mb-1.5 uppercase tracking-wider";

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
            <span className="text-xs text-brand-gray-500">📍 Piso 2</span>
            <input type="number" min="0" value={form.stock['kiosk-1']} onChange={e => handleStockChange('kiosk-1', e.target.value)} className={inputClass} />
          </div>
          <div>
            <span className="text-xs text-brand-gray-500">📍 Piso 7</span>
            <input type="number" min="0" value={form.stock['kiosk-2']} onChange={e => handleStockChange('kiosk-2', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>
      <div className="flex gap-3 pt-3">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-brand-border text-brand-gray-400 hover:text-white hover:border-brand-red/30 transition-all text-sm font-medium">Cancelar</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-brand-red text-white font-semibold text-sm hover:bg-brand-red-light transition-colors shadow-red">{product ? 'Actualizar' : 'Crear Producto'}</button>
      </div>
    </form>
  );
};

export default ProductForm;
