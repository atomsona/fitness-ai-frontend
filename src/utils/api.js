import axios from 'axios';

const getApiUrl = () =>
  import.meta.env.PROD
    ? (import.meta.env.VITE_API_URL || 'https://fitness-ai-backend-nine.vercel.app/api')
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setAccessToken = (token) => localStorage.setItem('accessToken', token);
export const clearAccessToken = () => localStorage.removeItem('accessToken');

export default api;
