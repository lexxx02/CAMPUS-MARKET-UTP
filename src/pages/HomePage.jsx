import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useProductStore from '../context/useProductStore';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import KioskSelector from '../components/KioskSelector';
import { ProductCardSkeleton } from '../components/Skeleton';

const HomePage = () => {
  const {
    products, categories, kiosks, isLoading,
    searchQuery, selectedCategory, selectedKiosk,
    fetchProducts, fetchCategories, fetchKiosks,
    setSearchQuery, setSelectedCategory, setSelectedKiosk,
    getFilteredProducts,
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchKiosks();
  }, []);

  const filtered = getFilteredProducts();
  const availableCount = products.filter(p => Object.values(p.stock).reduce((a, b) => a + b, 0) > 0).length;

  return (
    <div className="space-y-6">
      {/* Hero – negro gris */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-surface via-brand-card to-brand-dark border border-brand-border p-6 sm:p-8">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/2 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Bienvenido a <span className="gradient-text-light">Campus Market</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl">
            Explora los productos disponibles en los kioscos de la UTP. Encuentra snacks, bebidas y más en tiempo real.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-success/10 border border-brand-success/20">
              <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
              <span className="text-xs text-brand-success font-medium">{availableCount} productos disponibles</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-white/70 font-medium">2 kioscos activos</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <KioskSelector kiosks={kiosks} selected={selectedKiosk} onSelect={setSelectedKiosk} />
        </div>
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-gray-500">
          {isLoading ? 'Cargando...' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`}
        </p>
        {(searchQuery || selectedCategory || selectedKiosk) && (
          <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); setSelectedKiosk(null); }} className="text-xs text-brand-red hover:text-brand-red-light transition-colors">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-brand-gray-400 text-lg font-medium">No se encontraron productos</p>
          <p className="text-brand-gray-600 text-sm mt-1">Intenta con otro término de búsqueda o filtro</p>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
