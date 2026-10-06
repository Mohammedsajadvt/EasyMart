const bcrypt = require('bcryptjs');
const initialProducts = require('../data/products');
const initialCategories = require('../data/categories');
const initialFestivals = require('../data/indianFestivals');

// In-Memory Persistent Datastore
let inMemoryUsers = [
  {
    _id: 'user_admin_001',
    name: 'Mohammed Sajad',
    email: 'mohammedsajadvt@gmail.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user_admin_002',
    name: 'EasyMart Administrator',
    email: 'admin@easymart.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user_customer_001',
    name: 'Alex Johnson',
    email: 'customer@easymart.com',
    password: 'password123',
    role: 'user',
    phone: '+1 (555) 234-5678',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
    },
    createdAt: new Date().toISOString(),
  },
];

(async () => {
  for (let u of inMemoryUsers) {
    if (!u.password.startsWith('$2a$') && !u.password.startsWith('$2b$')) {
      u.password = await bcrypt.hash(u.password, 10);
    }
  }
})();

let inMemoryProducts = initialProducts.map((p, index) => ({
  ...p,
  _id: `prod_mem_${index + 1}`,
  createdAt: new Date().toISOString(),
}));

let inMemoryCategories = initialCategories.map((c, index) => ({
  ...c,
  _id: `cat_mem_${index + 1}`,
  createdAt: new Date().toISOString(),
}));

let inMemoryFestivals = initialFestivals.map((f, index) => ({
  ...f,
  _id: `fest_mem_${index + 1}`,
  createdAt: new Date().toISOString(),
}));

let inMemoryOrders = [
  {
    _id: 'EM-94810234',
    trackingNumber: 'EM-94810234',
    user: 'user_customer_001',
    orderItems: [
      {
        name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
        qty: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
        price: 349.99,
        product: 'prod_mem_1',
      },
      {
        name: 'Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray)',
        qty: 1,
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80',
        price: 1199.99,
        product: 'prod_mem_6',
      }
    ],
    shippingAddress: {
      fullName: 'Alex Johnson',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States',
      phone: '+1 (555) 234-5678',
    },
    paymentMethod: 'Credit Card',
    itemsPrice: 1549.98,
    taxPrice: 77.50,
    shippingPrice: 0.0,
    discountPrice: 0.0,
    totalPrice: 1627.48,
    isPaid: true,
    status: 'Processing',
    createdAt: new Date().toISOString(),
  },
];

module.exports = {
  inMemoryUsers,
  inMemoryProducts,
  inMemoryCategories,
  inMemoryFestivals,
  inMemoryOrders,
};
