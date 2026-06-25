import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/40 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className={`relative w-full ${sizes[size]} admin-glass-card rounded-[24px] shadow-[0_16px_64px_rgba(0,0,0,0.1)] overflow-hidden`}
          >
            {/* Chromatic top edge */}
            <div className="absolute top-0 left-0 right-0 h-[2px] login-chromatic-edge" />

            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e0ea]/40">
              <h2 className="text-lg font-bold text-[#1a1a2e]">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#D72638]/[0.06] text-[#9a9ab0] hover:text-[#D72638] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
