import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let onUnauthorized = null;

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    const status = error.response?.status;

    if (status === 401 && message === 'Token expired') {
      localStorage.removeItem('token');
      if (onUnauthorized) {
        onUnauthorized('Your session has expired. Please log in again.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
