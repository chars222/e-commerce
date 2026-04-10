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
      <div className="bg-white border-b border-slate-200 px-6 lg:px-12 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-xl font-black tracking-tight text-slate-900">CENTRAL <span className="text-slate-400 font-medium">| Studio</span></h1>
        <button onClick={onLogout} className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-2">
          <LogOut size={16} /> Salir
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-black text-slate-900">Tus Productos</h2>
                <p className="text-sm text-slate-500 mt-1">Gestiona las fotografías y galería de tu catálogo web.</p>
            </div>
        </div>

        {loading ? (
           <p className="text-center font-bold text-slate-400 py-20">Cargando catálogo...</p>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            {products.map(p => (
              <div key={p.id} className="flex items-center gap-6 p-6 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                    {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="text-slate-300" size={24} />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.category?.name}</p>
                  <h3 className="text-sm font-bold text-slate-900 truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">Bs {p.price} • Galería: {(p.gallery || []).length} fotos</p>
                </div>
                <button onClick={() => setEditingProduct(p)} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 flex items-center gap-2">
                    <Edit3 size={14}/> Editar Fotos
                </button>
              </div>
            ))}
            {products.length === 0 && <p className="text-center text-slate-400 font-bold py-10">No tienes productos registrados en el POS.</p>}
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