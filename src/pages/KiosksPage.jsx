import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Package, AlertTriangle, XCircle } from 'lucide-react';
import useProductStore from '../context/useProductStore';
import StockBadge from '../components/StockBadge';
import { CATEGORIES } from '../data/mockData';

const KiosksPage = () => {
  const { products, kiosks, isLoading, fetchProducts, fetchKiosks } = useProductStore();
  const [selectedKiosk, setSelectedKiosk] = useState('kiosk-1');

  useEffect(() => { fetchProducts(); fetchKiosks(); }, []);

  const kioskProducts = products.map(p => ({
    ...p,
    kioskStock: p.stock[selectedKiosk] || 0,
  }));

  const available = kioskProducts.filter(p => p.kioskStock >= 5).length;
  const low = kioskProducts.filter(p => p.kioskStock > 0 && p.kioskStock < 5).length;
  const out = kioskProducts.filter(p => p.kioskStock === 0).length;

  const currentKiosk = kiosks.find(k => k.id === selectedKiosk);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Gestión por Kiosco</h1>
        <p className="text-brand-gray-500 text-sm mt-1">Inventario por ubicación</p>
      </div>

      {/* Kiosk Selector */}
      <div className="flex gap-3">
        {kiosks.map(k => (
          <motion.button key={k.id} whileTap={{ scale: 0.97 }} onClick={() => setSelectedKiosk(k.id)}
            className={`flex-1 flex items-center gap-3 p-4 rounded-2xl border transition-all ${selectedKiosk === k.id ? 'bg-brand-red/10 border-brand-red/30 shadow-glow' : 'bg-brand-card border-brand-border hover:border-brand-red/20'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedKiosk === k.id ? 'bg-brand-red text-white' : 'bg-brand-surface text-brand-gray-500'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className={`text-sm font-semibold ${selectedKiosk === k.id ? 'text-brand-red' : 'text-white'}`}>{k.name}</p>
              <p className="text-[10px] text-brand-gray-500">{k.location}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-brand-card rounded-xl p-4 border border-brand-success/20 text-center">
          <Package className="w-5 h-5 text-brand-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-brand-success">{available}</p>
          <p className="text-[10px] text-brand-gray-500">Disponibles</p>
        </div>
        <div className="bg-brand-card rounded-xl p-4 border border-brand-warning/20 text-center">
          <AlertTriangle className="w-5 h-5 text-brand-warning mx-auto mb-1" />
          <p className="text-2xl font-bold text-brand-warning">{low}</p>
          <p className="text-[10px] text-brand-gray-500">Bajo Stock</p>
        </div>
        <div className="bg-brand-card rounded-xl p-4 border border-brand-danger/20 text-center">
          <XCircle className="w-5 h-5 text-brand-danger mx-auto mb-1" />
          <p className="text-2xl font-bold text-brand-danger">{out}</p>
          <p className="text-[10px] text-brand-gray-500">Agotados</p>
        </div>
      </div>

      {/* Product list */}
      <div className="bg-brand-card rounded-2xl border border-brand-border overflow-hidden">
        <div className="px-4 py-3 border-b border-brand-border bg-brand-surface/50">
          <h2 className="text-sm font-semibold text-white">Inventario – {currentKiosk?.name}</h2>
        </div>
        <div className="divide-y divide-brand-border/50">
          {kioskProducts.sort((a, b) => a.kioskStock - b.kioskStock).map(p => {
            const cat = CATEGORIES.find(c => c.id === p.category);
            return (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center justify-between px-4 py-3 hover:bg-brand-surface/50 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm text-white font-medium">{p.name}</p>
                    <p className="text-[10px] text-brand-gray-500">{cat?.icon} {cat?.name} · S/ {p.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white">{p.kioskStock}</span>
                  <StockBadge stock={p.stock} kioskId={selectedKiosk} size="xs" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KiosksPage;
