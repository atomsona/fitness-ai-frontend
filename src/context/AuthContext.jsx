import React, { createContext, useContext } from 'react';
import api, { setAccessToken, clearAccessToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    setAccessToken(res.data.accessToken);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAccessToken(res.data.accessToken);
    return res.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    clearAccessToken();
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <AuthContext.Provider value={{ register, login, logout, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
