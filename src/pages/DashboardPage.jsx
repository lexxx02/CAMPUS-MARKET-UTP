import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, XCircle, CheckCircle, TrendingUp, Boxes } from 'lucide-react';
import useProductStore from '../context/useProductStore';
import StatCard from '../components/StatCard';
import StockBadge from '../components/StockBadge';
import { StatCardSkeleton } from '../components/Skeleton';

const DashboardPage = () => {
  const { dashboardStats, isLoading, fetchDashboardStats } = useProductStore();

  useEffect(() => { fetchDashboardStats(); }, []);

  if (isLoading || !dashboardStats) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-white">Dashboard</h1></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const { totalProducts, available, lowStock, outOfStock, totalStockUnits, salesData, criticalProducts } = dashboardStats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-brand-gray-500 text-sm mt-1">Resumen general del inventario</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Productos" value={totalProducts} icon={<Package className="w-5 h-5" />} color="brand-red" index={0} subtitle={`${totalStockUnits} unidades`} />
        <StatCard title="Disponibles" value={available} icon={<CheckCircle className="w-5 h-5" />} color="brand-success" index={1} subtitle="Stock normal" />
        <StatCard title="Bajo Stock" value={lowStock} icon={<AlertTriangle className="w-5 h-5" />} color="brand-warning" index={2} subtitle="Menos de 5 uds" />
        <StatCard title="Agotados" value={outOfStock} icon={<XCircle className="w-5 h-5" />} color="brand-danger" index={3} subtitle="Sin stock" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-card rounded-2xl border border-brand-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-brand-red" />
            <h2 className="text-sm font-semibold text-white">Más Vendidos</h2>
          </div>
          <div className="space-y-3">
            {salesData.topProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-brand-red text-white' : 'bg-brand-surface text-brand-gray-500'}`}>{i + 1}</span>
                <span className="flex-1 text-sm text-white truncate">{p.name}</span>
                <span className="text-xs text-brand-gray-500 font-medium">{p.sales} ventas</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Critical stock */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-brand-card rounded-2xl border border-brand-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Boxes className="w-4 h-4 text-brand-danger" />
            <h2 className="text-sm font-semibold text-white">Stock Crítico</h2>
          </div>
          {criticalProducts.length === 0 ? (
            <p className="text-brand-gray-500 text-sm py-4 text-center">✅ Todos los productos tienen stock suficiente</p>
          ) : (
            <div className="space-y-3">
              {criticalProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm text-white">{p.name}</p>
                      <p className="text-[10px] text-brand-gray-500">P2: {p.stock['kiosk-1']} · P7: {p.stock['kiosk-2']}</p>
                    </div>
                  </div>
                  <StockBadge stock={p.stock} size="xs" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Sales bar chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-brand-card rounded-2xl border border-brand-border p-5">
        <h2 className="text-sm font-semibold text-white mb-4">📊 Ventas de la Semana</h2>
        <div className="flex items-end gap-3 h-40">
          {salesData.daily.map((d, i) => {
            const max = Math.max(...salesData.daily.map(x => x.sales));
            const height = (d.sales / max) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-brand-gray-500">{d.sales}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 0.6, delay: 0.1 * i }} className="w-full rounded-t-lg bg-gradient-to-t from-brand-red-dark to-brand-red" />
                <span className="text-[10px] text-brand-gray-500 font-medium">{d.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
