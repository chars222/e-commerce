import React, { useState, useEffect } from 'react';
import { LogOut,Image as ImageIcon, Edit3, X, Trash2 } from 'lucide-react';
import { ImageManagerModal } from './ImageManagerModal';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: { name: string };
  gallery?: string[];
}

// Configuración de API a prueba de fallos
const getApiUrl = () => {
  try { return import.meta.env.VITE_API_URL; } catch (error) { return null; }
};
const API_URL = getApiUrl() || 'http://localhost:3000';

export const AdminDashboard = ({ token, onLogout }: AdminDashboardProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setProducts(await res.json());
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchProducts(); }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 w-full">
      {/* Cabecera / Navbar del Admin */}
      <div className="bg-white border-b border-slate-200 px-6 lg:px-12 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
        <h1 className="text-xl font-black tracking-tight text-slate-900">
            CENTRAL <span className="text-slate-400 font-medium">| Studio</span>
        </h1>
        <button onClick={onLogout} className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2">
          <LogOut size={16} /> <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 sm:mt-10">
        <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Tus Productos</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Gestiona las fotografías y galería de tu catálogo web.</p>
            </div>
        </div>

        {loading ? (
           <p className="text-center font-bold text-slate-400 py-20">Cargando catálogo...</p>
        ) : (
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            {products.map(p => (
              /* CONTENEDOR PRINCIPAL: Columna en móvil, Fila en Desktop */
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 sm:p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                
                {/* GRUPO 1: IMAGEN Y TEXTOS (Siempre alineados horizontalmente) */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-16 h-20 sm:w-20 sm:h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                      {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                          <ImageIcon className="text-slate-300" size={24} />
                      )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 truncate">
                        {p.category?.name || 'General'}
                    </p>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate pr-2 mt-0.5">
                        {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">
                        Bs {p.price} <span className="mx-1">•</span> {(p.gallery || []).length} fotos
                    </p>
                  </div>
                </div>

                {/* GRUPO 2: BOTÓN DE ACCIÓN (Ancho completo en móvil, oculto por defecto en desktop) */}
                <button 
                    onClick={() => setEditingProduct(p)} 
                    className="w-full sm:w-auto bg-slate-900 text-white px-5 py-3.5 sm:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest sm:opacity-0 sm:group-hover:opacity-100 transition-all focus:opacity-100 flex items-center justify-center gap-2 shrink-0 mt-1 sm:mt-0 active:scale-95 sm:active:scale-100 shadow-md sm:shadow-none"
                >
                    <Edit3 size={16} className="sm:w-4 sm:h-4"/> Editar Fotos
                </button>
                
              </div>
            ))}
            
            {products.length === 0 && (
                <div className="text-center py-16">
                    <ImageIcon className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-500 font-medium">No tienes productos registrados en el POS.</p>
                </div>
            )}
          </div>
        )}
      </div>

      {editingProduct && (
        <ImageManagerModal 
            product={editingProduct} 
            token={token} 
            onClose={() => setEditingProduct(null)} 
            onRefresh={fetchProducts} 
        />
      )}
    </div>
  );
}