import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, MapPin, LogOut, Store, FileSpreadsheet, Tags, Search, Bell, Minus, Plus } from 'lucide-react';
import UTPLogo from '../components/UTPLogo';
import useAuthStore from '../context/useAuthStore';
import { useEffect, useRef } from 'react';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Productos', icon: Package },
  { path: '/admin/categories', label: 'Categorías', icon: Tags },
  { path: '/admin/reports', label: 'Reportes', icon: FileSpreadsheet },
];

// ── Subtle animated background for the admin area ──
const AdminBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let flowLines = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class FlowLine {
      constructor(index, total) {
        this.index = index;
        const palette = [
          { r: 215, g: 38, b: 56 },
          { r: 30, g: 100, b: 255 },
          { r: 212, g: 175, b: 55 },
          { r: 180, g: 50, b: 80 },
          { r: 70, g: 130, b: 255 },
        ];
        this.color = palette[index % palette.length];
        this.baseY = (canvas.height * 0.15) + (index / total) * (canvas.height * 0.7);
        this.amplitude = 20 + Math.random() * 40;
        this.frequency = 0.001 + Math.random() * 0.002;
        this.speed = 0.003 + Math.random() * 0.006;
        this.phase = Math.random() * Math.PI * 2;
        this.lineWidth = 0.8 + Math.random() * 1;
        this.opacity = 0.04 + Math.random() * 0.06;
      }
      draw(time) {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        const { r, g, b } = this.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.opacity * 1.3})`);
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.strokeStyle = gradient;

        for (let x = 0; x < canvas.width; x += 3) {
          const y = this.baseY +
            Math.sin(x * this.frequency + time * this.speed + this.phase) * this.amplitude +
            Math.sin(x * this.frequency * 2 + time * this.speed * 1.5) * (this.amplitude * 0.25);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    for (let i = 0; i < 6; i++) flowLines.push(new FlowLine(i, 6));

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flowLines.forEach(line => line.draw(time));
      time++;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.7 }} />;
};

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen admin-glass-bg flex font-sans relative">
      {/* Ambient light blobs */}
      <div className="fixed top-[-15%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(215,38,56,0.04)_0%,transparent_70%)] z-0 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(30,100,255,0.035)_0%,transparent_70%)] z-0 pointer-events-none" />
      <div className="fixed top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.025)_0%,transparent_70%)] z-0 pointer-events-none" />

      {/* Animated Canvas */}
      <AdminBackground />

      {/* Sidebar – Glassmorphism Light */}
      <aside className="hidden lg:flex flex-col w-[280px] admin-sidebar fixed inset-y-0 left-0 z-40">
        {/* Chromatic edge right */}
        <div className="absolute top-0 right-0 bottom-0 w-[1px] login-chromatic-edge-vertical" />

        {/* Logo area */}
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="admin-logo-box bg-white p-2 rounded-xl shadow-[0_4px_16px_rgba(215,38,56,0.1)]">
              <UTPLogo size="sm" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#2a2a2a] tracking-wide">Campus <span className="login-text-gradient">Market</span></h1>
              <p className="text-[10px] text-[#D72638] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  active
                    ? 'admin-nav-active bg-[#D72638]/[0.08] text-[#D72638] shadow-[0_0_20px_rgba(215,38,56,0.06)] border border-[#D72638]/15'
                    : 'text-[#7a7a8a] hover:text-[#2a2a2a] hover:bg-white/40 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#D72638]' : ''}`} strokeWidth={active ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#e0e0ea]/40 space-y-2">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-[#7a7a8a] hover:text-[#2a2a2a] hover:bg-white/40 transition-all duration-300 font-medium">
            <Store className="w-5 h-5" strokeWidth={2} />
            Ver Tienda
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-[#D72638] hover:bg-[#D72638]/[0.06] transition-all duration-300 group font-semibold">
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen pb-20 lg:pb-0 lg:ml-[280px] relative z-10 overflow-hidden">
        {/* Top bar – Glass */}
        <header className="sticky top-0 z-40 admin-header">
          <div className="px-6 lg:px-10 h-20 flex items-center justify-between">
            {/* Mobile nav (just logo and logout) */}
            <div className="flex lg:hidden items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <UTPLogo size="sm" />
              </div>
              <div>
                <span className="text-sm font-bold text-[#2a2a2a] leading-none block">Admin</span>
              </div>
            </div>
            
            <div className="flex lg:hidden items-center gap-2">
              <button onClick={handleLogout} className="p-2.5 rounded-xl text-[#D72638] bg-[#D72638]/[0.08] border border-[#D72638]/15">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            
            {/* Desktop user info */}
            <div className="hidden lg:flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#2a2a2a] tracking-wide">{user?.nombre || 'Administrador'}</p>
                  <p className="text-[11px] text-[#9a9ab0] font-medium">Gestor de Kioscos</p>
                </div>
                <div className="w-11 h-11 rounded-2xl admin-avatar flex items-center justify-center shadow-lg relative overflow-hidden group cursor-pointer">
                  <span className="text-[#D72638] font-bold text-sm tracking-widest relative z-10">{user?.nombre?.charAt(0) || 'A'}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <motion.main key={pathname} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="flex-1 p-6 lg:p-10">
          <Outlet />
        </motion.main>
      </div>

      {/* Mobile Bottom Navigation – Glass */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 admin-mobile-nav px-6 py-4 flex items-center justify-between">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-[#D72638] scale-110' : 'text-[#9a9ab0] hover:text-[#2a2a2a]'}`}>
              <Icon className={`w-6 h-6 ${active ? 'drop-shadow-[0_0_8px_rgba(215,38,56,0.4)]' : ''}`} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-bold tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminLayout;
