import React, { useState, useRef } from 'react';
import { Image as ImageIcon, X, Trash2, UploadCloud, Loader2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  category?: { name: string };
  gallery?: string[];
}

interface ImageManagerModalProps {
  product: Product;
  token: string;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}

const getApiUrl = () => {
  try { return import.meta.env.VITE_API_URL; } catch (error) { return null; }
};
const API_URL = getApiUrl() || 'http://192.168.0.9:3000';

export const ImageManagerModal = ({ product, token, onClose, onRefresh }: ImageManagerModalProps) => {
  const [imageUrl, setImageUrl] = useState(product.imageUrl || '');
  const [gallery, setGallery] = useState(product.gallery || []);
  const [saving, setSaving] = useState(false);
  
  // Estados de carga individual para el UX
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Referencias a los inputs de tipo file ocultos
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // --- FUNCIÓN CENTRAL PARA SUBIR ARCHIVOS AL BACKEND ---
  const uploadFileToServer = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        // IMPORTANTE: Al usar FormData, NO se pone Content-Type, el navegador lo calcula automático
        body: formData 
      });

      const data = await res.json();
      if (res.ok) {
        // Concatenamos la URL del backend con la ruta de la imagen
        return `${API_URL}${data.url}`;
      } else {
        alert(data.error || 'Error al subir la imagen');
        return null;
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión al subir el archivo');
      return null;
    }
  };

  // Manejador para la Portada
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const uploadedUrl = await uploadFileToServer(file);
    if (uploadedUrl) {
        setImageUrl(uploadedUrl);
    }
    setUploadingCover(false);
    if (coverInputRef.current) coverInputRef.current.value = ''; // Limpiar input
  };

  // Manejador para la Galería
  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    // Subimos solo el primero (podrías hacer un loop si permites multiple)
    const uploadedUrl = await uploadFileToServer(files[0]);
    if (uploadedUrl && !gallery.includes(uploadedUrl)) {
        setGallery([...gallery, uploadedUrl]);
    }
    setUploadingGallery(false);
    if (galleryInputRef.current) galleryInputRef.current.value = ''; // Limpiar input
  };

  const handleRemoveGallery = (index: number) => {
      setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    console.log(imageUrl, gallery);
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
          alert('Error al guardar en base de datos');
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
                <p className="text-xs text-slate-500 mb-4">Esta es la imagen principal que aparece en el catálogo web y en el POS.</p>
                
                <div className="flex gap-6">
                    <div className="w-32 h-40 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200 relative group">
                        {uploadingCover ? (
                           <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm text-blue-600">
                               <Loader2 className="animate-spin mb-2" size={24} />
                               <span className="text-[10px] font-black uppercase">Subiendo...</span>
                           </div>
                        ) : imageUrl ? (
                            <img src={imageUrl} alt="Portada" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={32}/></div>
                        )}
                        
                        {/* Overlay para cambiar imagen si ya hay una */}
                        {imageUrl && !uploadingCover && (
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => coverInputRef.current?.click()} className="bg-white text-slate-900 text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-lg">Cambiar</button>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4 flex flex-col justify-center">
                        {/* Input Oculto */}
                        <input type="file" accept="image/*" ref={coverInputRef} onChange={handleCoverChange} className="hidden" />
                        
                        <button 
                            onClick={() => coverInputRef.current?.click()} 
                            disabled={uploadingCover}
                            className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 text-slate-600 rounded-xl py-6 flex flex-col items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <UploadCloud size={24} className="text-slate-400" />
                            <span className="text-sm font-bold">{imageUrl ? 'Reemplazar imagen de portada' : 'Haz clic para subir portada'}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">JPG, PNG o WEBP (Max 5MB)</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* GALERÍA */}
            <div className="border-t border-slate-100 pt-8">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2"><ImageIcon size={18}/> 2. Galería de Fotos</h4>
                        <p className="text-xs text-slate-500 mt-1">Fotos secundarias (Ej: detalles de la tela, vista trasera).</p>
                    </div>
                    
                    {/* Botón superior para agregar a galería */}
                    <input type="file" accept="image/*" ref={galleryInputRef} onChange={handleGalleryChange} className="hidden" />
                    <button 
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={uploadingGallery}
                        className="bg-slate-900 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50"
                    >
                        {uploadingGallery ? <Loader2 size={14} className="animate-spin"/> : <UploadCloud size={14}/>}
                        {uploadingGallery ? 'Subiendo...' : 'Agregar Foto'}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {gallery.map((url, idx) => (
                        <div key={idx} className="relative aspect-[3/4] bg-slate-100 rounded-xl overflow-hidden group border border-slate-200">
                            <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleRemoveGallery(idx)} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))}
                    
                    {gallery.length === 0 && (
                        <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <ImageIcon size={32} className="text-slate-300 mb-2"/>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Galería vacía</p>
                        </div>
                    )}
                </div>
            </div>

        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Cancelar</button>
            <button onClick={handleSave} disabled={saving} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50">
                {saving ? 'Guardando...' : 'Guardar y Publicar'}
            </button>
        </div>
      </div>
    </div>
  );
}