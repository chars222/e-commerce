/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ProductVariation {
  size: string;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  gallery?: string[];
  variations?: ProductVariation[];
  discountPercent?: number;
  error?: string;
}

interface ProductDetailViewProps {
  addToCart: (product: Record<string, unknown>, size: string) => void;
}

export function ProductDetailView({ addToCart }: ProductDetailViewProps) {
  const { id } = useParams(); // Saca el ID de la URL (ej: /product/15)
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/catalog/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-slate-500">Cargando prenda...</div>;
  if (!product || product.error) return <div className="pt-32 text-center font-bold">Producto no encontrado</div>;

  // Adaptar los datos de Prisma para el Frontend
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.imageUrl];
  const sizes = product.variations ? product.variations.map(v => v.size) : [];
  const inStock = product.variations ? product.variations.some(v => v.stock > 0) : false;
  
  // Precio final calculado (si hay descuento en la DB)
  const finalPrice = product.discountPercent 
    ? product.price - (product.price * (product.discountPercent / 100))
    : product.price;

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
    } else {
      setSizeError(false);
      // Le pasamos el precio final y la imagen principal al carrito
      addToCart({ ...product, price: finalPrice, image: product.imageUrl }, selectedSize);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      {/* ... (Aquí va tu maquetado HTML de ProductDetail que ya tenías) ... */}
      
      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        <div className="flex-1 md:w-3/5">
           <img src={gallery[0]} alt={product.name} className="w-full h-full object-cover bg-slate-100" />
        </div>

        <div className="md:w-2/5 pt-10">
          <h1 className="text-3xl font-black mb-4">{product.name}</h1>
          <p className="text-2xl font-black mb-8">Bs {finalPrice}</p>

          {inStock ? (
            <div className="mb-10 border-t border-slate-100 py-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-4 block">Seleccionar Talla</label>
              {sizeError && <p className="text-xs text-red-500 mb-3">⚠️ Elige una talla</p>}
              
              <div className="flex gap-3 mb-8">
                {sizes.map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }} className={`w-14 h-14 border font-bold ${selectedSize === size ? 'bg-slate-900 text-white' : 'bg-white'}`}>
                    {size}
                  </button>
                ))}
              </div>
              
              <button onClick={handleAddToCartClick} className="w-full py-5 bg-[#0F172A] text-white font-black uppercase flex justify-center items-center gap-2">
                  <ShoppingBag size={18} /> Añadir a la Bolsa
              </button>
            </div>
          ) : (
            <div className="py-5 text-center text-xs font-black uppercase bg-slate-50 text-slate-500">Agotado</div>
          )}
        </div>
      </div>
    </div>
  );
}
