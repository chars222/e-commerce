import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, LogOut, Image as ImageIcon, Edit3, X, Trash2 } from 'lucide-react';

// Configuración de API a prueba de fallos
const getApiUrl = () => {
  try { return import.meta.env.VITE_API_URL; } catch (error) { return null; }
};
const API_URL = getApiUrl() || 'http://localhost:3000';

// ==========================================
// 🛡️ VISTA PRINCIPAL (ENRUTADOR INTERNO)
// ==========================================
export function AdminPortal() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('adminUser') || 'null'));

  const handleLoginSuccess = (newToken: string, newUser: any) => {
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
  };

  // Si no está autenticado o no es dueño, mostramos Login
  if (!token || !user || user.role !== 'OWNER') {
    return <AdminLogin onLogin={handleLoginSuccess} />;
  }

  // Si es dueño autenticado, mostramos el Dashboard
  return <AdminDashboard token={token} onLogout={handleLogout} />;
}

// ==========================================
// 🔐 COMPONENTE: LOGIN DE ADMINISTRADOR
// ==========================================
function AdminLogin({ onLogin }: { onLogin: (token: string, user: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.user.role === 'OWNER') {
        onLogin(data.token, data.user);
      } else if (res.ok) {
        setError('Acceso denegado. Solo administradores.');
      } else {
        setError(data.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 w-full">
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center gap-2">
        <ChevronRight size={14} className="rotate-180"/> Volver a la Tienda
      </button>
      
      <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 shadow-sm border border-slate-100">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Gestión de Catálogo</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <input required type="email" placeholder="Correo de Administrador" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-900" />
            <input required type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-900" />
            
            {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 p-2 rounded-lg">{error}</p>}
            
            <button disabled={loading} type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 mt-4">
                {loading ? 'Verificando...' : 'Acceder al Panel'}
            </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 📊 COMPONENTE: DASHBOARD (LISTADO DE PRODUCTOS)
// ==========================================
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

function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
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

// ==========================================
// 🖼️ COMPONENTE: GESTOR DE IMÁGENES (MODAL)
// ==========================================
interface ImageManagerModalProps {
  product: Product;
  token: string;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}

function ImageManagerModal({ product, token, onClose, onRefresh }: ImageManagerModalProps) {
  const [imageUrl, setImageUrl] = useState(product.imageUrl || '');
  const [gallery, setGallery] = useState(product.gallery || []);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddGallery = () => {
      if(newGalleryUrl && !gallery.includes(newGalleryUrl)) {
          setGallery([...gallery, newGalleryUrl]);
          setNewGalleryUrl('');
      }
  };

  const handleRemoveGallery = (index: number) => {
      setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl, gallery })
      });
      if (res.ok) {
          onRefresh();
          onClose();
      } else {
          alert('Error al guardar imágenes');
      }
    } catch (err) {
        console.error(err);
        alert('Error de conexión');
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Editando Visuales</p>
                <h3 className="text-lg font-black text-slate-900 leading-none mt-1">{product.name}</h3>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><X size={24}/></button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-10">
            {/* PORTADA */}
            <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2"><ImageIcon size={18}/> 1. Portada (Principal)</h4>
                <p className="text-xs text-slate-500 mb-4">Esta es la imagen principal que aparece en la cuadrícula de la tienda.</p>
                
                <div className="flex gap-6">
                    <div className="w-32 h-40 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                        {imageUrl ? <img src={imageUrl} alt="Portada" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={32}/></div>}
                    </div>
                    <div className="flex-1 space-y-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">URL de la Imagen</label>
                        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://ejemplo.com/foto.jpg" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-900" />
                        <div className="bg-amber-50 text-amber-700 text-[10px] font-bold p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                            <span className="text-lg leading-none">💡</span>
                            <p>En el futuro, implementaremos la integración con AWS S3 para subir la foto directamente desde aquí.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* GALERÍA */}
            <div className="border-t border-slate-100 pt-8">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2"><ImageIcon size={18}/> 2. Galería de Fotos</h4>
                <p className="text-xs text-slate-500 mb-4">Estas fotos aparecerán cuando el cliente haga clic en el producto (Carrusel).</p>
                
                <div className="flex gap-2 mb-6">
                    <input type="text" value={newGalleryUrl} onChange={(e) => setNewGalleryUrl(e.target.value)} placeholder="Añadir URL de imagen a la galería..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-900" />
                    <button onClick={handleAddGallery} className="bg-slate-100 text-slate-700 font-bold px-6 rounded-xl hover:bg-slate-200 transition-colors">Añadir</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((url, idx) => (
                        <div key={idx} className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden group border border-slate-200">
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleRemoveGallery(idx)} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                    {gallery.length === 0 && (
                        <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-bold uppercase tracking-widest">
                            Galería vacía
                        </div>
                    )}
                </div>
            </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
        </div>
      </div>
    </div>
  );
}