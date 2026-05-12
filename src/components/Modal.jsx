import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2 }} className={`relative w-full ${sizes[size]} bg-brand-dark rounded-2xl border border-brand-border shadow-2xl overflow-hidden red-accent-top`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-surface text-brand-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
