import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Home, ArrowRight } from 'lucide-react';
import useAuthStore from '../context/useAuthStore';
import UTPLogo from '../components/UTPLogo';

const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await login(correo, contrasena);
    if (data) {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-red/10 via-[#0A0A0A] to-[#0A0A0A]" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-brand-red/20 rounded-full blur-[150px] mix-blend-screen opacity-50 animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-[#FF3D71]/10 rounded-full blur-[150px] mix-blend-screen opacity-50" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md relative z-10">
        
        {/* Main Card */}
        <div className="bg-white/[0.02] backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden">
          {/* Top Edge Glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />

          {/* Logo & Header */}
          <div className="text-center space-y-6 mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="flex justify-center bg-white p-3 rounded-2xl border border-white/20 shadow-xl shadow-brand-red/10 mx-auto w-fit">
              <UTPLogo size="lg" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">Campus Market</h1>
              <p className="text-sm text-brand-gray-400 font-medium">Panel de Administración Segura</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
              <div className="bg-brand-danger/10 border border-brand-danger/30 rounded-2xl px-4 py-3 text-sm text-[#FF6B6B] flex items-center justify-center text-center">
                {error}
              </div>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-brand-gray-400 uppercase tracking-widest pl-1">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-500 group-focus-within:text-brand-red transition-colors" />
                <input
                  id="login-correo"
                  type="text"
                  value={correo}
                  onChange={e => { setCorreo(e.target.value); clearError(); }}
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all focus:bg-black/60"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-brand-gray-400 uppercase tracking-widest pl-1">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-500 group-focus-within:text-brand-red transition-colors" />
                <input
                  id="login-contrasena"
                  type={showPass ? 'text' : 'password'}
                  value={contrasena}
                  onChange={e => { setContrasena(e.target.value); clearError(); }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/50 transition-all focus:bg-black/60"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray-500 hover:text-white transition-colors p-1 rounded-md">
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-brand-red to-[#FF3D71] text-white font-black text-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(193,39,45,0.4)] hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Ingresando...
                </span>
              ) : (
                <>
                  Ingresar al Sistema
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Links & Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
            <Link to="/" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/5 text-brand-gray-400 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all text-sm font-bold group">
              <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              Volver al inicio
            </Link>
            
            <p className="text-center text-[10px] uppercase tracking-widest text-brand-gray-600 font-medium">
              Universidad Tecnológica del Perú
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
