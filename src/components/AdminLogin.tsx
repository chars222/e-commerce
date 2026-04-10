import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight, LogOut, Image as ImageIcon, Edit3, X, Trash2 } from 'lucide-react';


const getApiUrl = () => {
  try { return import.meta.env.VITE_API_URL; } catch (error) { return null; }
};
const API_URL = getApiUrl() || 'http://localhost:3000';
export const AdminLogin = ({ onLogin }: { onLogin: (token: string, user: any) => void }) => {
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