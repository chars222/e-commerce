import {  useNavigate, useLocation, To } from 'react-router-dom';
import { ProductCard} from '../components/ProductCard';
import { useState } from 'react';


const ALL_PRODUCTS = [
  { id: 1, name: "POLERA BÁSICA OVERSIZE", price: 125, category: "Poleras", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1583744760882-96947ac0d9fc?auto=format&fit=crop&q=80&w=800"], description: "Nuestra polera insignia. Confeccionada en algodón pima peruano al 100%, ofrece una caída pesada y estructurada ideal para el día a día.", details: ["100% Algodón Pima", "Gramaje grueso (240gsm)", "Corte Oversize"], sizes: ["S", "M", "L"], inStock: true, featured: true },
  { id: 2, name: "CAMISA OXFORD ESSENTIAL", price: 180, category: "Camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"], description: "Una pieza atemporal para cualquier armario. Algodón transpirable con textura clásica Oxford.", details: ["100% Algodón Orgánico", "Botones de nácar", "Corte Relaxed"], sizes: ["M", "L", "XL"], inStock: true, featured: true },
  { id: 3, name: "JEANS PREMIUM SKINNY", price: 250, category: "Pantalones", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"], description: "Denim elástico de alta recuperación.", details: ["98% Algodón, 2% Elastano"], sizes: ["30", "32", "34"], inStock: false, featured: true },
  { id: 4, name: "CHAQUETA DENIM VINTAGE", price: 320, category: "Abrigos", image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800"], description: "Denim rígido con lavado a la piedra para un look desgastado auténtico.", details: ["100% Algodón pesado"], sizes: ["S", "M"], inStock: true, featured: true },
  { id: 101, name: "POLERA PIMA BLANCA", price: 90, oldPrice: 130, category: "Poleras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"], description: "Suavidad inigualable para tu día a día.", details: ["Algodón Pima", "Cuello redondo"], sizes: ["S", "M"], inStock: true, discount: true },
  { id: 102, name: "POLERA CUELLO V GRIS", price: 85, oldPrice: 120, category: "Poleras", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600"], description: "Corte entallado que resalta la figura.", details: ["Mezcla de algodón y poliéster"], sizes: ["M", "L", "XL"], inStock: true, discount: true },
];

export const HomeView = () => {
  const navigate = useNavigate();
  const featured = ALL_PRODUCTS.filter(p => p.featured);
  const discounted = ALL_PRODUCTS.filter(p => p.discount);

  return (
    <>
      <section className="relative h-[90vh] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000" alt="Hero Fashion" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 text-center text-white px-6">
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-6 opacity-80">Nueva Temporada</p>
            <h2 className="text-6xl md:text-8xl font-black tracking-tight mb-10">Lujo Silencioso.</h2>
            <button onClick={() => navigate('/products')} className="bg-white text-slate-900 px-10 py-5 text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-colors rounded-none">
                Explorar Colección
            </button>
        </div>
      </section>

      <section className="w-full px-6 lg:px-12 py-24">
        <div className="flex justify-between items-end mb-12">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">Los Más Buscados</h3>
            <button onClick={() => navigate('/products')} className="hidden md:flex text-xs font-bold uppercase tracking-widest border-b border-slate-900 pb-1 hover:text-slate-500 transition-colors">Ver todo catálogo</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-white py-24 border-t border-slate-100 overflow-hidden w-full">
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12">
              <div>
                 <p className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest mb-3">Tiempo Limitado</p>
                 <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Precios Especiales</h3>
              </div>
          </div>
          <div className="flex overflow-x-auto gap-8 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-5 xl:grid-cols-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {discounted.map((product) => (
                <div key={product.id} className="min-w-[280px] lg:min-w-0 snap-start group flex flex-col cursor-pointer" onClick={() => navigate(`/product/${product.id}`, { state: { product } })}>
                    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute top-4 left-4 bg-[#b91c1c] text-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest">Sale</div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide truncate mb-2">{product.name}</h4>
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-black text-[#b91c1c]">Bs {product.price}</span>
                           <span className="text-xs font-light text-slate-400 line-through">Bs {product.oldPrice}</span>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}