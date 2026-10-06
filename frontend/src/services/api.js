import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://easymart-cew3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token automatically if present
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getFeatured: () => api.get('/products/featured'),
  getFlashDeals: () => api.get('/products/flash-deals'),
  getCategories: () => api.get('/categories'),
  getById: (id) => api.get(`/products/${id}`),
  createReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

export const festivalAPI = {
  getActive: () => api.get('/festivals/active'),
  getByCurrentDate: (date) => api.get('/festivals/current-date', { params: date ? { date } : {} }),
  getAll: () => api.get('/festivals'),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/myorders'),
  getById: (id) => api.get(`/orders/${id}`),
  getAll: () => api.get('/orders'),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  requestReturn: (id, data) => api.post(`/orders/${id}/return`, data),
  getStats: () => api.get('/orders/stats/summary'),
};

export const seedAPI = {
  seedDatabase: () => api.post('/seed/seed'),
};

export default api;
