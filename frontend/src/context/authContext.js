import React, { createContext, useState, useEffect } from 'react';
import { apiAuth } from '../services/api';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedUser = localStorage.getItem('@PortalBits:user');
    const storagedToken = localStorage.getItem('@PortalBits:token');

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const response = await apiAuth.post('/login', { email, password });
      
      const { token, usuario } = response.data; 

      localStorage.setItem('@PortalBits:user', JSON.stringify(usuario));
      localStorage.setItem('@PortalBits:token', token);
      
      setUser(usuario);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem('@PortalBits:user');
    localStorage.removeItem('@PortalBits:token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}