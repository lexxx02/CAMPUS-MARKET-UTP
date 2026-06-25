import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, MapPin, Package, User } from 'lucide-react';
import UTPLogo from '../components/UTPLogo';
import useProductStore from '../context/useProductStore';

const StudentLayout = () => {
  const { pathname } = useLocation();
  const { products } = useProductStore();

  const availableCount = products.filter(
    p => Object.values(p.stock).reduce((a, b) => a + b, 0) > 0
  ).length;

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col font-sans">
      
      {/* ─── Header: Dark / Black ─── */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <UTPLogo size="sm" />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-bold text-white tracking-tight">
                  Campus Market
                </span>
              </div>
            </Link>

            {/* Right: Available count & Admin link */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Product count */}
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#333] bg-[#222]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-xs font-semibold text-[#CCC]">
                  <span className="text-white">{availableCount}</span> productos disponibles
                </span>
              </div>
              
              {/* Admin Access */}
              <Link
                to="/admin/login"
                className="p-2 text-[#888] hover:text-white hover:bg-[#333] rounded-full transition-all"
                title="Acceso administrativo"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8"
      >
        <Outlet />
      </motion.main>

      {/* ─── Footer: Minimalist Dark ─── */}
      <footer className="bg-[#111111] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Top row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#333]">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg opacity-90">
                <UTPLogo size="sm" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">Campus Market</span>
                <span className="text-xs text-[#888] ml-2">UTP</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#888]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Lunes a Viernes: 7:00 AM – 9:00 PM
              </span>
              <span className="hidden sm:inline text-[#333]">|</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Sede Central
              </span>
              <span className="hidden sm:inline text-[#333]">|</span>
              <span className="flex items-center gap-1.5">
                <Package className="w-3 h-3" />
                Proyecto Integrador
              </span>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-center sm:text-left">
            <span className="text-xs text-[#666] w-full">
              © 2026 Universidad Tecnológica del Perú. Todos los derechos reservados.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentLayout;
