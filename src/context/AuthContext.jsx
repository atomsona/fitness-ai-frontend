import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, clearAccessToken } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('accessToken') || params.get('token');

    if (urlToken) {
      setAccessToken(urlToken);
      (async () => {
        try {
          await fetchUser();
        } catch {
          clearAccessToken();
        }
        const cleanUrl = window.location.origin + window.location.pathname + window.location.hash;
        window.history.replaceState(null, '', cleanUrl);
        window.location.replace('/dashboard');
      })();
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (token) fetchUser();
    else setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth');
      setUser(data);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch {}
    finally { clearAccessToken(); setUser(null); }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`;
  };

  // ✅ This is what Quest completion will call
  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, googleLogin, setUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
