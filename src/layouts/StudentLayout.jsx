import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin } from 'lucide-react';
import UTPLogo from '../components/UTPLogo';

const StudentLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-[#18181B] flex flex-col font-sans relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-brand-red-dark/10 via-transparent to-transparent pointer-events-none" />

      {/* Header – glassmorphism */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/70 backdrop-blur-2xl border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="bg-white p-2 rounded-xl border border-white/10 shadow-lg shadow-white/5">
                <UTPLogo size="sm" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-black text-white tracking-tight group-hover:text-brand-red-light transition-colors">Campus Market</h1>
                <p className="text-xs text-brand-gray-400 font-medium tracking-widest uppercase mt-0.5">Tienda Estudiantil</p>
              </div>
            </Link>

            <nav className="flex items-center gap-3">
              <Link to="/admin/login" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all">
                <ShieldCheck className="w-4 h-4 text-brand-red" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main */}
      <motion.main key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-brand-dark/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all bg-white p-2 rounded-lg">
              <UTPLogo size="sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">Campus Market</span>
              <span className="text-xs text-brand-gray-500">© 2026 Universidad Tecnológica del Perú</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-brand-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Sede Central</span>
            <span>•</span>
            <span>Proyecto Integrador</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
