import { Search, SlidersHorizontal, ChevronRight, Link,X } from 'lucide-react';
import { ProductCard} from '../components/ProductCard';
import React, { useState, useEffect, useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
}

export function ProductsView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);

  // 1. LLAMADA A LA BASE DE DATOS REAL
  useEffect(() => {
    fetch(`${API_URL}/api/catalog/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando productos", err);
        setLoading(false);
      });
  }, []);

  // 2. FILTROS APLICADOS SOBRE LOS DATOS REALES
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesPrice;
    });
  }, [products, searchQuery, maxPrice]);

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-slate-500 font-bold">Cargando la nueva colección...</div>;
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            <Link to="/">Inicio</Link> <ChevronRight size={12}/> <span className="text-slate-900">Catálogo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Colección Completa</h2>
        </div>
      </div>

      <div className="flex gap-10">
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <p className="text-center py-20 text-slate-500">No se encontraron productos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
