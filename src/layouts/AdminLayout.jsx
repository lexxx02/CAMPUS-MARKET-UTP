import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, MapPin, LogOut, Store, FileSpreadsheet, Tags } from 'lucide-react';
import UTPLogo from '../components/UTPLogo';
import useAuthStore from '../context/useAuthStore';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Productos', icon: Package },
  { path: '/admin/categories', label: 'Categorías', icon: Tags },
  { path: '/admin/reports', label: 'Reportes', icon: FileSpreadsheet },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-brand-black flex">
      {/* Sidebar – negro profundo con acento rojo */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-dark border-r border-brand-border">
        {/* Logo area con fondo blanco */}
        <div className="p-5 bg-white border-b border-gray-200">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <UTPLogo size="sm" />
            <div>
              <h1 className="text-sm font-bold text-gray-900">Campus Market</h1>
              <p className="text-[10px] text-brand-red font-medium">Panel Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-brand-red text-white shadow-red' : 'text-brand-gray-400 hover:text-white hover:bg-brand-surface'}`}>
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-border space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-brand-gray-400 hover:text-white hover:bg-brand-surface transition-all">
            <Store className="w-4 h-4" />
            Ver Tienda
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-brand-red-light hover:bg-brand-red/10 transition-all">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-brand-dark border-b border-brand-border shadow-md">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Mobile nav (just logo and logout) */}
            <div className="flex lg:hidden items-center gap-3">
              <UTPLogo size="sm" />
              <div>
                <span className="text-sm font-bold text-white leading-none block">Admin</span>
              </div>
            </div>
            
            <div className="flex lg:hidden items-center gap-2">
              <button onClick={handleLogout} className="p-2 rounded-lg text-brand-red-light bg-brand-red/10 border border-brand-red/20">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            {/* Desktop user info */}
            <div className="hidden lg:flex items-center gap-3 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.nombre}</p>
                <p className="text-[10px] text-brand-gray-500">Administrador</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold text-sm border border-brand-red/30">A</div>
            </div>
          </div>
        </header>

        <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </motion.main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-brand-red scale-110' : 'text-brand-gray-500 hover:text-white'}`}>
              <Icon className={`w-6 h-6 ${active ? 'drop-shadow-[0_0_8px_rgba(193,39,45,0.8)]' : ''}`} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminLayout;
