import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, ArrowRight, Menu } from 'lucide-react';

// ==========================================
// 🎨 ÍCONOS SVG PERSONALIZADOS (A prueba de fallos)
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
// 📦 DATOS SIMULADOS
// ==========================================
const STORE_PRODUCTS = [
  {
    id: 1, name: "POLERA BÁSICA OVERSIZE", price: 125, category: "Básicos",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M", "L"], inStock: true
  },
  {
    id: 2, name: "CAMISA OXFORD ESSENTIAL", price: 180, category: "Camisas",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800",
    sizes: ["M", "L", "XL"], inStock: true
  },
  {
    id: 3, name: "JEANS PREMIUM SKINNY", price: 250, category: "Pantalones",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800",
    sizes: ["30", "32", "34"], inStock: false 
  },
  {
    id: 4, name: "CHAQUETA DENIM VINTAGE", price: 320, category: "Abrigos",
    image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800",
    sizes: ["S", "M"], inStock: true
  }
];

// Sección de Descuentos (5 poleras)
const DISCOUNT_PRODUCTS = [
  { id: 101, name: "POLERA PIMA BLANCA", price: 90, oldPrice: 130, category: "Poleras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", sizes: ["S", "M"] },
  { id: 102, name: "POLERA CUELLO V GRIS", price: 85, oldPrice: 120, category: "Poleras", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600", sizes: ["M", "L"] },
  { id: 103, name: "POLERA TEXTURIZADA", price: 95, oldPrice: 140, category: "Poleras", image: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?auto=format&fit=crop&q=80&w=600", sizes: ["S", "L"] },
  { id: 104, name: "POLERA MANGA LARGA", price: 110, oldPrice: 160, category: "Poleras", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&q=80&w=600", sizes: ["M"] },
  { id: 105, name: "POLERA OVERSIZE AZUL", price: 100, oldPrice: 150, category: "Poleras", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600", sizes: ["S", "M", "L"] },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ESTADO PARA EL MENÚ HAMBURGUESA
  const [scrolled, setScrolled] = useState(false);
  const [selectedSize, setSelectedSize] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Evita que la página haga scroll de fondo cuando el menú o carrito están abiertos
  useEffect(() => {
    if (isMenuOpen || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen, isCartOpen]);

  const addToCart = (product) => {
    const size = selectedSize[product.id];
    if (!size) {
      alert("Por favor selecciona una talla");
      return;
    }
    setCart([...cart, { ...product, cartId: Date.now(), selectedSize: size }]);
    setIsCartOpen(true); 
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] selection:bg-slate-200">
      
      {/* ================= HEADER ================= */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* Botón Hamburguesa */}
          <button onClick={() => setIsMenuOpen(true)} className="text-slate-800 p-1 -ml-1 hover:text-slate-500 transition-colors">
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <h1 className="text-2xl font-black tracking-tighter text-slate-900 absolute left-1/2 -translate-x-1/2">CENTRAL</h1>

          <button onClick={() => setIsCartOpen(true)} className="relative text-slate-800 flex items-center gap-2 group p-1 -mr-1">
            <span className="hidden md:block text-xs font-bold tracking-widest uppercase group-hover:text-slate-500 transition-colors">Bolsa</span>
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ================= MENÚ HAMBURGUESA (FULLSCREEN) ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center">
             <h1 className="text-2xl font-black tracking-tighter text-slate-900">CENTRAL</h1>
             <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 -mr-2 transition-colors">
               <X size={28} strokeWidth={1.5} />
             </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-center px-10 gap-8">
            <a href="#" className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 hover:text-slate-500 transition-colors">Inicio</a>
            <a href="#" className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 hover:text-slate-500 transition-colors flex items-center gap-4">
              Productos <ArrowRight size={32} className="text-slate-300" />
            </a>
            <a href="#" className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 hover:text-slate-500 transition-colors">Sobre Nosotros</a>
            <a href="#" className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 hover:text-slate-500 transition-colors">Contáctanos</a>
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

      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[85vh] w-full bg-slate-900 overflow-hidden flex items-center justify-center">
        <img 
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Fashion" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 text-center text-white px-6">
            <p className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4 opacity-80">Nueva Temporada</p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-8">Lujo Silencioso.</h2>
            <button className="bg-white text-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-colors rounded-none">
                Explorar Colección
            </button>
        </div>
      </section>

      {/* ================= CATÁLOGO PRINCIPAL ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-between items-end mb-10">
            <h3 className="text-2xl md:text-3xl font-black tracking-tight">Los Más Buscados</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {STORE_PRODUCTS.map((product) => (
                <div key={product.id} className="group flex flex-col">
                    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-4">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                                <span className="bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Agotado</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{product.name}</h4>
                        </div>
                        <span className="text-sm font-light text-slate-600">Bs {product.price}</span>
                    </div>

                    {product.inStock && (
                        <div className="mt-auto">
                            <div className="flex gap-2 mb-4">
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
                            <button onClick={() => addToCart(product)} className="w-full py-3.5 bg-[#0F172A] text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-[0.98]">
                                Añadir a la Bolsa
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </section>

      {/* ================= SECCIÓN DE DESCUENTOS (NUEVO) ================= */}
      <section className="bg-white py-20 border-t border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
              <div>
                 <p className="text-[10px] font-bold text-[#b91c1c] uppercase tracking-widest mb-2">Tiempo Limitado</p>
                 <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">Precios Especiales</h3>
              </div>
              <a href="#" className="hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#b91c1c] border-b border-[#b91c1c] pb-1 hover:text-red-800 hover:border-red-800 transition-colors">
                  Ver todos los descuentos <ArrowRight size={14} />
              </a>
          </div>

          {/* Carrusel Horizontal para Móviles y Grid para Desktop */}
          <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-5 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
            {DISCOUNT_PRODUCTS.map((product) => (
                <div key={product.id} className="min-w-[240px] md:min-w-0 snap-start group flex flex-col cursor-pointer">
                    <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-4">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
                        <div className="absolute top-3 left-3 bg-[#b91c1c] text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                           Sale
                        </div>
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

          <div className="mt-4 md:hidden">
            <a href="#" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#b91c1c] border border-[#b91c1c] py-4 rounded-none hover:bg-red-50 transition-colors">
               Ver todos los descuentos
            </a>
          </div>
        </div>
      </section>

      {/* ================= FOOTER MINIMALISTA (NUEVO) ================= */}
      <footer className="bg-[#0F172A] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Newsletter */}
            <div className="md:col-span-2">
               <h1 className="text-2xl font-black tracking-tighter text-white mb-4">CENTRAL</h1>
               <p className="text-sm text-slate-400 mb-6 max-w-sm">
                  Únete a nuestro club. Recibe acceso anticipado a nuevas colecciones y descuentos exclusivos.
               </p>
               <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                   <input type="email" placeholder="Tu correo electrónico" className="bg-white/10 border border-white/20 text-white placeholder-slate-400 px-4 py-3 text-sm focus:outline-none focus:border-white w-full rounded-none" />
                   <button className="bg-white text-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors whitespace-nowrap rounded-none">
                       Suscribirse
                   </button>
               </div>
            </div>

            {/* Links */}
            <div>
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Ayuda</h4>
               <div className="flex flex-col gap-4 text-sm font-light text-slate-300">
                  <a href="#" className="hover:text-white transition-colors">Envíos y Entregas</a>
                  <a href="#" className="hover:text-white transition-colors">Cambios y Devoluciones</a>
                  <a href="#" className="hover:text-white transition-colors">Guía de Tallas</a>
                  <a href="#" className="hover:text-white transition-colors">Contáctanos</a>
               </div>
            </div>

            {/* Links Legales */}
            <div>
               <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Legal</h4>
               <div className="flex flex-col gap-4 text-sm font-light text-slate-300">
                  <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
                  <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
                  <a href="#" className="hover:text-white transition-colors">Trabaja con nosotros</a>
               </div>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 font-light">© 2026 Central Moda. Todos los derechos reservados.</p>
            <div className="flex gap-4">
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><InstagramIcon size={20} /></a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors"><FacebookIcon size={20} /></a>
            </div>
        </div>
      </footer>

      {/* ================= CARRITO LATERAL ================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
            
            <div className="absolute inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-black tracking-tight uppercase">Tu Bolsa ({cart.length})</h2>
                    <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 -mr-2">
                        <X size={24} strokeWidth={1.5} />
                    </button>
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
                                        <button onClick={() => removeFromCart(item.cartId)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <X size={16} />
                                        </button>
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
                        <p className="text-[10px] text-center text-slate-400 mt-4 uppercase tracking-wider font-bold">
                            El pago se coordina con un asesor
                        </p>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
}