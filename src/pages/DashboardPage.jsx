import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, XCircle, CheckCircle, ArrowRight, Store, AlertOctagon } from 'lucide-react';
import useProductStore from '../context/useProductStore';
import StatCard from '../components/StatCard';
import { StatCardSkeleton } from '../components/Skeleton';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList, Label } from 'recharts';

// ── Custom glass tooltip for Recharts ──
const GlassTooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(16px)',
  borderColor: 'rgba(224,224,234,0.5)',
  borderRadius: '16px',
  color: '#1a1a2e',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  fontSize: '13px',
  fontWeight: '500',
};

const DashboardPage = () => {
  const { dashboardStats, products, categories, isLoading, fetchDashboardStats, fetchProducts, fetchCategories } = useProductStore();

  useEffect(() => { 
    fetchDashboardStats(); 
    fetchProducts();
    fetchCategories();
  }, []);

  if (isLoading || !dashboardStats) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Visión General</h1></div>
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
    if (p.stock['kiosk-1'] === 0) issues.push({ kiosk: 'Piso 2', text: 'Agotado', color: 'text-[#dc2626]', bg: 'bg-[#dc2626]/[0.06] border-[#dc2626]/15' });
    else if (p.stock['kiosk-1'] < 5) issues.push({ kiosk: 'Piso 2', text: `Quedan ${p.stock['kiosk-1']}`, color: 'text-[#d97706]', bg: 'bg-[#f59e0b]/[0.06] border-[#f59e0b]/15' });
    
    if (p.stock['kiosk-2'] === 0) issues.push({ kiosk: 'Piso 7', text: 'Agotado', color: 'text-[#dc2626]', bg: 'bg-[#dc2626]/[0.06] border-[#dc2626]/15' });
    else if (p.stock['kiosk-2'] < 5) issues.push({ kiosk: 'Piso 7', text: `Quedan ${p.stock['kiosk-2']}`, color: 'text-[#d97706]', bg: 'bg-[#f59e0b]/[0.06] border-[#f59e0b]/15' });
    return issues;
  };

  // ─── Chart Data Computation ───
  const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];
  const pieData = [
    { name: 'Saludable', value: available },
    { name: 'Bajo Stock', value: lowStock },
    { name: 'Agotados', value: outOfStock }
  ];

  const catData = categories.map(cat => {
    const prods = products.filter(p => p.category === cat.id);
    const total = prods.reduce((sum, p) => sum + Object.values(p.stock).reduce((a, b) => a + b, 0), 0);
    return { name: cat.name, unidades: total };
  }).filter(c => c.unidades > 0).sort((a, b) => b.unidades - a.unidades);

  const k1Total = products.reduce((sum, p) => sum + (p.stock['kiosk-1'] || 0), 0);
  const k2Total = products.reduce((sum, p) => sum + (p.stock['kiosk-2'] || 0), 0);
  const kioskData = [
    { name: 'Kiosco Piso 2', unidades: k1Total, fill: '#D72638' },
    { name: 'Kiosco Piso 7', unidades: k2Total, fill: '#6366f1' }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Visión General</h1>
        <p className="text-[#9a9ab0] text-sm mt-2 font-medium">Control en tiempo real de tu inventario en ambos kioscos.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Productos" value={totalProducts} icon={<Package className="w-6 h-6" />} color="brand-red" index={0} subtitle={`${totalStockUnits} unidades en total`} />
        <StatCard title="Disponibles" value={available} icon={<CheckCircle className="w-6 h-6" />} color="brand-success" index={1} subtitle="Stock saludable" />
        <StatCard title="Bajo Stock" value={lowStock} icon={<AlertTriangle className="w-6 h-6" />} color="brand-warning" index={2} subtitle="< 5 unidades" />
        <StatCard title="Agotados" value={outOfStock} icon={<XCircle className="w-6 h-6" />} color="brand-danger" index={3} subtitle="Requieren reposición" />
      </div>

      <div className="w-full">
        {/* Panel Central: Alertas Urgentes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="admin-glass-card rounded-[24px] p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle danger ambient glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(circle,rgba(239,68,68,0.04)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[20px] bg-[#ef4444]/[0.08] flex items-center justify-center">
                <AlertOctagon className="w-6 h-6 text-[#ef4444] animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#1a1a2e]">Centro de Alertas</h2>
                <p className="text-sm text-[#9a9ab0] mt-1 font-medium">Atención requerida para evitar quiebres de stock</p>
              </div>
            </div>
            <Link to="/admin/products" className="px-5 py-2.5 rounded-xl bg-white/60 hover:bg-white/80 text-sm text-[#7a7a8a] hover:text-[#D72638] font-semibold flex items-center gap-2 transition-all duration-300 border border-[#e0e0ea]/40 backdrop-blur-sm">
              Ver inventario <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {(!criticalProducts || criticalProducts.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
              <div className="w-16 h-16 bg-[#22c55e]/[0.08] rounded-full flex items-center justify-center mb-4 border border-[#22c55e]/15">
                <CheckCircle className="w-8 h-8 text-[#22c55e]" />
              </div>
              <h3 className="text-[#1a1a2e] font-semibold text-lg">Todo bajo control</h3>
              <p className="text-[#9a9ab0] text-sm mt-1">No hay alertas de stock en ningún kiosco.</p>
            </div>
          ) : (
            <div className="space-y-3 relative z-10">
              {criticalProducts.map(p => {
                const issues = getIssues(p);
                return (
                  <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[20px] bg-white/40 backdrop-blur-sm border border-[#e0e0ea]/40 hover:bg-white/60 transition-all gap-6 shadow-sm">
                    <div className="flex items-center gap-5">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-14 h-14 rounded-2xl object-cover shadow-md border border-white/50" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-[#f5f5f7] flex items-center justify-center text-[#9a9ab0] shadow-md">
                          <Package className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <p className="text-base font-bold text-[#1a1a2e] tracking-wide">{p.name}</p>
                        <p className="text-sm text-[#9a9ab0] mt-0.5 font-medium">{p.categoryName || 'General'}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {issues.map((issue, idx) => (
                        <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm ${issue.bg}`}>
                          {issue.text === 'Agotado' ? <XCircle className={`w-4 h-4 ${issue.color}`} /> : <AlertTriangle className={`w-4 h-4 ${issue.color}`} />}
                          <span className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">{issue.kiosk}:</span>
                          <span className={`text-xs font-black ${issue.color} uppercase tracking-wider`}>{issue.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── CHARTS SECTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Pie Chart: Salud del Catálogo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="admin-glass-card rounded-[24px] p-8">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-8">Salud del Catálogo</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                  <Label
                    value={totalProducts}
                    position="center"
                    fill="#1a1a2e"
                    style={{ fontSize: '42px', fontWeight: 'bold', fontFamily: 'sans-serif' }}
                  />
                </Pie>
                <Tooltip contentStyle={GlassTooltipStyle} itemStyle={{ color: '#1a1a2e', fontWeight: '500' }} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '13px', color: '#7a7a8a', fontWeight: '500' }} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart: Categorías */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="admin-glass-card rounded-[24px] p-8">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-8">Distribución por Categorías</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} layout="vertical" margin={{ top: 0, right: 40, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#7a7a8a" fontSize={13} fontWeight={500} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{ fill: 'rgba(215,38,56,0.03)' }}
                  contentStyle={GlassTooltipStyle}
                />
                <Bar dataKey="unidades" fill="#D72638" radius={[0, 8, 8, 0]} barSize={32}>
                  <LabelList dataKey="unidades" position="right" fill="#7a7a8a" fontSize={13} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart: Kioscos */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="admin-glass-card rounded-[24px] p-8">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-8">Comparativa de Kioscos</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kioskData} margin={{ top: 30, right: 30, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" stroke="#7a7a8a" fontSize={13} fontWeight={500} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(215,38,56,0.03)' }}
                  contentStyle={GlassTooltipStyle}
                />
                <Bar dataKey="unidades" radius={[8, 8, 0, 0]} barSize={48}>
                  {kioskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="unidades" position="top" fill="#7a7a8a" fontSize={14} fontWeight="bold" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
