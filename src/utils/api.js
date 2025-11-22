import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send cookies
  headers: { 'Content-Type': 'application/json' }
});

let accessToken = localStorage.getItem('accessToken');

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 → refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        accessToken = data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem('accessToken', token);
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem('accessToken');
};

export default api;
