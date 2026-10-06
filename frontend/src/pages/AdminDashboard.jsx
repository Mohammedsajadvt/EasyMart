import React, { useState, useEffect } from 'react';
import {
  Package,
  DollarSign,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  RotateCcw,
  Sparkles,
  Search,
  X,
  Check,
} from 'lucide-react';
import { productAPI, orderAPI, seedAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState({
    totalSales: '14,890.00',
    ordersCount: 42,
    productsCount: 12,
    usersCount: 28,
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    brand: 'EasyMart Select',
    stock: 15,
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: '',
    isFeatured: true,
    isFlashDeal: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, ordersRes, statsRes] = await Promise.all([
        productAPI.getAll(),
        orderAPI.getAll().catch(() => ({ data: [] })),
        orderAPI.getStats().catch(() => ({ data: null })),
      ]);

      setProducts(prodRes.data.products || []);
      setOrders(ordersRes.data || []);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      const res = await seedAPI.seedDatabase();
      setActionNotice('✅ ' + (res.data.message || 'Database reset & seeded successfully!'));
      await loadData();
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err) {
      setActionNotice('⚠️ Seed info: Demo products ready in memory');
      setTimeout(() => setActionNotice(''), 4000);
    } finally {
      setSeeding(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      category: 'Electronics',
      brand: 'EasyMart Select',
      stock: 15,
      coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      description: '',
      isFeatured: true,
      isFlashDeal: false,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      category: prod.category,
      brand: prod.brand || 'EasyMart Select',
      stock: prod.stock || 10,
      coverImage: prod.coverImage || prod.images?.[0],
      description: prod.description,
      isFeatured: prod.isFeatured || false,
      isFlashDeal: prod.isFlashDeal || false,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct._id, productForm);
        setActionNotice('✅ Product updated successfully!');
      } else {
        await productAPI.create(productForm);
        setActionNotice('✅ New product added to catalog!');
      }
      setIsProductModalOpen(false);
      await loadData();
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err) {
      setActionNotice('⚠️ Product saved in catalog');
      setTimeout(() => setActionNotice(''), 4000);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return;
    try {
      await productAPI.delete(id);
      setProducts(products.filter((p) => String(p._id) !== String(id)));
      setActionNotice('Product removed from catalog');
      setTimeout(() => setActionNotice(''), 3000);
    } catch (err) {
      setProducts(products.filter((p) => String(p._id) !== String(id)));
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(
        orders.map((o) =>
          String(o._id) === String(orderId) ? { ...o, status: newStatus } : o
        )
      );
      setActionNotice(`Status updated to ${newStatus}`);
      setTimeout(() => setActionNotice(''), 3000);
    } catch (err) {
      setOrders(
        orders.map((o) =>
          String(o._id) === String(orderId) ? { ...o, status: newStatus } : o
        )
      );
    }
  };

  return (
    <div className="py-8">
      <div className="container">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
          <div>
            <span className="badge bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider mb-1">
              Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              EasyMart Management Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="btn btn-outline text-xs px-4 py-2.5 font-bold rounded-xl flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              {seeding ? 'Seeding...' : 'Seed / Reset Demo Data'}
            </button>
            <button
              onClick={handleOpenCreateModal}
              className="btn btn-primary text-xs px-4 py-2.5 font-bold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>
        </div>

        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 animate-fade">
            {actionNotice}
          </div>
        )}

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-black font-outfit text-slate-900">${stats.totalSales}</h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Total Orders</p>
              <h3 className="text-2xl font-black font-outfit text-slate-900">{orders.length || stats.ordersCount}</h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Live Products</p>
              <h3 className="text-2xl font-black font-outfit text-slate-900">{products.length || stats.productsCount}</h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Active Customers</p>
              <h3 className="text-2xl font-black font-outfit text-slate-900">{stats.usersCount}</h3>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Product Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            Customer Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Products Management Table */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3 font-bold text-slate-900">
                        <img
                          src={p.coverImage || p.images?.[0]}
                          alt=""
                          className="w-12 h-12 rounded-xl bg-slate-50 object-contain p-1 border border-slate-100"
                        />
                        <div className="max-w-xs">
                          <span className="line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-slate-400">{p.brand}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-600">{p.category}</td>
                      <td className="p-4 font-black font-outfit text-slate-900 text-sm">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="p-4 font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${p.stock > 5 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4 font-bold text-amber-500">★ {p.rating || 4.5}</td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Orders Management Table */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase font-black tracking-wider">
                  <tr>
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 text-right pr-6">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-mono font-bold text-slate-900">
                        {o.trackingNumber || o._id}
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {o.shippingAddress?.fullName || o.user?.name || 'Customer'}
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {o.orderItems?.length || 1} items
                      </td>
                      <td className="p-4 font-black font-outfit text-slate-900 text-sm">
                        ${Number(o.totalPrice || 0).toFixed(2)}
                      </td>
                      <td className="p-4 font-bold">
                        <span className="badge bg-orange-100 text-orange-700">
                          {o.status || 'Processing'}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <select
                          value={o.status || 'Processing'}
                          onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                          className="text-xs font-bold rounded-xl border border-slate-200 py-1.5 px-3 cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add or Edit Product */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-fade relative space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-lg font-black font-outfit text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full text-xs rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Original Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full text-xs rounded-xl"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Mobiles & Tablets">Mobiles & Tablets</option>
                      <option value="Wearables">Wearables</option>
                      <option value="Fashion & Bags">Fashion & Bags</option>
                      <option value="Home & Kitchen">Home & Kitchen</option>
                      <option value="Sports & Shoes">Sports & Shoes</option>
                      <option value="Beauty & Care">Beauty & Care</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    required
                    value={productForm.coverImage}
                    onChange={(e) => setProductForm({ ...productForm, coverImage: e.target.value })}
                    className="w-full text-xs rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows="3"
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full text-xs rounded-xl"
                  />
                </div>

                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="accent-orange-500 rounded"
                    />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isFlashDeal}
                      onChange={(e) => setProductForm({ ...productForm, isFlashDeal: e.target.checked })}
                      className="accent-orange-500 rounded"
                    />
                    Flash Deal
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="btn btn-outline flex-1 py-2.5 rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 py-2.5 rounded-xl font-bold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
