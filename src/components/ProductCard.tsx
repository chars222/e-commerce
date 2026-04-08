import {  useNavigate } from 'react-router-dom';

import { useState } from 'react';

interface Product {
  id: string | number;
  name: string;
  image: string;
  category: string;
  price: number;
  oldPrice?: number;
  inStock: boolean;
  discount?: boolean;
}

interface ProductCardProps {
  product: Product;
}


export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group flex flex-col cursor-pointer" onClick={() => navigate(`/product/${product.id}`, { state: { product } })}>
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-5">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
             <span className="bg-white px-8 py-4 text-[11px] font-black uppercase tracking-widest text-slate-900 shadow-xl">Ver Producto</span>
          </div>
          {!product.inStock && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <span className="bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-900">Agotado</span>
              </div>
          )}
          {product.discount && product.inStock && (
              <div className="absolute top-4 left-4 bg-[#b91c1c] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest z-10">Sale</div>
          )}
      </div>
      <div className="flex justify-between items-start mb-3">
          <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{product.category}</p>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide group-hover:text-slate-500 transition-colors">{product.name}</h4>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-sm font-black ${product.discount ? 'text-[#b91c1c]' : 'text-slate-900'}`}>Bs {product.price}</span>
            {product.discount && <span className="text-xs font-light text-slate-400 line-through mt-0.5">Bs {product.oldPrice}</span>}
          </div>
      </div>
    </div>
  );
}
