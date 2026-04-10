import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import {Header} from './components/Header';
import {MobileMenu} from './components/MobileMenu';
import {Footer} from './components/Footer';
import {CheckoutView} from './views/CheckoutView';
import {HomeView} from './views/HomeView';
import {ProductsView} from './views/ProductsView'; 
import {ProductDetailView} from './views/ProductDetailView'; 
import {CartDrawer} from './components/CartDrawer';
import {AdminPortal} from './views/AdminPortal';


// --- COMPONENTE: ScrollToTop (Maneja el scroll al cambiar de ruta) ---
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PlaceholderView({ title }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-24">
      <div className="w-20 h-20 border-2 border-slate-200 rounded-full flex items-center justify-center mb-8"><SlidersHorizontal className="text-slate-300" size={32} /></div>
      <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">{title}</h2>
      <p className="text-slate-500 max-w-md text-lg">Esta sección está siendo diseñada.</p>
    </div>
  );
}

// ==========================================
// 🚀 5. APLICACIÓN PRINCIPAL (Router)
// ==========================================

// Este componente envuelve el contenido para poder usar los Hooks del Router (useLocation)
function AppContent() {
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

  const addToCart = (product, selectedSize) => {
    setCart([...cart, { ...product, cartId: Date.now(), selectedSize }]);
    setIsCartOpen(true); 
  };

  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A] selection:bg-slate-200 flex flex-col w-full">
      
      <Header cartLength={cart.length} setIsCartOpen={setIsCartOpen} setIsMenuOpen={setIsMenuOpen} scrolled={scrolled} />
      
      {isMenuOpen && <MobileMenu setIsMenuOpen={setIsMenuOpen} />}

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/products" element={<ProductsView />} />
          <Route path="/product/:id" element={<ProductDetailView addToCart={addToCart} />} />
          <Route path="/checkout" element={<CheckoutView cart={cart} removeFromCart={removeFromCart} cartTotal={cartTotal} />} />
          <Route path="/about" element={<PlaceholderView title="Sobre Nosotros" />} />
          <Route path="/contact" element={<PlaceholderView title="Contáctanos" />} />
          {/* <-- NUEVA RUTA DE ADMINISTRACIÓN --> */}
          <Route path="/admin/*" element={<AdminPortal />} />
        </Routes>
      </main>

      <Footer />

      {isCartOpen && <CartDrawer cart={cart} setIsCartOpen={setIsCartOpen} removeFromCart={removeFromCart} cartTotal={cartTotal} />}
      
    </div>
  );
}

// Punto de Entrada Real (El Router Wrapper)
export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}