import { motion } from 'framer-motion';
import StockBadge from './StockBadge';
import useProductStore from '../context/useProductStore';
import { Store } from 'lucide-react';

const ProductCard = ({ product, index = 0 }) => {
  const { categories } = useProductStore();
  const category = categories.find(c => c.id === product.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-gradient-to-b from-brand-surface to-brand-black rounded-[24px] overflow-hidden border border-white/5 hover:border-brand-red/40 transition-all duration-300 shadow-xl hover:shadow-brand-red/10 relative flex flex-col h-full"
    >
      {/* Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/0 via-brand-red/0 to-brand-red/0 group-hover:from-brand-red/5 group-hover:to-transparent transition-colors duration-500 pointer-events-none" />

      {/* Image Container */}
      <div className="relative h-48 shrink-0 overflow-hidden rounded-t-[24px]">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          loading="lazy" 
        />
        {/* Gradients to blend image with card */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent opacity-60" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-white/10 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
            {category?.name || 'Categoría'}
          </span>
        </div>

        {/* Popular badge */}
        {product.popular && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-xl bg-brand-red text-white text-[10px] font-bold shadow-[0_0_15px_rgba(193,39,45,0.5)] uppercase tracking-wider">
              🔥 Hot
            </span>
          </div>
        )}

        {/* Title and Price inside the image area (bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-3">
          <div className="flex justify-between items-end gap-3">
            <h3 className="font-bold text-white text-lg leading-tight line-clamp-2 drop-shadow-md group-hover:text-brand-red-light transition-colors">
              {product.name}
            </h3>
            <div className="shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl shadow-lg">
              <span className="text-lg font-black text-brand-red-light drop-shadow-lg">
                S/ {product.price.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2 space-y-4 relative z-10 flex-1 flex flex-col">
        <p className="text-brand-gray-400 text-[11px] line-clamp-2 leading-relaxed min-h-[32px]">
          {product.description || 'Sin descripción detallada.'}
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-border to-transparent opacity-50 my-auto" />

        {/* Stock per kiosk */}
        <div className="space-y-2 mt-auto pt-2">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-brand-gray-500" />
              <span className="text-xs text-brand-gray-300 font-medium">Piso 2</span>
            </div>
            <StockBadge stock={product.stock} kioskId="kiosk-1" size="xs" />
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-colors">
            <div className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-brand-gray-500" />
              <span className="text-xs text-brand-gray-300 font-medium">Piso 7</span>
            </div>
            <StockBadge stock={product.stock} kioskId="kiosk-2" size="xs" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
