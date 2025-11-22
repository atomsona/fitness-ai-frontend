import axios from 'axios';

// Determine API URL based on environment
const getApiUrl = () => {
  // In production (Vercel)
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://fitness-ai-backend-nine.vercel.app/api';
  }
  // In development (localhost)
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API Base URL:', getApiUrl()); // Debug

let accessToken = localStorage.getItem('accessToken');

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${getApiUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

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