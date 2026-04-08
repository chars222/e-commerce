import { X } from 'lucide-react';
import {  useNavigate} from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface CartItem {
  cartId: string;
  image: string;
  name: string;
  selectedSize: string;
  price: number;
}

interface CartDrawerProps {
  cart: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  removeFromCart: (cartId: string) => void;
  cartTotal: number;
}

export const CartDrawer = ({ cart, setIsCartOpen, removeFromCart, cartTotal }: CartDrawerProps) => {
  const navigate = useNavigate();

  const handleCheckoutNav = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="absolute inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight uppercase">Tu Bolsa ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-2 -mr-2"><X size={28} strokeWidth={1.5} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                      <ShoppingBag size={56} strokeWidth={1} />
                      <p className="text-sm font-medium uppercase tracking-widest">Tu bolsa está vacía</p>
                  </div>
              ) : (
                  cart.map((item) => (
                      <div key={item.cartId} className="flex gap-6 group">
                          <div className="w-24 h-32 bg-slate-50 shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 py-1 relative">
                              <div className="flex justify-between items-start">
                                  <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide leading-tight pr-6">{item.name}</h4>
                                  <button onClick={() => removeFromCart(item.cartId)} className="absolute top-0 right-0 text-slate-300 hover:text-[#b91c1c] transition-colors"><X size={16} /></button>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">Talla: {item.selectedSize}</p>
                              <p className="text-sm font-black text-slate-900 mt-2">Bs {item.price}</p>
                          </div>
                      </div>
                  ))
              )}
          </div>

          {cart.length > 0 && (
              <div className="border-t border-slate-100 p-8 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-6">
                      <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Subtotal</span>
                      <span className="text-2xl font-black text-slate-900">Bs {cartTotal}</span>
                  </div>
                  <button onClick={handleCheckoutNav} className="w-full bg-[#0F172A] text-white py-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-[0.98]">
                      Ir a Pagar <ArrowRight size={18} />
                  </button>
              </div>
          )}
      </div>
    </div>
  );
}