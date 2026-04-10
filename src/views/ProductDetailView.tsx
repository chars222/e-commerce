import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShoppingBag, AlignLeft } from 'lucide-react';

const getApiUrl = () => {
  try { return import.meta.env.VITE_API_URL; } catch (error) { return null; }
};
const API_URL = getApiUrl() || 'http://localhost:3000';

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  gallery?: string[];
  variations?: { size: string; stock: number }[];
  category?: { name: string };
  description?: string;
  error?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type ProductDetailViewProps = {
  addToCart: (item: CartItem, size: string) => void;
};

export function ProductDetailView({ addToCart }: ProductDetailViewProps) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  
  // SOLUCIÓN: Declarar explícitamente el tipo de estado para permitir strings o null
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeError, setSizeError] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/catalog/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar producto:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-slate-400 font-bold">Cargando prenda...</div>;
  if (!product || product.error) return <div className="pt-32 text-center text-slate-900 font-black text-2xl">Producto no encontrado</div>;

  // SOLUCIÓN: Verificamos de forma estricta que exista product.gallery antes de asignarlo, 
  // e indicamos que obligatoriamente será un string[]. Esto elimina el "possibly undefined".
  // CORRECCIÓN: Se limpia el enlace de marcador de posición para que sea una URL de imagen válida.
  const gallery: string[] = (product.gallery && product.gallery.length > 0) 
    ? product.gallery 
    : [product.imageUrl || 'https://via.placeholder.com/600x800?text=Sin+Imagen'];
  
  // Extraer las tallas que tienen stock mayor a 0
  const availableSizes = product.variations?.filter(v => v.stock > 0).map(v => v.size) || [];
  const inStock = availableSizes.length > 0;

  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000); 
    } else {
      setSizeError(false);
      // Pasamos los datos al carrito
      addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: gallery[0]
      }, selectedSize);
    }
  };

  return (
    <div className="pt-28 pb-24 w-full px-6 lg:px-12">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10 cursor-pointer">
        <Link to="/" className="hover:text-slate-900">Inicio</Link> <ChevronRight size={14}/> 
        <Link to="/products" className="hover:text-slate-900">Catálogo</Link> <ChevronRight size={14}/> 
        <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
        {/* COLUMNA DE INFORMACIÓN VISUAL Y DESCRIPCIÓN */}
        <div className="flex-1 lg:w-3/5">
          {/* Main image div */}
          <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[80vh] bg-slate-100 overflow-hidden mb-6">
            <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover object-center animate-in fade-in duration-500" key={activeImage} />
            {!inStock && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white px-8 py-4 text-sm font-black uppercase tracking-widest text-slate-900 shadow-xl">Agotado</span>
                </div>
            )}
          </div>
          {/* Gallery thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto mb-12" style={{ scrollbarWidth: 'none' }}>
              {gallery.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-24 h-32 shrink-0 overflow-hidden ${activeImage === idx ? 'ring-2 ring-slate-900' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                  <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          
          {/* --- NUEVO BLOQUE: DESCRIPCIÓN DEL PRODUCTO --- */}
          {/* ¡AQUÍ SE MUESTRA LA DESCRIPCIÓN MOVIDA DE LA COLUMNA DERECHA! */}
          <div className="border-t border-slate-100 pt-10">
            <h4 className="text-base font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
                <AlignLeft size={18}/>Descripción del producto
            </h4>
            <p className="text-base text-slate-600 font-light leading-relaxed whitespace-pre-wrap">
                {product.description || "Su descripción se mostrará aquí."}
            </p>
          </div>
        </div>

        {/* COLUMNA DE DETALLES DEL PRODUCTO Y COMPRA */}
        <div className="lg:w-2/5 lg:sticky lg:top-32 h-fit">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">{product.category?.name || 'General'}</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">{product.name}</h1>
          <p className="text-3xl font-black text-slate-900 mb-10">Bs {product.price}</p>
          
          {inStock ? (
            <div className="mb-12 border-t border-b border-slate-100 py-10">
              <div className="flex justify-between items-center mb-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-900">Seleccionar Talla</label>
              </div>
              
              {sizeError && (
                <p className="text-xs font-bold text-red-500 mb-4 animate-pulse">⚠️ Por favor, selecciona una talla primero.</p>
              )}

              <div className="flex flex-wrap gap-4 mb-10">
                  {availableSizes.map(size => (
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