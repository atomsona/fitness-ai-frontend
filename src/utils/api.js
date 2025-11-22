import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // ✅ CRITICAL: This sends cookies
  headers: {
    'Content-Type': 'application/json' // ✅ CRITICAL: This tells server it's JSON
  }
});

let accessToken = localStorage.getItem('accessToken');

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true } // ✅ Include credentials for refresh
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