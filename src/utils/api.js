import axios from 'axios';

const getApiUrl = () => import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || 'https://fitness-ai-backend-nine.vercel.app/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${getApiUrl()}/auth/refresh`, {}, { withCredentials: true });
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const setAccessToken = (token) => localStorage.setItem('accessToken', token);
export const clearAccessToken = () => localStorage.removeItem('accessToken');
export default api;
