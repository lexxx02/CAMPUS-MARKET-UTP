import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, Home, ArrowRight, Shield } from 'lucide-react';
import useAuthStore from '../context/useAuthStore';
import UTPLogo from '../components/UTPLogo';

// ============================================================
// Animated Background Canvas – Flowing data lines & light waves
// ============================================================
const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let flowLines = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create flowing light particles
    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.1;
        const colors = [
          'rgba(215, 38, 56, ',    // UTP Red
          'rgba(30, 100, 255, ',    // Electric Blue
          'rgba(212, 175, 55, ',    // Gold
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        const fadeRatio = this.life / this.maxLife;
        const alpha = this.opacity * fadeRatio;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + alpha + ')';
        ctx.fill();
      }
    }

    // Create flowing sine wave lines
    class FlowLine {
      constructor(index, total) {
        this.index = index;
        this.total = total;
        const palette = [
          { r: 215, g: 38, b: 56 },   // UTP Red
          { r: 30, g: 100, b: 255 },   // Electric Blue
          { r: 212, g: 175, b: 55 },   // Gold
          { r: 180, g: 50, b: 80 },    // Deep rose
          { r: 70, g: 130, b: 255 },   // Lighter blue
        ];
        this.color = palette[index % palette.length];
        this.baseY = (canvas.height * 0.3) + (index / total) * (canvas.height * 0.4);
        this.amplitude = 30 + Math.random() * 50;
        this.frequency = 0.002 + Math.random() * 0.003;
        this.speed = 0.005 + Math.random() * 0.01;
        this.phase = Math.random() * Math.PI * 2;
        this.lineWidth = 1 + Math.random() * 1.5;
        this.opacity = 0.08 + Math.random() * 0.12;
      }
      draw(time) {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        const { r, g, b } = this.color;
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
        gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${this.opacity * 1.5})`);
        gradient.addColorStop(0.8, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.strokeStyle = gradient;

        for (let x = 0; x < canvas.width; x += 2) {
          const y = this.baseY +
            Math.sin(x * this.frequency + time * this.speed + this.phase) * this.amplitude +
            Math.sin(x * this.frequency * 2.5 + time * this.speed * 1.3) * (this.amplitude * 0.3);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }

    // Initialize
    for (let i = 0; i < 60; i++) particles.push(new Particle());
    for (let i = 0; i < 8; i++) flowLines.push(new FlowLine(i, 8));

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw flow lines
      flowLines.forEach(line => line.draw(time));

      // Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      time++;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0"
      style={{ opacity: 0.9 }}
    />
  );
};

// ============================================================
// LoginPage – Premium Glassmorphism Redesign
// ============================================================
const LoginPage = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
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
    <div className="login-premium-page min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Luminous White Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9ff] via-[#ffffff] to-[#f5f0eb] z-0" />

      {/* Soft ambient light blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(215,38,56,0.06)_0%,transparent_70%)] z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(30,100,255,0.05)_0%,transparent_70%)] z-0" />
      <div className="absolute top-[30%] right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] z-0" />

      {/* Animated Canvas Background */}
      <AnimatedBackground />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Glass Card Container */}
        <div className="login-glass-card relative rounded-[28px] p-8 sm:p-10 overflow-hidden">
          {/* Chromatic refraction edge – top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] login-chromatic-edge" />
          {/* Chromatic refraction edge – left */}
          <div className="absolute top-0 left-0 bottom-0 w-[2px] login-chromatic-edge-vertical" />
          {/* Chromatic refraction edge – right */}
          <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
          {/* Bottom subtle reflection */}
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Inner light reflection overlay */}
          <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none rounded-t-[28px]" />

          {/* ===== LOGO SECTION ===== */}
          <div className="text-center space-y-5 mb-8 relative z-10">
            <motion.div
              initial={{ scale: 0, rotateY: -180 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 120 }}
              className="relative mx-auto w-fit"
            >
              {/* 3D Metallic logo container */}
              <div className="login-logo-container relative bg-white rounded-2xl p-4 shadow-[0_8px_32px_rgba(215,38,56,0.15),0_2px_8px_rgba(0,0,0,0.08)]">
                {/* Metallic sheen overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-80" />
                <div className="absolute inset-0 rounded-2xl login-metallic-sheen pointer-events-none" />
                <div className="relative z-10">
                  <UTPLogo size="lg" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">
                <span className="text-[#2a2a2a]">Campus</span>
                <span className="login-text-gradient ml-1">Market</span>
              </h1>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8a8a9a] mt-1.5 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#aaa]" />
                Panel de Administración Segura
              </p>
            </motion.div>
          </div>

          {/* ===== ERROR MESSAGE ===== */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl px-4 py-3 text-sm text-red-600 flex items-center justify-center text-center font-medium">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== LOGIN FORM ===== */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#7a7a8a] uppercase tracking-[0.15em] pl-1">
                Correo Electrónico
              </label>
              <div className={`relative group login-input-wrapper ${emailFocused ? 'focused' : ''}`}>
                <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${emailFocused ? 'login-input-glow' : ''}`} />
                <div className="relative flex items-center">
                  <Mail className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${emailFocused ? 'text-[#D72638]' : 'text-[#b0b0c0]'}`} />
                  <input
                    id="login-correo"
                    type="text"
                    value={correo}
                    onChange={e => { setCorreo(e.target.value); clearError(); }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    placeholder="admin"
                    className="login-input w-full pl-12 pr-4 py-4 rounded-2xl text-[#1a1a2e] text-sm font-medium placeholder-[#c0c0cc] focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#7a7a8a] uppercase tracking-[0.15em] pl-1">
                Contraseña
              </label>
              <div className={`relative group login-input-wrapper ${passwordFocused ? 'focused' : ''}`}>
                <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${passwordFocused ? 'login-input-glow' : ''}`} />
                <div className="relative flex items-center">
                  <Lock className={`absolute left-4 w-[18px] h-[18px] transition-colors duration-300 ${passwordFocused ? 'text-[#D72638]' : 'text-[#b0b0c0]'}`} />
                  <input
                    id="login-contrasena"
                    type={showPass ? 'text' : 'password'}
                    value={contrasena}
                    onChange={e => { setContrasena(e.target.value); clearError(); }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    placeholder="••••••••"
                    className="login-input w-full pl-12 pr-14 py-4 rounded-2xl text-[#1a1a2e] text-sm font-medium placeholder-[#c0c0cc] focus:outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 p-1 rounded-lg text-[#b0b0c0] hover:text-[#D72638] transition-colors duration-200"
                  >
                    {showPass ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>
            </div>

            {/* ===== SUBMIT BUTTON – 3D Volumetric ===== */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02, y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="login-submit-btn w-full py-4 mt-3 rounded-2xl text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
            >
              {/* Pulsing inner glow */}
              <div className="absolute inset-0 login-btn-pulse pointer-events-none" />
              {/* Satin highlight on top */}
              <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/25 to-transparent rounded-t-2xl pointer-events-none" />

              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Ingresando...
                  </span>
                ) : (
                  <>
                    Ingresar al Sistema
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* ===== FOOTER ===== */}
          <div className="mt-8 pt-6 border-t border-[#e0e0ea]/50 space-y-4 relative z-10">
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#e0e0ea]/60 text-[#9a9ab0] hover:text-[#D72638] hover:border-[#D72638]/30 hover:bg-[#D72638]/[0.03] transition-all duration-300 text-sm font-bold group login-back-link"
            >
              <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
              <span className="login-silver-text">Volver al Inicio</span>
            </Link>

            <p className="text-center text-[10px] uppercase tracking-[0.2em] font-semibold login-silver-text-subtle">
              Universidad Tecnológica del Perú
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
