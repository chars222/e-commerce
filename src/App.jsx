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

// ==========================================
// 📦 2. BASE DE DATOS (Simulada)
// ==========================================
const ALL_PRODUCTS = [
  { id: 1, name: "POLERA BÁSICA OVERSIZE", price: 125, category: "Poleras", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1583744760882-96947ac0d9fc?auto=format&fit=crop&q=80&w=800"], description: "Nuestra polera insignia. Confeccionada en algodón pima peruano al 100%, ofrece una caída pesada y estructurada ideal para el día a día.", details: ["100% Algodón Pima", "Gramaje grueso (240gsm)", "Corte Oversize"], sizes: ["S", "M", "L"], inStock: true, featured: true },
  { id: 2, name: "CAMISA OXFORD ESSENTIAL", price: 180, category: "Camisas", image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800"], description: "Una pieza atemporal para cualquier armario. Algodón transpirable con textura clásica Oxford.", details: ["100% Algodón Orgánico", "Botones de nácar", "Corte Relaxed"], sizes: ["M", "L", "XL"], inStock: true, featured: true },
  { id: 3, name: "JEANS PREMIUM SKINNY", price: 250, category: "Pantalones", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800"], description: "Denim elástico de alta recuperación.", details: ["98% Algodón, 2% Elastano"], sizes: ["30", "32", "34"], inStock: false, featured: true },
  { id: 4, name: "CHAQUETA DENIM VINTAGE", price: 320, category: "Abrigos", image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800", gallery: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?auto=format&fit=crop&q=80&w=800"], description: "Denim rígido con lavado a la piedra para un look desgastado auténtico.", details: ["100% Algodón pesado"], sizes: ["S", "M"], inStock: true, featured: true },
  { id: 101, name: "POLERA PIMA BLANCA", price: 90, oldPrice: 130, category: "Poleras", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600"], description: "Suavidad inigualable para tu día a día.", details: ["Algodón Pima", "Cuello redondo"], sizes: ["S", "M"], inStock: true, discount: true },
  { id: 102, name: "POLERA CUELLO V GRIS", price: 85, oldPrice: 120, category: "Poleras", image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600", gallery: ["https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600"], description: "Corte entallado que resalta la figura.", details: ["Mezcla de algodón y poliéster"], sizes: ["M", "L", "XL"], inStock: true, discount: true },
];

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