import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, X, ArrowRight, Menu, Search, SlidersHorizontal, ChevronRight } from 'lucide-react';

// ==========================================
// 🎨 ÍCONOS SVG PERSONALIZADOS
// ==========================================
const InstagramIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

// ==========================================
// 📦 BASE DE DATOS COMPLETA (Simulada)
// ==========================================
const ALL_PRODUCTS = [
  { id: 1, name: "POLERA BÁSICA OVERSIZE", price: 125, category: "Poleras", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", sizes: ["S", "M", "L"], inStock: true, featured: true },
  { id: 2, name: "CAMISA OXFORD ESSENTIAL", price: 180, category: "Camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800", sizes: ["M", "L", "XL"], inStock: true, featured: true },
  { id: 3, name: "JEANS PREMIUM SKINNY", price: 250, category: "Pantalones", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", sizes: ["30", "32", "34"], inStock: false, featured: true },
  { id: 4, name: "CHAQUETA DENIM VINTAGE", price: 320, category: "Abrigos", image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800", sizes: ["S", "M"], inStock: true, featured: true },
  { id: 101, name: "POLERA PIMA BLANCA", price: 90, oldPrice: 130, category: "Poleras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", sizes: ["S", "M"], inStock: true, discount: true },
  { id: 102, name: "POLERA CUELLO V GRIS", price: 85, oldPrice: 120, category: "Poleras", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600", sizes: ["M", "L", "XL"], inStock: true, discount: true },
  { id: 103, name: "POLERA TEXTURIZADA", price: 95, oldPrice: 140, category: "Poleras", image: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&q=80&w=600", sizes: ["S", "L"], inStock: true, discount: true },
  { id: 104, name: "POLERA MANGA LARGA", price: 110, oldPrice: 160, category: "Poleras", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600", sizes: ["M"], inStock: true, discount: true },
  { id: 105, name: "POLERA OVERSIZE AZUL", price: 100, oldPrice: 150, category: "Poleras", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600", sizes: ["S", "M", "L"], inStock: true, discount: true },
  { id: 201, name: "PANTALÓN CARGO NEGRO", price: 210, category: "Pantalones", image: "https://images.unsplash.com/photo-1517438322307-e67111335449?auto=format&fit=crop&q=80&w=800", sizes: ["30", "32"], inStock: true },
  { id: 202, name: "CAMISA LINO RELAXED", price: 195, category: "Camisas", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800", sizes: ["M", "L", "XL"], inStock: true },
];

// ==========================================
// 🚀 COMPONENTE PRINCIPAL (ENRUTADOR Y ESTADO)
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'products' | 'about' | 'contact'
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Control del header al hacer scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloqueo de scroll cuando hay modales abiertos
  useEffect(() => {
    if (isMenuOpen || isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen, isCartOpen]);

  const navigateTo = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0); // Vuelve arriba de la página al cambiar de vista
  };

  const addToCart = (product, selectedSize) => {
    if (!selectedSize) {
      alert("Por favor selecciona una talla");
      return;
    }
    setCart([...cart, { ...product, cartId: Date.now(), selectedSize }]);
    setIsCartOpen(true); 
  };

  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const phoneNumber = "59170000000"; 
    let message = `Hola, quiero confirmar mi pedido desde la web:%0A%0A`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Talla: ${item.selectedSize} (Bs ${item.price})%0A`;
    });
    message += `%0A*Total a pagar: Bs ${cartTotal}*`;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] selection:bg-slate-200 flex flex-col">
      
      {/* HEADER GLOBAL */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled || currentView !== 'home' ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <button onClick={() => setIsMenuOpen(true)} className={`${currentView === 'home' && !scrolled ? 'text-white' : 'text-slate-800'} p-1 -ml-1 hover:text-slate-500 transition-colors`}>
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <h1 onClick={() => navigateTo('home')} className={`text-2xl font-black tracking-tighter absolute left-1/2 -translate-x-1/2 cursor-pointer ${currentView === 'home' && !scrolled ? 'text-white' : 'text-slate-900'}`}>
            CENTRAL
          </h1>

          <button onClick={() => setIsCartOpen(true)} className={`relative flex items-center gap-2 group p-1 -mr-1 ${currentView === 'home' && !scrolled ? 'text-white' : 'text-slate-800'}`}>
            <span className="hidden md:block text-xs font-bold tracking-widest uppercase group-hover:opacity-70 transition-colors">Bolsa</span>
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b91c1c] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* MENÚ HAMBURGUESA GLOBAL */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center">
             <h1 className="text-2xl font-black tracking-tighter text-slate-900">CENTRAL</h1>
             <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 -mr-2 transition-colors">
               <X size={28} strokeWidth={1.5} />
             </button>
          </div>
          <div className="flex-1 flex flex-col justify-center px-10 gap-8">
            <button onClick={() => navigateTo('home')} className={`text-left text-4xl md:text-5xl font-black tracking-tight hover:text-slate-500 transition-colors ${currentView === 'home' ? 'text-slate-900' : 'text-slate-300'}`}>Inicio</button>
            <button onClick={() => navigateTo('products')} className={`text-left text-4xl md:text-5xl font-black tracking-tight hover:text-slate-500 transition-colors flex items-center gap-4 ${currentView === 'products' ? 'text-slate-900' : 'text-slate-300'}`}>
              Productos {currentView === 'products' && <ArrowRight size={32} className="text-[#b91c1c]" />}
            </button>
            <button onClick={() => navigateTo('about')} className={`text-left text-4xl md:text-5xl font-black tracking-tight hover:text-slate-500 transition-colors ${currentView === 'about' ? 'text-slate-900' : 'text-slate-300'}`}>Sobre Nosotros</button>
            <button onClick={() => navigateTo('contact')} className={`text-left text-4xl md:text-5xl font-black tracking-tight hover:text-slate-500 transition-colors ${currentView === 'contact' ? 'text-slate-900' : 'text-slate-300'}`}>Contáctanos</button>
          </div>
          <div className="p-10 bg-slate-50">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Síguenos</p>
             <div className="flex gap-6">
                <a href="#" className="text-slate-900 hover:text-slate-500"><InstagramIcon size={24} /></a>
                <a href="#" className="text-slate-900 hover:text-slate-500"><FacebookIcon size={24} /></a>
             </div>
          </div>
        </div>
      )}

      {/* RENDERIZADO DE VISTAS (ENRUTADOR) */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView navigateTo={navigateTo} addToCart={addToCart} />}
        {currentView === 'products' && <ProductsView addToCart={addToCart} />}
        {currentView === 'about' && <PlaceholderView title="Sobre Nosotros" />}
        {currentView === 'contact' && <PlaceholderView title="Contáctanos" />}
      </main>

      {/* FOOTER GLOBAL */}
      <footer className="bg-[#0F172A] text-white py-16 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
               <h1 className="text-2xl font-black tracking-tighter text-white mb-4">CENTRAL</h1>
               <p className="text-sm text-slate-400 mb-6 max-w-sm">Únete a nuestro club. Recibe acceso anticipado a nuevas colecciones y descuentos exclusivos.</p>
               <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                   <input type="email" placeholder="Tu correo electrónico" className="bg-white/10 border border-white/20 text-white placeholder-slate-400 px-4 py-3 text-sm focus:outline-none focus:border-white w-full rounded-none" />
                   <button className="bg-white text-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors whitespace-nowrap rounded-none">Suscribirse</button>
               </div>
            </div>
            <div>
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Ayuda</h4>
               <div className="flex flex-col gap-4 text-sm font-light text-slate-300">
                  <a href="#" className="hover:text-white transition-colors">Envíos y Entregas</a>
                  <a href="#" className="hover:text-white transition-colors">Guía de Tallas</a>
                  <a href="#" onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">Contáctanos</a>
               </div>
            </div>
            <div>
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Navegación</h4>
               <div className="flex flex-col gap-4 text-sm font-light text-slate-300">
                  <button onClick={() => navigateTo('home')} className="text-left hover:text-white transition-colors">Inicio</button>
                  <button onClick={() => navigateTo('products')} className="text-left hover:text-white transition-colors">Catálogo Completo</button>
                  <button onClick={() => navigateTo('about')} className="text-left hover:text-white transition-colors">Nuestra Historia</button>
               </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 font-light">© 2026 Central Moda. Todos los derechos reservados.</p>
            <div className="flex gap-4 text-slate-400">
                <a href="#" className="hover:text-white transition-colors"><InstagramIcon size={20} /></a>
                <a href="#" className="hover:text-white transition-colors"><FacebookIcon size={20} /></a>
            </div>
        </div>
      </footer>

      {/* CARRITO LATERAL GLOBAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
            <div className="absolute inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-black tracking-tight uppercase">Tu Bolsa ({cart.length})</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 -mr-2"><X size={24} strokeWidth={1.5} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <ShoppingBag size={48} strokeWidth={1} />
                            <p className="text-sm font-medium uppercase tracking-widest">Tu bolsa está vacía</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.cartId} className="flex gap-4 group">
                                <div className="w-20 h-24 bg-slate-50 shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 py-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide leading-tight pr-4">{item.name}</h4>
                                        <button onClick={() => removeFromCart(item.cartId)} className="text-slate-300 hover:text-[#b91c1c] transition-colors"><X size={16} /></button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Talla: {item.selectedSize}</p>
                                    <p className="text-sm font-light text-slate-900 mt-2">Bs {item.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {cart.length > 0 && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Total</span>
                            <span className="text-xl font-black text-slate-900">Bs {cartTotal}</span>
                        </div>
                        <button onClick={handleWhatsAppCheckout} className="w-full bg-[#0F172A] text-white py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]">
                            Confirmar por WhatsApp <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 🏠 VISTA: INICIO (HOME)
// ==========================================
function HomeView({ navigateTo, addToCart }) {
  const [selectedSize, setSelectedSize] = useState({});
  const featured = ALL_PRODUCTS.filter(p => p.featured);
  const discounted = ALL_PRODUCTS.filter(p => p.discount);

  return (
    <>
      <section className="relative h-[85vh] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000" alt="Hero Fashion" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 text-center text-white px-6">
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 opacity-80">Nueva Temporada</p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Lujo Silencioso.</h2>
            <button onClick={() => navigateTo('products')} className="bg-white text-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors rounded-none">
                Explorar Colección
            </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Los Más Buscados</h3>
            <button onClick={() => navigateTo('products')} className="hidden md:flex text-xs font-bold uppercase tracking-widest border-b border-slate-900 pb-1 hover:text-slate-500 transition-colors">
              Ver todo catálogo
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featured.map((product) => (
                <ProductCard key={product.id} product={product} selectedSize={selectedSize} setSelectedSize={setSelectedSize} addToCart={addToCart} />
            ))}
        </div>
        <button onClick={() => navigateTo('products')} className="w-full md:hidden mt-12 py-4 border border-slate-900 text-xs font-bold uppercase tracking-widest text-slate-900 hover:bg-slate-50 transition-colors">
            Ver todo catálogo
        </button>
      </section>

      <section className="bg-white py-20 border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
              <div>
                 <p className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest mb-2">Tiempo Limitado</p>
                 <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Precios Especiales</h3>
              </div>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-5 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {discounted.map((product) => (
                <div key={product.id} className="min-w-[240px] md:min-w-0 snap-start group flex flex-col cursor-pointer" onClick={() => navigateTo('products')}>
                    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-4">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute top-3 left-3 bg-[#b91c1c] text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest">Sale</div>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide truncate mb-1">{product.name}</h4>
                        <div className="flex items-center gap-2">
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

// ==========================================
// 🛍️ VISTA: PRODUCTOS (NUEVO CON FILTROS)
// ==========================================
function ProductsView({ addToCart }) {
  const [selectedSizeLocal, setSelectedSizeLocal] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizesFilter, setSelectedSizesFilter] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Lógica de Filtros en tiempo real
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      const matchesSize = selectedSizesFilter.length === 0 || product.sizes.some(size => selectedSizesFilter.includes(size));
      return matchesSearch && matchesPrice && matchesSize;
    });
  }, [searchQuery, maxPrice, selectedSizesFilter]);

  const toggleSizeFilter = (size) => {
    setSelectedSizesFilter(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const allAvailableSizes = ["S", "M", "L", "XL", "30", "32", "34"];

  // Componente interno para reusar el panel de filtros
  const FilterPanel = () => (
    <div className="space-y-8">
      {/* Buscador */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Ej. Polera negra..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-none pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
          />
        </div>
      </div>

      {/* Rango de Precio */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Precio Máximo</label>
          <span className="text-xs font-bold text-slate-900">Bs {maxPrice}</span>
        </div>
        <input 
          type="range" 
          min="50" max="500" step="10"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-slate-900"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>Bs 50</span>
          <span>Bs 500+</span>
        </div>
      </div>

      {/* Filtro por Talla */}
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Tallas</label>
        <div className="flex flex-wrap gap-2">
          {allAvailableSizes.map(size => (
            <button 
              key={size}
              onClick={() => toggleSizeFilter(size)}
              className={`w-10 h-10 border text-xs font-bold flex items-center justify-center transition-colors ${selectedSizesFilter.includes(size) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Botón limpiar */}
      {(searchQuery || selectedSizesFilter.length > 0 || maxPrice < 500) && (
        <button 
          onClick={() => { setSearchQuery(''); setSelectedSizesFilter([]); setMaxPrice(500); }}
          className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest border-b border-transparent hover:border-slate-900"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      
      {/* Título y Botón móvil de filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-100 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>Inicio</span> <ChevronRight size={12}/> <span className="text-slate-900">Catálogo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Colección Completa</h2>
          <p className="text-sm text-slate-500 mt-2">{filteredProducts.length} productos disponibles</p>
        </div>
        
        {/* Botón Flotante/Fijo en Móvil para abrir filtros */}
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="md:hidden w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3 text-xs font-bold uppercase tracking-widest"
        >
          <SlidersHorizontal size={16} /> Mostrar Filtros
        </button>
      </div>

      <div className="flex gap-10">
        {/* FILTROS DESKTOP (Sidebar Izquierda) */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-32 h-fit">
          <FilterPanel />
        </aside>

        {/* GRILLA DE PRODUCTOS */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="mx-auto text-slate-300 mb-4" size={48} strokeWidth={1} />
              <h3 className="text-lg font-black text-slate-900 mb-2">Sin resultados</h3>
              <p className="text-sm text-slate-500">Intenta ajustar tus filtros o buscar otra prenda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} selectedSize={selectedSizeLocal} setSelectedSize={setSelectedSizeLocal} addToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CAJÓN DE FILTROS MÓVIL */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 w-full bg-white rounded-t-[2rem] p-6 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black uppercase tracking-widest">Filtros</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 p-2 -mr-2"><X size={24}/></button>
            </div>
            <FilterPanel />
            <button 
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-8 bg-slate-900 text-white py-4 text-xs font-black uppercase tracking-widest"
            >
              Ver {filteredProducts.length} productos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 🧩 COMPONENTES REUTILIZABLES
// ==========================================

// Tarjeta de Producto (Usada en Home y Products)
function ProductCard({ product, selectedSize, setSelectedSize, addToCart }) {
  return (
    <div className="group flex flex-col">
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-4">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
          {!product.inStock && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Agotado</span>
              </div>
          )}
          {product.discount && product.inStock && (
              <div className="absolute top-3 left-3 bg-[#b91c1c] text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest">Sale</div>
          )}
      </div>
      <div className="flex justify-between items-start mb-3">
          <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{product.name}</h4>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-sm font-black ${product.discount ? 'text-[#b91c1c]' : 'text-slate-900'}`}>Bs {product.price}</span>
            {product.discount && <span className="text-xs font-light text-slate-400 line-through">Bs {product.oldPrice}</span>}
          </div>
      </div>
      {product.inStock && (
          <div className="mt-auto pt-2">
              <div className="flex flex-wrap gap-2 mb-4">
                  {product.sizes.map(size => (
                      <button 
                          key={size}
                          onClick={() => setSelectedSize({...selectedSize, [product.id]: size})}
                          className={`w-10 h-10 border text-xs font-bold flex items-center justify-center transition-colors ${selectedSize[product.id] === size ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}
                      >
                          {size}
                      </button>
                  ))}
              </div>
              <button onClick={() => addToCart(product, selectedSize[product.id])} className="w-full py-3.5 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-[0.98]">
                  Añadir a la Bolsa
              </button>
          </div>
      )}
    </div>
  );
}

// Vista temporal para páginas en construcción
function PlaceholderView({ title }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-24">
      <div className="w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center mb-6">
        <SlidersHorizontal className="text-slate-300" size={24} />
      </div>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 max-w-md">Esta sección está siendo diseñada. Aquí podrás contar la historia de la marca o colocar el formulario de contacto.</p>
    </div>
  );
}


