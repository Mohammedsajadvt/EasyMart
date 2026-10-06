import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://easymart-cew3.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const driverToken = localStorage.getItem('driverToken');
  if (driverToken) {
    config.headers.Authorization = `Bearer ${driverToken}`;
  }
  return config;
});

export const deliveryAPI = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),

  // Orders / Deliveries
  getOrders: () => api.get('/staff/delivery/my-trips'),
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  updateLocation: (driverId, data) => api.put(`/staff/delivery/${driverId}/location`, data),

  // Health
  getHealth: () => api.get('/health'),
};

export default api;
