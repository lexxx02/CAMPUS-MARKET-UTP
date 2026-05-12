import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const KioskSelector = ({ kiosks, selected, onSelect }) => {
  return (
    <div className="flex gap-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
          !selected
            ? 'bg-brand-red/15 text-brand-red-light border-brand-red/30'
            : 'bg-brand-surface text-brand-gray-400 border-brand-border hover:border-brand-red/20'
        }`}
      >
        <MapPin className="w-3.5 h-3.5" />
        Todos
      </motion.button>
      {kiosks.map((kiosk) => (
        <motion.button
          key={kiosk.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(kiosk.id === selected ? null : kiosk.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
            selected === kiosk.id
              ? 'bg-brand-red/15 text-brand-red-light border-brand-red/30'
              : 'bg-brand-surface text-brand-gray-400 border-brand-border hover:border-brand-red/20'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Piso {kiosk.floor}
        </motion.button>
      ))}
    </div>
  );
};

export default KioskSelector;
