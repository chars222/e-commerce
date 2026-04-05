import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, X, ArrowRight, Menu, Search, SlidersHorizontal, ChevronRight, MapPin, Phone, User } from 'lucide-react';

// ==========================================
// 🎨 ÍCONOS SVG PERSONALIZADOS (A prueba de fallos)
// ==========================================
const InstagramIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

// ==========================================
// 📦 BASE DE DATOS (Simulada para el demo)
// ==========================================
const ALL_PRODUCTS = [
  { id: 1, name: "POLERA BÁSICA OVERSIZE", price: 125, category: "Poleras", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1583744760882-96947ac0d9fc?auto=format&fit=crop&q=80&w=800"], description: "Nuestra polera insignia. Confeccionada en algodón pima peruano al 100%, ofrece una caída pesada y estructurada ideal para el día a día.", details: ["100% Algodón Pima", "Gramaje grueso (240gsm)", "Corte Oversize"], sizes: ["S", "M", "L"], inStock: true, featured: true },
  { id: 2, name: "CAMISA OXFORD ESSENTIAL", price: 180, category: "Camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"], description: "Una pieza atemporal para cualquier armario. Algodón transpirable con textura clásica Oxford.", details: ["100% Algodón Orgánico", "Botones de nácar", "Corte Relaxed"], sizes: ["M", "L", "XL"], inStock: true, featured: true },
  { id: 3, name: "JEANS PREMIUM SKINNY", price: 250, category: "Pantalones", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"], description: "Denim elástico de alta recuperación.", details: ["98% Algodón, 2% Elastano"], sizes: ["30", "32", "34"], inStock: false, featured: true },
  { id: 4, name: "CHAQUETA DENIM VINTAGE", price: 320, category: "Abrigos", image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800"], description: "Denim rígido con lavado a la piedra para un look desgastado auténtico.", details: ["100% Algodón pesado"], sizes: ["S", "M"], inStock: true, featured: true },
  { id: 101, name: "POLERA PIMA BLANCA", price: 90, oldPrice: 130, category: "Poleras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"], description: "Suavidad inigualable para tu día a día.", details: ["Algodón Pima", "Cuello redondo"], sizes: ["S", "M"], inStock: true, discount: true },
  { id: 102, name: "POLERA CUELLO V GRIS", price: 85, oldPrice: 120, category: "Poleras", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600"], description: "Corte entallado que resalta la figura.", details: ["Mezcla de algodón y poliéster"], sizes: ["M", "L", "XL"], inStock: true, discount: true },
];

// ==========================================
// 🚀 COMPONENTE PRINCIPAL (App)
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('home'); 
  const [currentProduct, setCurrentProduct] = useState(null); 
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen || isCartOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen, isCartOpen]);

  const navigateTo = (view, product = null) => {
    setCurrentView(view);
    if (product) setCurrentProduct(product);
    setIsMenuOpen(false);
    setIsCartOpen(false); 
    window.scrollTo(0, 0); 
  };

  const addToCart = (product, selectedSize) => {
    // Solo agregamos si hay talla, la validación se hace en ProductDetailView
    setCart([...cart, { ...product, cartId: Date.now(), selectedSize }]);
    setIsCartOpen(true); 
  };

  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

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
        </div>
      )}

      {/* RENDERIZADO DE VISTAS */}
      <main className="flex-1">
        {currentView === 'home' && <HomeView navigateTo={navigateTo} />}
        {currentView === 'products' && <ProductsView navigateTo={navigateTo} />}
        {currentView === 'product-detail' && <ProductDetailView product={currentProduct} navigateTo={navigateTo} addToCart={addToCart} />}
        {currentView === 'checkout' && <CheckoutView cart={cart} removeFromCart={removeFromCart} cartTotal={cartTotal} navigateTo={navigateTo} />}
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
                  <button onClick={() => navigateTo('contact')} className="text-left hover:text-white transition-colors">Contáctanos</button>
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

      {/* CARRITO LATERAL (SIDE-DRAWER) */}
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
                                <div className="flex-1 py-1 relative">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wide leading-tight pr-6">{item.name}</h4>
                                        <button onClick={() => removeFromCart(item.cartId)} className="absolute top-0 right-0 text-slate-300 hover:text-[#b91c1c] transition-colors"><X size={14} /></button>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">Talla: {item.selectedSize}</p>
                                    <p className="text-xs font-black text-slate-900 mt-1">Bs {item.price}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Subtotal</span>
                            <span className="text-xl font-black text-slate-900">Bs {cartTotal}</span>
                        </div>
                        <button onClick={() => navigateTo('checkout')} className="w-full bg-[#0F172A] text-white py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]">
                            Ir a Pagar <ArrowRight size={16} />
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
// 🛒 VISTA: CHECKOUT FINAL Y WHATSAPP
// ==========================================
function CheckoutView({ cart, removeFromCart, cartTotal, navigateTo }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFinalCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const phoneNumber = "59170000000"; 
    let message = `Hola CENTRAL, quiero realizar un pedido.%0A%0A`;
    message += `*📍 DATOS DE ENTREGA*%0A*Nombre:* ${formData.name}%0A*Teléfono:* ${formData.phone}%0A*Dirección:* ${formData.address}%0A`;
    if(formData.notes) message += `*Notas:* ${formData.notes}%0A`;
    
    message += `%0A*🛍️ MI PEDIDO*%0A`;
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Talla: *${item.selectedSize}* (Bs ${item.price})%0A`;
    });
    
    message += `%0A*Total a Pagar:* Bs ${cartTotal}%0A%0AQuedo atento/a para coordinar el pago.`;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 text-center">
        <ShoppingBag className="mx-auto text-slate-300 mb-6" size={64} strokeWidth={1} />
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">Tu bolsa está vacía</h2>
        <p className="text-slate-500 mb-8">Parece que aún no has seleccionado ninguna prenda.</p>
        <button onClick={() => navigateTo('products')} className="bg-[#0F172A] text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors rounded-none">
            Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 cursor-pointer">
        <span onClick={() => navigateTo('home')} className="hover:text-slate-900">Inicio</span> <ChevronRight size={12}/> 
        <span className="text-slate-900">Finalizar Compra</span>
      </div>

      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-10">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 order-2 lg:order-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 border-b border-slate-100 pb-4">Datos de Envío</h3>
          <form id="checkout-form" onSubmit={handleFinalCheckout} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><User size={12}/> Nombre Completo</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Juan Pérez" className="w-full bg-white border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><Phone size={12}/> Teléfono / WhatsApp</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ej. 70012345" className="w-full bg-white border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><MapPin size={12}/> Dirección de Entrega</label>
              <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Calle, Número, Zona, Ciudad" className="w-full bg-white border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Instrucciones Especiales (Opcional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Detalles de la casa, horario de entrega preferido..." rows="3" className="w-full bg-white border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors resize-none"></textarea>
            </div>
          </form>
        </div>

        <div className="lg:w-[400px] shrink-0 order-1 lg:order-2">
          <div className="bg-slate-50 p-6 md:p-8 border border-slate-100 lg:sticky lg:top-32">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6">Resumen del Pedido</h3>
            <div className="space-y-4 mb-6 max-h-[30vh] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-slate-200" />
                    <div className="flex-1 py-1 relative">
                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wide leading-tight pr-6">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Talla: {item.selectedSize}</p>
                        <p className="text-xs font-black text-slate-900 mt-1">Bs {item.price}</p>
                        <button onClick={() => removeFromCart(item.cartId)} className="absolute top-0 right-0 text-slate-300 hover:text-[#b91c1c] transition-colors"><X size={14} /></button>
                    </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>Bs {cartTotal}</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>Envío</span><span className="text-xs">Por calcular</span></div>
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-slate-200">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">Bs {cartTotal}</span>
              </div>
            </div>
            <button type="submit" form="checkout-form" className="w-full mt-8 bg-[#128C7E] text-white py-4 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-[#075E54] transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
              Confirmar Pedido <ArrowRight size={16} />
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-wider font-bold">Finalizarás la compra en WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🏠 VISTA: INICIO (HOME)
// ==========================================
function HomeView({ navigateTo }) {
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
            <button onClick={() => navigateTo('products')} className="hidden md:flex text-xs font-bold uppercase tracking-widest border-b border-slate-900 pb-1 hover:text-slate-500 transition-colors">Ver todo catálogo</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {featured.map((product) => <ProductCard key={product.id} product={product} onClick={() => navigateTo('product-detail', product)} />)}
        </div>
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
                <div key={product.id} className="min-w-[240px] md:min-w-0 snap-start group flex flex-col cursor-pointer" onClick={() => navigateTo('product-detail', product)}>
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
// 🛍️ VISTA: PRODUCTOS (CATÁLOGO MINIMALISTA)
// ==========================================
function ProductsView({ navigateTo }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizesFilter, setSelectedSizesFilter] = useState([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      const matchesSize = selectedSizesFilter.length === 0 || product.sizes.some(size => selectedSizesFilter.includes(size));
      return matchesSearch && matchesPrice && matchesSize;
    });
  }, [searchQuery, maxPrice, selectedSizesFilter]);

  const toggleSizeFilter = (size) => setSelectedSizesFilter(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const allAvailableSizes = ["S", "M", "L", "XL", "30", "32", "34"];

  const FilterPanel = () => (
    <div className="space-y-8">
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={16} />
          <input type="text" placeholder="Ej. Polera negra..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-none pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Precio Máximo</label>
          <span className="text-xs font-bold text-slate-900">Bs {maxPrice}</span>
        </div>
        <input type="range" min="50" max="500" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-slate-900" />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Tallas</label>
        <div className="flex flex-wrap gap-2">
          {allAvailableSizes.map(size => (
            <button key={size} onClick={() => toggleSizeFilter(size)} className={`w-10 h-10 border text-xs font-bold flex items-center justify-center transition-colors ${selectedSizesFilter.includes(size) ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-slate-500 hover:border-slate-400'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 border-b border-slate-100 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>Inicio</span> <ChevronRight size={12}/> <span className="text-slate-900">Catálogo</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Colección Completa</h2>
          <p className="text-sm text-slate-500 mt-2">{filteredProducts.length} productos disponibles</p>
        </div>
        <button onClick={() => setShowMobileFilters(true)} className="md:hidden w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-900 py-3 text-xs font-bold uppercase tracking-widest">
          <SlidersHorizontal size={16} /> Mostrar Filtros
        </button>
      </div>

      <div className="flex gap-10">
        <aside className="hidden md:block w-64 shrink-0 sticky top-32 h-fit"><FilterPanel /></aside>
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="mx-auto text-slate-300 mb-4" size={48} strokeWidth={1} />
              <h3 className="text-lg font-black text-slate-900 mb-2">Sin resultados</h3>
              <p className="text-sm text-slate-500">Intenta ajustar tus filtros o buscar otra prenda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {filteredProducts.map((product) => <ProductCard key={product.id} product={product} onClick={() => navigateTo('product-detail', product)} />)}
            </div>
          )}
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 w-full bg-white rounded-t-[2rem] p-6 animate-in slide-in-from-bottom max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black uppercase tracking-widest">Filtros</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 p-2 -mr-2"><X size={24}/></button>
            </div>
            <FilterPanel />
            <button onClick={() => setShowMobileFilters(false)} className="w-full mt-8 bg-slate-900 text-white py-4 text-xs font-black uppercase tracking-widest">Ver {filteredProducts.length} productos</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 🔎 VISTA: DETALLE DEL PRODUCTO (PDP) CON CORRECCIÓN DE ERROR
