import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import StockBadge from './StockBadge';
import useProductStore from '../context/useProductStore';
import useFavoritesStore from '../context/useFavoritesStore';

const ProductCard = ({ product, index = 0 }) => {
  const { categories } = useProductStore();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const category = categories.find(c => c.id === product.category);
  const liked = isFavorite(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-[24px] p-2 sm:p-3 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
    >
      {/* ── Top Half: Image Area ── */}
      <div className="relative h-[160px] sm:h-[200px] w-full bg-[#F5F5F7] rounded-2xl flex items-center justify-center p-3 sm:p-4 overflow-hidden mb-3 sm:mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Category chip */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white text-[10px] font-black text-gray-800 uppercase tracking-widest shadow-sm">
            {category?.name || 'CATEGORÍA'}
          </span>
        </div>

        {/* Global availability badge */}
        <div className="absolute top-3 right-3 z-10">
          <StockBadge stock={product.stock} size="xs" theme="light" />
        </div>

        {/* ❤️ Favorite button */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          whileTap={{ scale: 0.75 }}
          className="absolute bottom-3 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors"
          aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <motion.div
            animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-4 h-4 sm:w-[18px] sm:h-[18px] transition-colors duration-200 ${
                liked
                  ? 'fill-[#D72638] text-[#D72638]'
                  : 'fill-none text-gray-400 hover:text-gray-600'
              }`}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* ── Bottom Half: Info Area ── */}
      <div className="px-1 sm:px-2 flex flex-col flex-1 pb-1 sm:pb-2">
        {/* Name */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight mb-3 sm:mb-4 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex-1" />

        {/* Stock per kiosk */}
        <div className="space-y-2 sm:space-y-2.5">
          <div className="flex items-center justify-between group gap-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D72638] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-gray-700 whitespace-nowrap">Kiosko 1</span>
            </div>
            <div className="scale-[0.85] origin-right sm:scale-100">
              <StockBadge stock={product.stock} kioskId="kiosk-1" size="xs" theme="light" />
            </div>
          </div>
          <div className="w-full border-t border-gray-100" />
          <div className="flex items-center justify-between group gap-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D72638] shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold text-gray-700 whitespace-nowrap">Kiosko 2</span>
            </div>
            <div className="scale-[0.85] origin-right sm:scale-100">
              <StockBadge stock={product.stock} kioskId="kiosk-2" size="xs" theme="light" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

