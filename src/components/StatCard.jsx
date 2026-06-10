import { motion } from 'framer-motion';

const colorMap = {
  'brand-red': { 
    bg: 'bg-gradient-to-br from-brand-red/20 to-brand-red/5', 
    text: 'text-brand-red-light', 
    border: 'border-brand-red/30',
    iconBg: 'bg-brand-red/20',
    glow: 'group-hover:shadow-[0_0_25px_rgba(193,39,45,0.3)]'
  },
  'brand-success': { 
    bg: 'bg-gradient-to-br from-brand-success/20 to-brand-success/5', 
    text: 'text-brand-success', 
    border: 'border-brand-success/30',
    iconBg: 'bg-brand-success/20',
    glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]'
  },
  'brand-warning': { 
    bg: 'bg-gradient-to-br from-brand-warning/20 to-brand-warning/5', 
    text: 'text-brand-warning', 
    border: 'border-brand-warning/30',
    iconBg: 'bg-brand-warning/20',
    glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.2)]'
  },
  'brand-danger': { 
    bg: 'bg-gradient-to-br from-brand-danger/20 to-brand-danger/5', 
    text: 'text-brand-danger', 
    border: 'border-brand-danger/30',
    iconBg: 'bg-brand-danger/20',
    glow: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]'
  },
};

const StatCard = ({ title, value, icon, color = 'brand-red', subtitle, index = 0 }) => {
  const c = colorMap[color] || colorMap['brand-red'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-[24px] p-6 border ${c.border} ${c.bg} transition-all duration-300 ${c.glow} hover:-translate-y-1`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 pointer-events-none scale-150">
        {icon}
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl ${c.iconBg} flex items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-lg`}>
            {icon}
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-[36px] font-black tracking-tight text-white drop-shadow-md leading-none">{value}</p>
          <p className="text-brand-gray-300 text-xs font-semibold uppercase tracking-widest mt-2">{title}</p>
          {subtitle && <p className={`text-[11px] font-medium mt-1 ${c.text}`}>{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