// ==========================================
function ProductDetailView({ product, navigateTo, addToCart }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeError, setSizeError] = useState(false); // NUEVO ESTADO PARA ERROR DE TALLA

  if (!product) return <PlaceholderView title="Producto no encontrado" />;
  const gallery = product.gallery || [product.image];

  // Función manejadora corregida
  const handleAddToCartClick = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000); // Quita el error después de 3 segundos
    } else {
      setSizeError(false);
      addToCart(product, selectedSize);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-6">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 cursor-pointer">
        <span onClick={() => navigateTo('home')} className="hover:text-slate-900">Inicio</span> <ChevronRight size={12}/> 
        <span onClick={() => navigateTo('products')} className="hover:text-slate-900">Catálogo</span> <ChevronRight size={12}/> 
        <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
        <div className="flex-1 md:w-3/5">
          <div className="relative aspect-[3/4] md:aspect-auto md:h-[70vh] bg-slate-100 overflow-hidden mb-4">
            <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover object-center animate-in fade-in duration-500" key={activeImage} />
            {!product.inStock && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-white px-6 py-3 text-xs font-black uppercase tracking-widest text-slate-900">Agotado</span>
                </div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {gallery.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`relative w-20 h-24 shrink-0 overflow-hidden ${activeImage === idx ? 'ring-1 ring-slate-900' : 'opacity-60 hover:opacity-100 transition-opacity'}`}>
                  <img src={img} alt={`Vista ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-2/5 md:sticky md:top-32 h-fit">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{product.category}</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-8">
             <span className={`text-2xl font-black ${product.discount ? 'text-[#b91c1c]' : 'text-slate-900'}`}>Bs {product.price}</span>
             {product.discount && <span className="text-sm font-light text-slate-400 line-through">Bs {product.oldPrice}</span>}
          </div>
          <p className="text-sm text-slate-600 font-light leading-relaxed mb-8">{product.description || "Prenda esencial."}</p>

          {product.inStock ? (
            <div className="mb-10 border-t border-b border-slate-100 py-8">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Seleccionar Talla</label>
              </div>
              
              {/* MENSAJE DE ERROR VISUAL (Reemplazo del Alert) */}
              {sizeError && (
                <p className="text-xs font-bold text-red-500 mb-3 animate-pulse">⚠️ Por favor, selecciona una talla primero.</p>
              )}

              <div className="flex flex-wrap gap-3 mb-8">
                  {product.sizes.map(size => (
                      <button 
                        key={size} 
                        onClick={() => { setSelectedSize(size); setSizeError(false); }} 
                        className={`w-14 h-14 border text-sm font-bold flex items-center justify-center transition-colors ${selectedSize === size ? 'border-slate-900 bg-slate-900 text-white shadow-md' : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'}`}
                      >
                          {size}
                      </button>
                  ))}
              </div>
              
              <button onClick={handleAddToCartClick} className="w-full py-5 bg-[#0F172A] text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors active:scale-[0.98] flex justify-center items-center gap-2">
                  <ShoppingBag size={18} /> Añadir a la Bolsa
              </button>
            </div>
          ) : (
            <div className="mb-10 border-t border-b border-slate-100 py-8">
              <div className="bg-slate-50 border border-slate-200 text-slate-500 py-5 text-center text-xs font-black uppercase tracking-widest">Actualmente Agotado</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 🧩 COMPONENTES REUTILIZABLES
// ==========================================

function ProductCard({ product, onClick }) {
  return (
    <div className="group flex flex-col cursor-pointer" onClick={onClick}>
      <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden mb-4">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" />
          <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center">
             <span className="bg-white px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl">Ver Producto</span>
          </div>
          {!product.inStock && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center z-10">
                  <span className="bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-900">Agotado</span>
              </div>
          )}
          {product.discount && product.inStock && (
              <div className="absolute top-3 left-3 bg-[#b91c1c] text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest z-10">Sale</div>
          )}
      </div>
      <div className="flex justify-between items-start mb-3">
          <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{product.category}</p>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide group-hover:text-slate-500 transition-colors">{product.name}</h4>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-sm font-black ${product.discount ? 'text-[#b91c1c]' : 'text-slate-900'}`}>Bs {product.price}</span>
            {product.discount && <span className="text-xs font-light text-slate-400 line-through">Bs {product.oldPrice}</span>}
          </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-24">
      <div className="w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center mb-6"><SlidersHorizontal className="text-slate-300" size={24} /></div>
      <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 max-w-md">Esta sección está siendo diseñada.</p>
    </div>
  );
}
