import { Link } from 'react-router-dom';
// ==========================================
// 🎨 1. ÍCONOS SVG PERSONALIZADOS
// ==========================================
const InstagramIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const FacebookIcon = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
export const Footer = () => {
  return (
    <footer className="bg-[#0F172A] text-white py-16 px-6 lg:px-12 mt-auto w-full">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-4">CENTRAL</h1>
              <p className="text-sm text-slate-400 mb-6 max-w-sm">Únete a nuestro club. Recibe acceso anticipado a nuevas colecciones y descuentos exclusivos.</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <input type="email" placeholder="Tu correo electrónico" className="bg-white/10 border border-white/20 text-white placeholder-slate-400 px-4 py-3 text-sm focus:outline-none focus:border-white w-full rounded-none" />
                  <button className="bg-white text-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors whitespace-nowrap rounded-none">Suscribirse</button>
              </div>
          </div>
          <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Ayuda</h4>
              <div className="flex flex-col gap-4 text-sm font-light text-slate-300">
                <Link to="/about" className="hover:text-white transition-colors">Envíos y Entregas</Link>
                <Link to="/about" className="hover:text-white transition-colors">Guía de Tallas</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Contáctanos</Link>
              </div>
          </div>
      </div>
      <div className="w-full mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-light">© 2026 Central Moda. Todos los derechos reservados.</p>
          <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-white transition-colors"><InstagramIcon size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><FacebookIcon size={20} /></a>
          </div>
      </div>
    </footer>
  );
}