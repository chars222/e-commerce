import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useState, useEffect } from 'react';

// Configuración dinámica de la URL de tu API
const getApiUrl = () => {
  try { return import.meta.env.VITE_API_URL; } catch (error) { return null; }
};

const API_URL = getApiUrl() || 'http://localhost:3000';
const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID || '2';// Valor por defecto si no está configurado

export const HomeView = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. OBTENER LOS DATOS REALES DEL CATÁLOGO
  useEffect(() => {
    fetch(`${API_URL}/catalog/business/${BUSINESS_ID}/products`)
      .then(res => res.json())
      .then(data => {
        // Formateamos los datos igual que en ProductsView, y añadimos la lógica de descuentos
        const formattedProducts = data.map((p: any) => {
          // Si tu base de datos maneja discountPercent, calculamos el precio final
          const hasDiscount = p.discountPercent && p.discountPercent > 0;
          const finalPrice = hasDiscount ? p.price * (1 - (p.discountPercent / 100)) : p.price;

          return {
            id: p.id,
            name: p.name,
            price: finalPrice,
            oldPrice: hasDiscount ? p.price : null,
            category: p.category?.name || 'General',
            image: p.imageUrl || 'https://via.placeholder.com/400x600?text=Sin+Imagen',
            gallery: p.gallery && p.gallery.length > 0 ? p.gallery : [p.imageUrl],
            inStock: p.variations?.some((v: any) => v.stock > 0),
            discount: hasDiscount
          };
        });
        
        setProducts(formattedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar productos en Home:", err);
        setLoading(false);
      });
  }, []);

  // 2. SEPARAR DESTACADOS Y OFERTAS DE LOS DATOS REALES
  // Tomamos los primeros 5 productos que lleguen como "Destacados"
  const featured = products.slice(0, 5);
  // Filtramos solo los que tengan la propiedad discount en true para el Carrusel de Ofertas
  const discounted = products.filter(p => p.discount);

  // Pantalla de carga mientras trae los datos
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center font-bold text-slate-400">
        Cargando experiencia...
      </div>
    );
  }

  return (
    <>
      <section className="relative h-[90vh] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <img src="https://web.centralmoda.store/uploads/img-1775871259643-383914535.webp?auto=format&fit=crop&q=80&w=2000" alt="Hero Fashion" className="absolute inset-0 w-full h-full object-cover opacity-60" />
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
        
        {featured.length === 0 ? (
           <p className="text-slate-400 font-medium">Aún no hay productos en el catálogo.</p>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-16">
               {featured.map((product) => <ProductCard key={product.id} product={product} />)}
           </div>
        )}
      </section>

      {/* Sólo renderizamos esta sección si realmente hay productos con descuento */}
      {discounted.length > 0 && (
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
      )}
    </>
  );
}
