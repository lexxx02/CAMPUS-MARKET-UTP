import { motion } from 'framer-motion';

const colorMap = {
  'brand-red': { bg: 'bg-brand-red/10', text: 'text-brand-red', border: 'border-brand-red/20' },
  'brand-success': { bg: 'bg-brand-success/10', text: 'text-brand-success', border: 'border-brand-success/20' },
  'brand-warning': { bg: 'bg-brand-warning/10', text: 'text-brand-warning', border: 'border-brand-warning/20' },
  'brand-danger': { bg: 'bg-brand-danger/10', text: 'text-brand-danger', border: 'border-brand-danger/20' },
};

const StatCard = ({ title, value, icon, color = 'brand-red', subtitle, index = 0 }) => {
  const c = colorMap[color] || colorMap['brand-red'];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`bg-brand-card rounded-2xl p-5 border ${c.border} hover:scale-[1.02] transition-transform duration-200`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-brand-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
          <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
          {subtitle && <p className="text-brand-gray-500 text-xs">{subtitle}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center text-lg`}>{icon}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
