import {  useNavigate, useLocation, To } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';

export const MobileMenu = ({ setIsMenuOpen }: { setIsMenuOpen: (open: boolean) => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNav = (path: To) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-top-4 duration-300 md:hidden">
      <div className="w-full px-6 py-6 border-b border-slate-100 flex justify-between items-center">
         <h1 className="text-2xl font-black tracking-tighter text-slate-900">CENTRAL</h1>
         <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-slate-900 p-2 -mr-2 transition-colors">
           <X size={32} strokeWidth={1.5} />
         </button>
      </div>
      <div className="flex-1 flex flex-col justify-center px-10 gap-8">
        <button onClick={() => handleNav('/')} className={`text-left text-4xl font-black tracking-tight hover:text-slate-500 transition-colors ${location.pathname === '/' ? 'text-slate-900' : 'text-slate-300'}`}>Inicio</button>
        <button onClick={() => handleNav('/products')} className={`text-left text-4xl font-black tracking-tight hover:text-slate-500 transition-colors flex items-center gap-4 ${location.pathname.includes('/products') ? 'text-slate-900' : 'text-slate-300'}`}>
          Catálogo {location.pathname.includes('/products') && <ArrowRight size={32} className="text-[#b91c1c]" />}
        </button>
        <button onClick={() => handleNav('/about')} className={`text-left text-4xl font-black tracking-tight hover:text-slate-500 transition-colors ${location.pathname === '/about' ? 'text-slate-900' : 'text-slate-300'}`}>Nosotros</button>
        <button onClick={() => handleNav('/contact')} className={`text-left text-4xl font-black tracking-tight hover:text-slate-500 transition-colors ${location.pathname === '/contact' ? 'text-slate-900' : 'text-slate-300'}`}>Contáctanos</button>
      </div>
    </div>
  );
}