import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Home } from 'lucide-react';
import useAuthStore from '../context/useAuthStore';
import UTPLogo from '../components/UTPLogo';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand-red/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-brand-red-dark/10 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-brand-dark rounded-3xl p-8 space-y-6 border border-brand-border shadow-2xl red-accent-top">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="flex justify-center bg-white rounded-2xl p-4 mx-auto w-fit">
              <UTPLogo size="xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Panel de Administración</h1>
              <p className="text-sm text-brand-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-red/10 border border-brand-red/20 rounded-xl px-4 py-3 text-sm text-brand-red-light">
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-gray-400 mb-1.5 uppercase tracking-wider">Usuario</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-500" />
                <input id="login-username" type="text" value={username} onChange={e => { setUsername(e.target.value); clearError(); }} placeholder="admin" className="w-full pl-11 pr-4 py-3 bg-brand-surface border border-brand-border rounded-xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-gray-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-500" />
                <input id="login-password" type={showPass ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); clearError(); }} placeholder="••••••••" className="w-full pl-11 pr-11 py-3 bg-brand-surface border border-brand-border rounded-xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-gray-500 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button id="login-submit" type="submit" disabled={isLoading} className="w-full py-3 rounded-xl bg-brand-red text-white font-bold text-sm hover:bg-brand-red-light transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-red">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Ingresando...
                </span>
              ) : 'Ingresar'}
            </button>
          </form>

          {/* Botón Inicio */}
          <Link to="/" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-brand-border text-brand-gray-400 hover:text-white hover:border-brand-red/30 hover:bg-brand-surface transition-all text-sm font-medium">
            <Home className="w-4 h-4" />
            Inicio
          </Link>

          <p className="text-center text-xs text-brand-gray-600">
            Demo: usuario <span className="text-brand-red font-semibold">admin</span> / contraseña <span className="text-brand-red font-semibold">admin123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
