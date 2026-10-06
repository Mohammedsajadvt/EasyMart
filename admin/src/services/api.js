import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }
  return config;
});

export const adminAPI = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),

  // Analytics & Stats
  getStats: () => api.get('/orders/stats/summary'),
  getHealth: () => api.get('/health'),

  // Products
  getProducts: (params) => api.get('/products', { params }),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // Categories (Dynamic)
  getCategories: () => api.get('/categories'),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // Indian Festivals & Offers
  getFestivals: (date) => api.get('/festivals', { params: date ? { date } : {} }),
  getActiveFestival: (date) => api.get('/festivals/active', { params: date ? { date } : {} }),
  getByCurrentDate: (date) => api.get('/festivals/current-date', { params: date ? { date } : {} }),
  autoDetectTodayFestival: (date) => api.post('/festivals/auto-detect-today', { date }),
  toggleFestival: (id) => api.put(`/festivals/${id}/toggle`),
  applyFestivalOffers: (id, data) => api.post(`/festivals/${id}/apply-offers`, data),
  syncIndianCalendar: () => api.post('/festivals/sync-calendar'),
  createFestival: (data) => api.post('/festivals', data),

  // Orders
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  processReturn: (id, data) => api.put(`/orders/${id}/return-process`, data),
  deleteOrder: (id) => api.delete(`/orders/${id}`),

  // Users
  getUsers: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, { role }),

  // Delivery Fleet & Logistics (Amazon / Flipkart Model)
  getDeliveryFleet: () => api.get('/staff/delivery'),
  createDeliveryPartner: (data) => api.post('/staff/delivery', data),
  updateDeliveryStatus: (id, data) => api.put(`/staff/delivery/${id}/location`, data),
  assignOrderDelivery: (orderId, driverId, pickupHub) =>
    api.put(`/staff/assign-delivery/${orderId}`, { driverId, pickupHub }),

  // Sales Representatives Team
  getSalesTeam: () => api.get('/staff/sales'),
  createSalesRepresentative: (data) => api.post('/staff/sales', data),
  assignOrderSales: (orderId, salesRepId, salesCode) =>
    api.put(`/staff/assign-sales/${orderId}`, { salesRepId, salesCode }),
  deleteStaff: (id) => api.delete(`/staff/${id}`),

  // Seed / Reset
  seedDatabase: () => api.post('/seed/seed'),
};

export default api;
