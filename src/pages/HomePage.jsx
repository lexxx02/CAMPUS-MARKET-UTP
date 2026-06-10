import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Sparkles, Coffee, Utensils, Search, MapPin, Package } from 'lucide-react';
import useProductStore from '../context/useProductStore';
import ProductCard from '../components/ProductCard';
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
    <div className="space-y-10 pb-10">
      {/* Hero Section – Premium Delivery App Style */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-[32px] bg-brand-dark border border-white/5 shadow-2xl">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-danger/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/3 translate-y-1/3" />
        
        <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-success/10 border border-brand-success/20 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-bold text-brand-success uppercase tracking-wider">{availableCount} productos listos para ti</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
              Tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-[#FF6B6B]">antojo</span>,<br />
              a un paso de clase.
            </h1>
            
            <p className="text-base sm:text-lg text-brand-gray-400 font-medium max-w-xl mb-10 leading-relaxed">
              Descubre los snacks, bebidas y postres disponibles en tiempo real en los kioscos de la UTP. No pierdas tu receso buscando.
            </p>

            {/* Premium Search & Kiosk Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray-400 group-focus-within:text-brand-red transition-colors" />
                <input 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  placeholder="¿Qué se te antoja hoy?" 
                  className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-brand-gray-500 focus:outline-none focus:border-brand-red/50 focus:bg-white/10 transition-all font-medium backdrop-blur-sm" 
                />
              </div>
              <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 h-[58px] backdrop-blur-sm overflow-x-auto scrollbar-hide w-full sm:w-auto flex-nowrap">
                <button 
                  onClick={() => setSelectedKiosk(null)} 
                  className={`px-6 rounded-xl text-sm font-bold transition-all ${!selectedKiosk ? 'bg-brand-red text-white shadow-lg' : 'text-brand-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  Todos
                </button>
                {kiosks.map(k => (
                  <button 
                    key={k.id}
                    onClick={() => setSelectedKiosk(k.id)} 
                    className={`px-5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${selectedKiosk === k.id ? 'bg-white/10 text-white shadow-lg border border-white/5' : 'text-brand-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <MapPin className="w-4 h-4" />
                    Piso {k.name.replace(/\D/g, '') || k.id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="hidden lg:flex relative w-64 h-64 justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-red/20 to-transparent rounded-full animate-spin-slow blur-xl" />
            <Sparkles className="w-24 h-24 text-brand-red-light absolute drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]" />
          </div>
        </div>
      </motion.div>

      {/* Modern Category Carousel */}
      <div className="py-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`snap-start flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-3xl border transition-all duration-300 ${!selectedCategory ? 'bg-brand-red/10 border-brand-red/40 text-brand-red-light shadow-[0_0_20px_rgba(193,39,45,0.2)] -translate-y-2' : 'bg-brand-card border-white/5 text-brand-gray-400 hover:border-brand-red/20 hover:text-white hover:bg-white/5'}`}
          >
            <Store className={`w-8 h-8 mb-3 ${!selectedCategory ? 'text-brand-red-light' : 'text-brand-gray-500'}`} />
            <span className="text-[11px] font-black uppercase tracking-widest">Todos</span>
          </button>
          
          {categories.map((cat) => {
            const isFood = cat.name.toLowerCase().includes('comida') || cat.name.toLowerCase().includes('postre') || cat.name.toLowerCase().includes('snack');
            const isDrink = cat.name.toLowerCase().includes('bebida') || cat.name.toLowerCase().includes('agua');
            const Icon = isDrink ? Coffee : isFood ? Utensils : Package;
            
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                className={`snap-start flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 rounded-3xl border transition-all duration-300 ${selectedCategory === cat.id ? 'bg-brand-red/10 border-brand-red/40 text-brand-red-light shadow-[0_0_20px_rgba(193,39,45,0.2)] -translate-y-2' : 'bg-brand-card border-white/5 text-brand-gray-400 hover:border-brand-red/20 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className={`w-8 h-8 mb-3 ${selectedCategory === cat.id ? 'text-brand-red-light' : 'text-brand-gray-500'}`} />
                <span className="text-[11px] font-black uppercase tracking-widest text-center px-2 leading-tight">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-end justify-between border-b border-white/5 pb-6 px-2">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Catálogo</h2>
          <p className="text-brand-gray-400 mt-1 font-medium">
            {isLoading ? 'Preparando menú...' : `Mostrando ${filtered.length} opciones irresistibles`}
          </p>
        </div>
        {(searchQuery || selectedCategory || selectedKiosk) && (
          <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); setSelectedKiosk(null); }} className="text-xs font-bold text-brand-red hover:text-white hover:bg-brand-red transition-all uppercase tracking-widest px-4 py-2 rounded-xl bg-brand-red/10 border border-brand-red/20">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
          {filtered.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center bg-brand-card/30 rounded-[40px] border border-dashed border-white/10 mx-2">
          <div className="w-24 h-24 bg-brand-surface rounded-full flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
            <Search className="w-10 h-10 text-brand-gray-500" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3">No encontramos ese antojo</h3>
          <p className="text-brand-gray-400 font-medium max-w-sm">Intenta buscar con otros términos o cambia de piso para descubrir más opciones.</p>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;
