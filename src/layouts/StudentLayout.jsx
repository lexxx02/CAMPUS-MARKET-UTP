import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import UTPLogo from '../components/UTPLogo';

const StudentLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Header – gris medio que combina con el logo UTP */}
      <header className="sticky top-0 z-40 shadow-lg" style={{ background: 'linear-gradient(to right, #3C3C3C 0%, #2A2A2A 50%, #1A1A1A 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <UTPLogo size="sm" />
              <div className="hidden sm:block">
                <h1 className="text-sm font-bold text-white group-hover:text-brand-red-light transition-colors">Campus Market</h1>
                <p className="text-[10px] text-gray-400">Kioscos UTP</p>
              </div>
            </Link>

            <nav className="flex items-center gap-2">
              <Link to="/admin/login" className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-brand-red text-white hover:bg-brand-red-light transition-all shadow-red">
                <ShieldCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </motion.main>

      {/* Footer – gris medio que combina con el logo UTP */}
      <footer className="mt-8 shadow-inner" style={{ background: 'linear-gradient(to right, #3C3C3C 0%, #2A2A2A 50%, #1A1A1A 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UTPLogo size="sm" />
            <span className="text-xs text-gray-300 font-medium">© 2026 Campus Market – UTP</span>
          </div>
          <p className="text-xs text-gray-400">Universidad Tecnológica del Perú</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
