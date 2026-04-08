import { Search, SlidersHorizontal, ChevronRight, Link,X } from 'lucide-react';
import { ProductCard} from '../components/ProductCard';
import { useMemo, useState } from 'react';

const ALL_PRODUCTS = [
  { id: 1, name: "POLERA BÁSICA OVERSIZE", price: 125, category: "Poleras", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1583744760882-96947ac0d9fc?auto=format&fit=crop&q=80&w=800"], description: "Nuestra polera insignia. Confeccionada en algodón pima peruano al 100%, ofrece una caída pesada y estructurada ideal para el día a día.", details: ["100% Algodón Pima", "Gramaje grueso (240gsm)", "Corte Oversize"], sizes: ["S", "M", "L"], inStock: true, featured: true },
  { id: 2, name: "CAMISA OXFORD ESSENTIAL", price: 180, category: "Camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"], description: "Una pieza atemporal para cualquier armario. Algodón transpirable con textura clásica Oxford.", details: ["100% Algodón Orgánico", "Botones de nácar", "Corte Relaxed"], sizes: ["M", "L", "XL"], inStock: true, featured: true },
  { id: 3, name: "JEANS PREMIUM SKINNY", price: 250, category: "Pantalones", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"], description: "Denim elástico de alta recuperación.", details: ["98% Algodón, 2% Elastano"], sizes: ["30", "32", "34"], inStock: false, featured: true },
  { id: 4, name: "CHAQUETA DENIM VINTAGE", price: 320, category: "Abrigos", image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800"], description: "Denim rígido con lavado a la piedra para un look desgastado auténtico.", details: ["100% Algodón pesado"], sizes: ["S", "M"], inStock: true, featured: true },
  { id: 101, name: "POLERA PIMA BLANCA", price: 90, oldPrice: 130, category: "Poleras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"], description: "Suavidad inigualable para tu día a día.", details: ["Algodón Pima", "Cuello redondo"], sizes: ["S", "M"], inStock: true, discount: true },
  { id: 102, name: "POLERA CUELLO V GRIS", price: 85, oldPrice: 120, category: "Poleras", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600"], description: "Corte entallado que resalta la figura.", details: ["Mezcla de algodón y poliéster"], sizes: ["M", "L", "XL"], inStock: true, discount: true },
];

export const ProductsView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizesFilter, setSelectedSizesFilter] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      const matchesSize = selectedSizesFilter.length === 0 || product.sizes.some(size => selectedSizesFilter.includes(size));
      return matchesSearch && matchesPrice && matchesSize;
    });
  }, [searchQuery, maxPrice, selectedSizesFilter]);

  const toggleSizeFilter = (size: string) => setSelectedSizesFilter(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const allAvailableSizes = ["S", "M", "L", "XL", "30", "32", "34"];

  const FilterPanel = () => (
    <div className="space-y-10">
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Buscar</label>
        <div className="relative">
          <Search className="absolute left-4 top-4 text-slate-400" size={18} />
          <input type="text" placeholder="Ej. Polera negra..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-none pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Precio Máximo</label>
          <span className="text-sm font-bold text-slate-900">Bs {maxPrice}</span>
        </div>
        <input type="range" min="50" max="500" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-slate-900" />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Tallas</label>
        <div className="flex flex-wrap gap-3">
          {allAvailableSizes.map(size => (
            <button key={size} onClick={() => toggleSizeFilter(size)} className={`w-12 h-12 border text-xs font-bold flex items-center justify-center transition-colors ${selectedSizesFilter.includes(size) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-24 w-full px-6 lg:px-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-100 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            <Link to="/" className="hover:text-slate-900">Inicio</Link> <ChevronRight size={14}/> <span className="text-slate-900">Catálogo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Colección Completa</h2>
          <p className="text-sm text-slate-500 mt-3">{filteredProducts.length} productos disponibles</p>
        </div>
        <button onClick={() => setShowMobileFilters(true)} className="md:hidden w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-4 text-xs font-bold uppercase tracking-widest">
          <SlidersHorizontal size={18} /> Mostrar Filtros
        </button>
      </div>

      <div className="flex gap-12">
        <aside className="hidden md:block w-72 shrink-0 sticky top-32 h-fit"><FilterPanel /></aside>
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <Search className="mx-auto text-slate-300 mb-6" size={56} strokeWidth={1} />
              <h3 className="text-xl font-black text-slate-900 mb-3">Sin resultados</h3>
              <p className="text-sm text-slate-500">Intenta ajustar tus filtros o buscar otra prenda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 w-full bg-white rounded-t-[2rem] p-8 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black uppercase tracking-widest">Filtros</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 p-2 -mr-2"><X size={28}/></button>
            </div>
            <FilterPanel />
            <button onClick={() => setShowMobileFilters(false)} className="w-full mt-10 bg-slate-900 text-white py-5 text-xs font-black uppercase tracking-widest">Ver {filteredProducts.length} productos</button>
          </div>
        </div>
      )}
    </div>
  );
}