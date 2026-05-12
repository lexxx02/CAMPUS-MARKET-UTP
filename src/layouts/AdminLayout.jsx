import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, MapPin, LogOut, Store } from 'lucide-react';
import UTPLogo from '../components/UTPLogo';
import useAuthStore from '../context/useAuthStore';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Productos', icon: Package },
  { path: '/admin/kiosks', label: 'Kioscos', icon: MapPin },
];

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
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
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-brand-dark border-b border-brand-border shadow-md">
          <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Mobile nav */}
            <div className="flex lg:hidden items-center gap-2">
              <UTPLogo size="sm" />
              <span className="text-sm font-bold text-white">Admin</span>
            </div>
            {/* Mobile links */}
            <div className="flex lg:hidden items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className={`p-2 rounded-lg transition-all ${active ? 'text-brand-red bg-brand-red/15' : 'text-brand-gray-500'}`}>
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
              <button onClick={handleLogout} className="p-2 rounded-lg text-brand-red-light">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            {/* Desktop user info */}
            <div className="hidden lg:flex items-center gap-3 ml-auto">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-[10px] text-brand-gray-500">Administrador</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red font-bold text-sm border border-brand-red/30">A</div>
            </div>
          </div>
        </header>

        <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1 p-4 sm:p-6">
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;
