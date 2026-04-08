import {  useNavigate, useLocation, To, useParams } from 'react-router-dom';
import { ProductCard} from '../components/ProductCard';
import { ShoppingBag, ChevronRight, Link, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const ALL_PRODUCTS = [
  { id: 1, name: "POLERA BÁSICA OVERSIZE", price: 125, category: "Poleras", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1583744760882-96947ac0d9fc?auto=format&fit=crop&q=80&w=800"], description: "Nuestra polera insignia. Confeccionada en algodón pima peruano al 100%, ofrece una caída pesada y estructurada ideal para el día a día.", details: ["100% Algodón Pima", "Gramaje grueso (240gsm)", "Corte Oversize"], sizes: ["S", "M", "L"], inStock: true, featured: true },
  { id: 2, name: "CAMISA OXFORD ESSENTIAL", price: 180, category: "Camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"], description: "Una pieza atemporal para cualquier armario. Algodón transpirable con textura clásica Oxford.", details: ["100% Algodón Orgánico", "Botones de nácar", "Corte Relaxed"], sizes: ["M", "L", "XL"], inStock: true, featured: true },
  { id: 3, name: "JEANS PREMIUM SKINNY", price: 250, category: "Pantalones", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"], description: "Denim elástico de alta recuperación.", details: ["98% Algodón, 2% Elastano"], sizes: ["30", "32", "34"], inStock: false, featured: true },
  { id: 4, name: "CHAQUETA DENIM VINTAGE", price: 320, category: "Abrigos", image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800"], description: "Denim rígido con lavado a la piedra para un look desgastado auténtico.", details: ["100% Algodón pesado"], sizes: ["S", "M"], inStock: true, featured: true },
  { id: 101, name: "POLERA PIMA BLANCA", price: 90, oldPrice: 130, category: "Poleras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"], description: "Suavidad inigualable para tu día a día.", details: ["Algodón Pima", "Cuello redondo"], sizes: ["S", "M"], inStock: true, discount: true },
  { id: 102, name: "POLERA CUELLO V GRIS", price: 85, oldPrice: 120, category: "Poleras", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600"], description: "Corte entallado que resalta la figura.", details: ["Mezcla de algodón y poliéster"], sizes: ["M", "L", "XL"], inStock: true, discount: true },
];

function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-24">
      <div className="w-20 h-20 border-2 border-slate-200 rounded-full flex items-center justify-center mb-8"><SlidersHorizontal className="text-slate-300" size={32} /></div>
      <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 max-w-md text-lg">Esta sección está siendo diseñada.</p>
    </div>
  );
}

export const ProductDetailView = ({ addToCart }: { addToCart: (product: unknown, size: string) => void }) => {
  const { id } = useParams();
  const { state } = useLocation();
  
  // Obtenemos el producto pasado por estado del Link, o si entra por URL directa, lo buscamos en la base de datos
  const product = state?.product || ALL_PRODUCTS.find(p => p.id === Number(id));

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeError, setSizeError] = useState(false);

  if (!product) return <PlaceholderView title="Producto no encontrado" />;
  const gallery = product.gallery || [product.image];

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000); 
    } else {
      setSizeError(false);
      addToCart(product, selectedSize);
    }
  };

  return (
    <div className="pt-28 pb-24 w-full px-6 lg:px-12 min-h-[85vh]">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 cursor-pointer">
        <Link to="/" className="hover:text-slate-900">Inicio</Link> <ChevronRight size={14}/> 
        <Link to="/products" className="hover:text-slate-900">Catálogo</Link> <ChevronRight size={14}/> 
        <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
        <div className="flex-1 lg:w-3/5">
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[80vh] bg-slate-100 overflow-hidden mb-6">
            <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover object-center animate-in fade-in duration-500" key={activeImage} />
            {!product.inStock && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-900">Agotado</span>
                </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {gallery.map((img: string | undefined, idx: number) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-24 h-32 shrink-0 overflow-hidden ${activeImage === idx ? 'ring-2 ring-slate-900' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                  <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:w-2/5 lg:sticky lg:top-32 h-fit">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{product.category}</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">{product.name}</h1>
          <div className="flex items-center gap-5 mb-10">
             <span className={`text-3xl font-black ${product.discount ? 'text-[#b91c1c]' : 'text-slate-900'}`}>Bs {product.price}</span>
             {product.discount && <span className="text-base font-light text-slate-400 line-through">Bs {product.oldPrice}</span>}
          </div>
          <p className="text-base text-slate-600 font-light leading-relaxed mb-10">{product.description || "Prenda esencial."}</p>

          {product.inStock ? (
            <div className="mb-12 border-t border-b border-slate-100 py-10">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-900">Seleccionar Talla</label>
                <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-400 pb-0.5 hover:text-slate-900 transition-colors">Guía de Tallas</button>
              </div>
              
              {sizeError && (
                <p className="text-xs font-bold text-red-500 mb-4 animate-pulse">⚠️ Por favor, selecciona una talla primero.</p>
              )}

              <div className="flex flex-wrap gap-4 mb-10">
                  {product.sizes.map((size: string) => (
                      <button 
                        key={size} 
                        onClick={() => { setSelectedSize(size); setSizeError(false); }} 
                        className={`w-16 h-16 border text-base font-bold flex items-center justify-center transition-colors ${selectedSize === size ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'}`}
                      >
                          {size}
                      </button>
                  ))}
              </div>
              
              <button onClick={handleAddToCartClick} className="w-full py-6 bg-[#0F172A] text-white text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-[0.98] flex justify-center items-center gap-3">
                  <ShoppingBag size={20} /> Añadir a la Bolsa
              </button>
            </div>
          ) : (
            <div className="mb-12 border-t border-b border-slate-100 py-10">
              <div className="bg-slate-50 border border-slate-200 text-slate-500 py-6 text-center text-sm font-black uppercase tracking-widest">Actualmente Agotado</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}