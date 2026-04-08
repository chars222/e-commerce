
import { Link, useLocation  } from 'react-router-dom';
import { ShoppingBag,  Menu } from 'lucide-react';

interface HeaderProps {
  cartLength: number;
  setIsCartOpen: (open: boolean) => void;
  setIsMenuOpen: (open: boolean) => void;
  scrolled: boolean;
}

export const Header = ({ cartLength, setIsCartOpen, setIsMenuOpen, scrolled }: HeaderProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={`fixed w-full top-0 z-40 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 py-4' : 'bg-transparent py-6'}`}>
      <div className="w-full px-6 lg:px-12 flex justify-between items-center relative">
        <div className="flex items-center flex-1">
          <button onClick={() => setIsMenuOpen(true)} className={`md:hidden ${isHome && !scrolled ? 'text-white' : 'text-slate-800'} p-2 -ml-2 hover:text-slate-500 transition-colors`}>
            <Menu size={28} strokeWidth={1.5} />
          </button>
          <nav className={`hidden md:flex gap-8 text-xs font-bold tracking-widest uppercase ${isHome && !scrolled ? 'text-white/90' : 'text-slate-600'}`}>
            <Link to="/" className={`hover:text-slate-400 transition-colors ${location.pathname === '/' ? 'opacity-100' : 'opacity-70'}`}>Inicio</Link>
            <Link to="/products" className={`hover:text-slate-400 transition-colors ${location.pathname === '/products' ? 'opacity-100' : 'opacity-70'}`}>Catálogo</Link>
            <Link to="/about" className={`hover:text-slate-400 transition-colors ${location.pathname === '/about' ? 'opacity-100' : 'opacity-70'}`}>Nosotros</Link>
          </nav>
        </div>

        <Link to="/" className={`text-2xl md:text-3xl font-black tracking-tighter absolute left-1/2 -translate-x-1/2 cursor-pointer ${isHome && !scrolled ? 'text-white' : 'text-slate-900'}`}>
          CENTRAL
        </Link>

        <div className="flex justify-end flex-1">
          <button onClick={() => setIsCartOpen(true)} className={`relative flex items-center gap-2 group p-2 -mr-2 ${isHome && !scrolled ? 'text-white' : 'text-slate-800'}`}>
            <span className="hidden md:block text-xs font-bold tracking-widest uppercase group-hover:opacity-70 transition-colors">Bolsa</span>
            <ShoppingBag size={26} strokeWidth={1.5} />
            {cartLength > 0 && (
              <span className="absolute -top-0 -right-0 w-4 h-4 bg-[#b91c1c] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {cartLength}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}