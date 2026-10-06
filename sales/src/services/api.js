import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://easymart-cew3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('salesToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const salesAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMyDashboard: () => api.get('/staff/sales/my-dashboard'),
  createLeadOrder: (data) => api.post('/staff/sales/create-lead-order', data),
  getProductsCatalog: () => api.get('/products'),
  getCategories: () => api.get('/categories'),
};

export default api;
