/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';

import { AdminLogin } from '../components/AdminLogin';
import { AdminDashboard } from '../components/AdminDashboard';  

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

