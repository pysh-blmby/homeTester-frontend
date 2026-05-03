import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const storageStr = localStorage.getItem('auth-storage');
    if (storageStr) {
      try {
        const { state } = JSON.parse(storageStr);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (err) {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request');
      // Let the specific API caller (like checkAuth) handle state updates
    }
    return Promise.reject(error);
  }
);

export default api;
