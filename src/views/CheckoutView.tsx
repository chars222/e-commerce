import {  useNavigate, useLocation, To } from 'react-router-dom';
import { X, ArrowRight,ShoppingBag,ChevronRight,Link, User,Phone,MapPin } from 'lucide-react';
import { useState } from 'react';

type CartItem = {
  cartId: string | number;
  name: string;
  image: string;
  price: number;
  selectedSize: string;
};

type CheckoutViewProps = {
  cart: CartItem[];
  removeFromCart: (cartId: string | number) => void;
  cartTotal: number;
};

export const CheckoutView = ({ cart, removeFromCart, cartTotal }: CheckoutViewProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', notes: '' });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFinalCheckout = (e: { preventDefault: () => void; }) => {
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
      <div className="pt-32 pb-20 w-full px-6 lg:px-12 text-center min-h-[70vh]">
        <ShoppingBag className="mx-auto text-slate-300 mb-6" size={64} strokeWidth={1} />
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-4">Tu bolsa está vacía</h2>
        <p className="text-slate-500 mb-8">Parece que aún no has seleccionado ninguna prenda.</p>
        <button onClick={() => navigate('/products')} className="bg-[#0F172A] text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors rounded-none">
            Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 w-full px-6 lg:px-12 min-h-[80vh]">
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 cursor-pointer">
        <Link to="/" className="hover:text-slate-900">Inicio</Link> <ChevronRight size={12}/> 
        <span className="text-slate-900">Finalizar Compra</span>
      </div>

      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-12">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 order-2 lg:order-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8 border-b border-slate-100 pb-4">Datos de Envío</h3>
          <form id="checkout-form" onSubmit={handleFinalCheckout} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><User size={14}/> Nombre Completo</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ej. Juan Pérez" className="w-full bg-white border border-slate-200 px-5 py-4 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><Phone size={14}/> Teléfono / WhatsApp</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Ej. 70012345" className="w-full bg-white border border-slate-200 px-5 py-4 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2"><MapPin size={14}/> Dirección de Entrega</label>
              <input required type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Calle, Número, Zona, Ciudad" className="w-full bg-white border border-slate-200 px-5 py-4 text-sm focus:outline-none focus:border-slate-900 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Instrucciones Especiales (Opcional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Detalles de la casa, horario de entrega preferido..." rows={4} className="w-full bg-white border border-slate-200 px-5 py-4 text-sm focus:outline-none focus:border-slate-900 transition-colors resize-none"></textarea>
            </div>
          </form>
        </div>

        <div className="lg:w-[450px] shrink-0 order-1 lg:order-2">
          <div className="bg-slate-50 p-8 border border-slate-100 lg:sticky lg:top-32">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-8">Resumen del Pedido</h3>
            <div className="space-y-6 mb-8 max-h-[35vh] overflow-y-auto pr-4">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-4">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover bg-slate-200" />
                    <div className="flex-1 py-1 relative">
                        <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wide leading-tight pr-6">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-2">Talla: {item.selectedSize}</p>
                        <p className="text-sm font-black text-slate-900 mt-2">Bs {item.price}</p>
                        <button onClick={() => removeFromCart(item.cartId)} className="absolute top-0 right-0 text-slate-300 hover:text-[#b91c1c] transition-colors"><X size={16} /></button>
                    </div>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-8 space-y-4">
              <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>Bs {cartTotal}</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>Envío</span><span className="text-xs">Por calcular</span></div>
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-200">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-900">Total</span>
                <span className="text-3xl font-black text-slate-900">Bs {cartTotal}</span>
              </div>
            </div>
            <button type="submit" form="checkout-form" className="w-full mt-10 bg-[#128C7E] text-white py-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest hover:bg-[#075E54] transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
              Confirmar Pedido <ArrowRight size={18} />
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-5 uppercase tracking-wider font-bold">Finalizarás la compra en WhatsApp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
