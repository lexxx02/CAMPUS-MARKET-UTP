import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, XCircle, CheckCircle, ArrowRight, Store, AlertOctagon } from 'lucide-react';
import useProductStore from '../context/useProductStore';
import StatCard from '../components/StatCard';
import { StatCardSkeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { dashboardStats, isLoading, fetchDashboardStats } = useProductStore();

  useEffect(() => { fetchDashboardStats(); }, []);

  if (isLoading || !dashboardStats) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-3xl font-black text-white tracking-tight">Visión General</h1></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const { totalProducts, available, lowStock, outOfStock, totalStockUnits, criticalProducts } = dashboardStats;

  // Function to explicitly list issues for a product
  const getIssues = (p) => {
    const issues = [];
    if (p.stock['kiosk-1'] === 0) issues.push({ kiosk: 'Piso 2', text: 'Agotado', color: 'text-brand-danger', bg: 'bg-brand-danger/10 border-brand-danger/20' });
    else if (p.stock['kiosk-1'] < 5) issues.push({ kiosk: 'Piso 2', text: `Quedan ${p.stock['kiosk-1']}`, color: 'text-brand-warning', bg: 'bg-brand-warning/10 border-brand-warning/20' });
    
    if (p.stock['kiosk-2'] === 0) issues.push({ kiosk: 'Piso 7', text: 'Agotado', color: 'text-brand-danger', bg: 'bg-brand-danger/10 border-brand-danger/20' });
    else if (p.stock['kiosk-2'] < 5) issues.push({ kiosk: 'Piso 7', text: `Quedan ${p.stock['kiosk-2']}`, color: 'text-brand-warning', bg: 'bg-brand-warning/10 border-brand-warning/20' });
    return issues;
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Visión General</h1>
        <p className="text-brand-gray-400 text-sm mt-2">Control en tiempo real de tu inventario en ambos kioscos.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Productos" value={totalProducts} icon={<Package className="w-6 h-6" />} color="brand-red" index={0} subtitle={`${totalStockUnits} unidades en total`} />
        <StatCard title="Disponibles" value={available} icon={<CheckCircle className="w-6 h-6" />} color="brand-success" index={1} subtitle="Stock saludable" />
        <StatCard title="Bajo Stock" value={lowStock} icon={<AlertTriangle className="w-6 h-6" />} color="brand-warning" index={2} subtitle="< 5 unidades" />
        <StatCard title="Agotados" value={outOfStock} icon={<XCircle className="w-6 h-6" />} color="brand-danger" index={3} subtitle="Requieren reposición" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Izquierdo: Alertas Urgentes (Ocupa 2 columnas) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-gradient-to-b from-brand-card to-brand-black rounded-[24px] border border-white/5 p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-danger/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-danger/10 flex items-center justify-center border border-brand-danger/20">
                <AlertOctagon className="w-5 h-5 text-brand-danger animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Centro de Alertas</h2>
                <p className="text-xs text-brand-gray-400">Atención requerida para evitar quiebres de stock</p>
              </div>
            </div>
            <Link to="/admin/products" className="text-sm text-brand-red hover:text-brand-red-light font-semibold flex items-center gap-1 transition-colors">
              Ver inventario <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {(!criticalProducts || criticalProducts.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
              <div className="w-16 h-16 bg-brand-success/10 rounded-full flex items-center justify-center mb-4 border border-brand-success/20">
                <CheckCircle className="w-8 h-8 text-brand-success" />
              </div>
              <h3 className="text-white font-semibold text-lg">Todo bajo control</h3>
              <p className="text-brand-gray-500 text-sm mt-1">No hay alertas de stock en ningún kiosco.</p>
            </div>
          ) : (
            <div className="space-y-3 relative z-10">
              {criticalProducts.map(p => {
                const issues = getIssues(p);
                return (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors gap-4">
                    <div className="flex items-center gap-4">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-brand-surface flex items-center justify-center border border-white/10 text-brand-gray-500">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="text-base font-bold text-white">{p.name}</p>
                        <p className="text-xs text-brand-gray-500">{p.categoryName || 'General'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {issues.map((issue, idx) => (
                        <div key={idx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${issue.bg}`}>
                          <Store className={`w-3.5 h-3.5 ${issue.color}`} />
                          <span className="text-[11px] font-bold text-white uppercase tracking-wider">{issue.kiosk}:</span>
                          <span className={`text-[11px] font-bold ${issue.color} uppercase tracking-wider`}>{issue.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Panel Derecho: Resumen Rápido por Kiosco */}
        <div className="space-y-6">
          {['kiosk-1', 'kiosk-2'].map((kioskId, index) => {
            const floorName = kioskId === 'kiosk-1' ? 'Piso 2' : 'Piso 7';
            const kioskCritical = criticalProducts ? criticalProducts.filter(p => p.stock[kioskId] < 5).slice(0, 4) : [];
            
            return (
              <motion.div key={kioskId} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + (index * 0.1) }} className="bg-gradient-to-b from-brand-card to-brand-black rounded-[24px] border border-white/5 p-4 sm:p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-surface border border-white/10 flex items-center justify-center">
                    <Store className="w-5 h-5 text-brand-gray-400" />
                  </div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Kiosco {floorName}</h2>
                </div>
                
                <div className="space-y-3">
                  {kioskCritical.length > 0 ? kioskCritical.map(p => (
                    <div key={p.id} className="flex items-center justify-between group">
                      <span className="text-sm text-brand-gray-300 truncate pr-4 group-hover:text-white transition-colors">{p.name}</span>
                      <span className={`text-sm font-black px-2.5 py-1 rounded-md ${p.stock[kioskId] === 0 ? 'bg-brand-danger/20 text-brand-danger' : 'bg-brand-warning/20 text-brand-warning'}`}>
                        {p.stock[kioskId]}
                      </span>
                    </div>
                  )) : (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-success/10 border border-brand-success/20">
                      <CheckCircle className="w-4 h-4 text-brand-success" />
                      <span className="text-xs font-semibold text-brand-success uppercase tracking-wider">Operación Normal</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
