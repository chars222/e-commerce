import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard'; // Asegúrate de ajustar esta importación

const getApiUrl = () => {
  try { return import.meta.env.VITE_API_URL; } catch (error) { return null; }
};
const API_URL = getApiUrl() || 'http://localhost:3000';
const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID || '3'; // Valor por defecto si no está configurado

// Tipos para la respuesta de la API
interface ApiProduct {
  id: number;
  name: string;
  price: number;
  category?: { name: string };
  imageUrl?: string;
  variations?: Array<{ size: string; stock: number }>;
}

// Tipo para los productos formateados
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  sizes: string[];
}

export function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para los filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizesFilter, setSelectedSizesFilter] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 1. OBTENER DATOS DEL BACKEND REAL
  useEffect(() => {
    fetch(`${API_URL}/catalog/business/${BUSINESS_ID}/products`)
      .then(res => res.json())
      .then((data: ApiProduct[]) => {
        const formattedProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          category: p.category?.name || 'General',
          image: p.imageUrl || '[https://via.placeholder.com/400x600?text=Sin+Imagen](https://via.placeholder.com/400x600?text=Sin+Imagen)',
          inStock: Boolean(p.variations?.some((v: { size: string; stock: number }) => v.stock > 0)),
          // Solo extraemos las tallas que realmente tienen stock
          sizes: p.variations?.filter((v: { size: string; stock: number }) => v.stock > 0).map(v => v.size) || []
        }));
        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setLoading(false);
      });
  }, []);

  // 2. LÓGICA DE FILTRADO
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      const matchesSize = selectedSizesFilter.length === 0 || product.sizes.some(size => selectedSizesFilter.includes(size));
      
      return matchesSearch && matchesPrice && matchesSize;
    });
  }, [products, searchQuery, maxPrice, selectedSizesFilter]);

  const toggleSizeFilter = (size: string) => {
      setSelectedSizesFilter(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };
  
  // Lista fija de tallas para el filtro
  const allAvailableSizes = ["S", "M", "L", "XL", "30", "32", "34"];

  // 3. COMPONENTE DEL PANEL DE FILTROS (Reutilizable en Desktop y Mobile)
  const FilterPanel = () => (
    <div className="space-y-10">
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Buscar Prenda</label>
        <div className="relative">
          <Search className="absolute left-4 top-4 text-slate-400" size={18} />
          <input type="text" placeholder="Ej. Polera negra..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-none pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Presupuesto Máximo</label>
          <span className="text-sm font-bold text-slate-900">Bs {maxPrice}</span>
        </div>
        <input type="range" min="50" max="1000" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-slate-900" />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Filtrar por Talla</label>
        <div className="flex flex-wrap gap-3">
          {allAvailableSizes.map(size => (
            <button key={size} onClick={() => toggleSizeFilter(size)} className={`w-12 h-12 border text-xs font-bold flex items-center justify-center transition-colors ${selectedSizesFilter.includes(size) ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 text-slate-500 hover:border-slate-400 bg-white'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) return <div className="pt-32 pb-24 text-center font-bold text-slate-400">Cargando colección...</div>;

  return (
    <div className="pt-32 pb-24 w-full px-6 lg:px-12 min-h-screen">
      {/* Cabecera de la página */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-slate-100 pb-8 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            <Link to="/" className="hover:text-slate-900">Inicio</Link> <ChevronRight size={14}/> <span className="text-slate-900">Catálogo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Colección Completa</h2>
          <p className="text-sm text-slate-500 mt-3">{filteredProducts.length} productos disponibles</p>
        </div>
        
        {/* Botón de filtros para móvil */}
        <button onClick={() => setShowMobileFilters(true)} className="md:hidden w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-4 text-xs font-bold uppercase tracking-widest">
          <SlidersHorizontal size={18} /> Mostrar Filtros
        </button>
      </div>

      <div className="flex gap-12">
        {/* PANEL LATERAL (Solo visible en Desktop) */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-32 h-fit">
            <FilterPanel />
        </aside>

        {/* GRILLA DE PRODUCTOS */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-32 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <Search className="mx-auto text-slate-300 mb-6" size={56} strokeWidth={1} />
              <h3 className="text-xl font-black text-slate-900 mb-3">Sin resultados</h3>
              <p className="text-sm text-slate-500">Intenta ajustar tus filtros o buscar otra prenda.</p>
              <button onClick={() => { setSearchQuery(''); setMaxPrice(1000); setSelectedSizesFilter([]); }} className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1">
                  Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {filteredProducts.map((product) => (
                 <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE FILTROS MÓVIL */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 w-full bg-white rounded-t-[2rem] p-8 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black uppercase tracking-widest">Filtros</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 p-2 -mr-2"><X size={28}/></button>
            </div>
            
            <FilterPanel />
            
            <div className="mt-10 pt-4 bg-white sticky bottom-0">
                <button onClick={() => setShowMobileFilters(false)} className="w-full bg-slate-900 text-white py-5 text-xs font-black uppercase tracking-widest shadow-lg">
                    Ver {filteredProducts.length} productos
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}