import { motion } from 'framer-motion';

const colorMap = {
  'brand-red': { 
    text: 'text-[#7a7a8a]', 
    iconBg: 'bg-[#D72638]/[0.08]',
    iconColor: 'text-[#D72638]',
    glowColor: 'rgba(215, 38, 56, 0.06)',
  },
  'brand-success': { 
    text: 'text-[#16a34a]', 
    iconBg: 'bg-[#22c55e]/[0.08]',
    iconColor: 'text-[#22c55e]',
    glowColor: 'rgba(34, 197, 94, 0.06)',
  },
  'brand-warning': { 
    text: 'text-[#d97706]', 
    iconBg: 'bg-[#f59e0b]/[0.08]',
    iconColor: 'text-[#f59e0b]',
    glowColor: 'rgba(245, 158, 11, 0.06)',
  },
  'brand-danger': { 
    text: 'text-[#dc2626]', 
    iconBg: 'bg-[#ef4444]/[0.08]',
    iconColor: 'text-[#ef4444]',
    glowColor: 'rgba(239, 68, 68, 0.06)',
  },
};

const StatCard = ({ title, value, icon, color = 'brand-red', subtitle, index = 0 }) => {
  const c = colorMap[color] || colorMap['brand-red'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative overflow-hidden rounded-[24px] p-7 admin-glass-card transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-60"
        style={{ background: `radial-gradient(circle, ${c.glowColor}, transparent)` }}
      />

      {/* Background icon watermark */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.04] transform translate-x-4 -translate-y-4 pointer-events-none scale-150 text-[#2a2a2a]">
        {icon}
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-5">
          <div className={`w-13 h-13 rounded-[16px] ${c.iconBg} ${c.iconColor} flex items-center justify-center backdrop-blur-md transition-colors duration-300`}>
            {icon}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-[38px] font-bold tracking-tight text-[#1a1a2e] drop-shadow-sm leading-none font-sans">{value}</p>
          <p className="text-[#7a7a8a] text-[13px] font-semibold tracking-wide mt-3">{title}</p>
          {subtitle && <p className={`text-[12px] font-semibold mt-1.5 ${c.text}`}>{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
