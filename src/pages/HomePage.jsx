import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Coffee, Cookie, Utensils, IceCream, Candy, LayoutGrid, X, MapPin } from 'lucide-react';
import useProductStore from '../context/useProductStore';
import useFavoritesStore from '../context/useFavoritesStore';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';

// ── Category icon mapping ──
const getCategoryIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('bebida') || n.includes('agua')) return Coffee;
  if (n.includes('snack')) return Cookie;
  if (n.includes('comida')) return Utensils;
  if (n.includes('postre')) return IceCream;
  if (n.includes('golosina') || n.includes('dulce')) return Candy;
  return LayoutGrid;
};

const HomePage = () => {
  const {
    products, categories, kiosks, isLoading,
    searchQuery, selectedCategory, selectedKiosk,
    fetchProducts, fetchCategories, fetchKiosks,
    setSearchQuery, setSelectedCategory, setSelectedKiosk,
    getFilteredProducts,
  } = useProductStore();

  const { favorites } = useFavoritesStore();
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchKiosks();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(4);
  }, [searchQuery, selectedCategory, selectedKiosk]);

  // Get filtered products, then:
  // 1. Hide favorited products that are out of stock (total stock = 0)
  // 2. Sort favorites to the top
  const allFiltered = getFilteredProducts();
  const filtered = allFiltered
    .filter(p => {
      const isFav = favorites.includes(p.id);
      if (!isFav) return true; // non-favorites always show
      // For favorites, hide if total stock is 0
      const totalStock = Object.values(p.stock || {}).reduce((sum, v) => sum + v, 0);
      return totalStock > 0;
    })
    .sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 0 : 1;
      const bFav = favorites.includes(b.id) ? 0 : 1;
      return aFav - bFav;
    });

  // Build result label
  const getResultLabel = () => {
    const count = filtered.length;
    if (selectedCategory) {
      const cat = categories.find(c => c.id === selectedCategory);
      return `${count} ${cat?.name?.toLowerCase() || 'productos'} encontrados`;
    }
    return `${count} productos encontrados`;
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedKiosk;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedKiosk(null);
  };

  return (
    <div className="space-y-8">

      {/* ═══ Hero Section ═══ */}
      <section className="pt-6 pb-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] tracking-tight leading-tight max-w-2xl">
            Encuentra lo que necesitas antes de{' '}
            <span className="text-[#D72638]">salir de clase.</span>
          </h1>

          {/* Decorative icons */}
          <div className="hidden md:flex items-center gap-4 text-5xl select-none" aria-hidden="true">
            <span>🍔</span>
            <span>🍪</span>
            <span>🥤</span>
            <span>🍰</span>
          </div>
        </div>
      </section>



      {/* ═══ Category Chips + Kiosk Filter ═══ */}
      <section className="space-y-4">
        {/* Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {/* "Todos" chip */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border whitespace-nowrap transition-all duration-200 shadow-sm ${
              !selectedCategory
                ? 'bg-[#D72638] text-white border-[#D72638]'
                : 'bg-[#F2EFE9] text-[#555] border-transparent hover:bg-[#EAE5DB]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Todos
          </button>

          {/* Category chips from backend */}
          <AnimatePresence>
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.name);
              const isActive = selectedCategory === cat.id;

              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border whitespace-nowrap transition-all duration-200 shadow-sm ${
                    isActive
                      ? 'bg-[#D72638] text-white border-[#D72638]'
                      : 'bg-[#F2EFE9] text-[#555] border-transparent hover:bg-[#EAE5DB]'
                  }`}
                >
                <Icon className="w-4 h-4 text-gray-500" />
                {cat.name}
              </motion.button>
            );
          })}
          </AnimatePresence>
        </div>

        {/* Kiosk sub-filter */}
        {kiosks.length > 1 && (
          <div className="flex items-center gap-3 pt-2">
            <span className="text-sm text-gray-500 font-medium">Ubicación:</span>
            <button
              onClick={() => setSelectedKiosk(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                !selectedKiosk
                  ? 'bg-[#111] text-white border-[#111]'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Todas
            </button>
            {kiosks.map(k => (
              <button
                key={k.id}
                onClick={() => setSelectedKiosk(selectedKiosk === k.id ? null : k.id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                  selectedKiosk === k.id
                    ? 'bg-[#111] text-white border-[#111]'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#D72638]" />
                Kiosko {k.name.replace(/\D/g, '') || k.id}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ═══ Results Header ═══ */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-gray-500 font-bold">
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-[#D72638] border-t-transparent rounded-full animate-spin" />
              Cargando...
            </span>
          ) : (
            getResultLabel()
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#D72638] transition-colors"
          >
            <X className="w-3 h-3" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* ═══ Products Grid ═══ */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-8">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.slice(0, visibleCount).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {visibleCount < filtered.length && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                onClick={() => setVisibleCount(prev => prev + 4)}
                className="px-6 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cargar más productos
              </button>
            </div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-white shadow-sm border border-gray-100"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-5">
            <Search className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            No encontramos resultados
          </h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Intenta buscar con otros términos o cambia los filtros para descubrir más opciones.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm font-semibold text-[#D72638] hover:underline"
          >
            Ver todos los productos
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
