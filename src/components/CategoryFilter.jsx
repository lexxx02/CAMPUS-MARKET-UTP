import { motion } from 'framer-motion';

const CategoryFilter = ({ categories, selected, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
          !selected
            ? 'bg-brand-red text-white border-brand-red shadow-red'
            : 'bg-brand-surface text-brand-gray-400 border-brand-border hover:border-brand-red/30 hover:text-white'
        }`}
      >
        🏷️ Todos
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat.id === selected ? null : cat.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
            selected === cat.id
              ? 'bg-brand-red text-white border-brand-red shadow-red'
              : 'bg-brand-surface text-brand-gray-400 border-brand-border hover:border-brand-red/30 hover:text-white'
          }`}
        >
          <span>{cat.icon}</span>
          {cat.name}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
