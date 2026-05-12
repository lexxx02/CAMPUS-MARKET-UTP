import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ value, onChange, placeholder = 'Buscar productos...' }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-brand-gray-500" />
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-10 py-3 bg-brand-surface border border-brand-border rounded-xl text-white text-sm placeholder-brand-gray-600 focus:outline-none focus:border-brand-red/50 focus:ring-1 focus:ring-brand-red/20 transition-all duration-200"
        id="search-products"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center"
          >
            <X className="w-4 h-4 text-brand-gray-500 hover:text-white transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
