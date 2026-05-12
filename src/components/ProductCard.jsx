import { motion } from 'framer-motion';
import StockBadge from './StockBadge';
import { CATEGORIES } from '../data/mockData';

const ProductCard = ({ product, index = 0 }) => {
  const category = CATEGORIES.find(c => c.id === product.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-brand-card rounded-2xl overflow-hidden border border-brand-border hover:border-brand-red/30 transition-all duration-300 hover:shadow-card-hover"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-black/70 backdrop-blur-sm text-xs font-medium text-white border border-white/10">
            <span>{category?.icon}</span>
            {category?.name}
          </span>
        </div>

        {/* Popular badge */}
        {product.popular && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-brand-red text-white text-xs font-bold shadow-red">
              ⭐ Popular
            </span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <span className="text-xl font-bold text-white drop-shadow-lg">
            S/ {product.price.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-white text-base truncate group-hover:text-brand-red-light transition-colors">
          {product.name}
        </h3>
        <p className="text-brand-gray-500 text-xs line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Stock per kiosk */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-brand-gray-500 font-medium">📍 Piso 2</span>
            <StockBadge stock={product.stock} kioskId="kiosk-1" size="xs" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-brand-gray-500 font-medium">📍 Piso 7</span>
            <StockBadge stock={product.stock} kioskId="kiosk-2" size="xs" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
