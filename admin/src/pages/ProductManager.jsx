import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  Sparkles,
  Flame,
  Check,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import Header from '../components/Header';
import { adminAPI } from '../services/api';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notice, setNotice] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    brand: 'EasyMart Select',
    stock: 20,
    coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: '',
    isFeatured: false,
    isFlashDeal: false,
  });

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        adminAPI.getProducts(),
        adminAPI.getCategories(),
      ]);
      setProducts(prodRes.data.products || []);
      const cats = (catRes.data || []).map((c) => c.name);
      setCategoriesList(['All', ...cats]);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    const defaultCat = categoriesList.find((c) => c !== 'All') || 'Electronics';
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: defaultCat,
      brand: 'EasyMart Select',
      stock: 20,
      coverImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      description: '',
      isFeatured: false,
      isFlashDeal: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      category: p.category,
      brand: p.brand || 'EasyMart Select',
      stock: p.stock !== undefined ? p.stock : 10,
      coverImage: p.coverImage || p.images?.[0],
      description: p.description,
      isFeatured: p.isFeatured || false,
      isFlashDeal: p.isFlashDeal || false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateProduct(editingId, formData);
        setNotice('✅ Product updated successfully in MongoDB!');
      } else {
        await adminAPI.createProduct(formData);
        setNotice('✅ New product published to store catalog!');
      }
      setIsModalOpen(false);
      await fetchProductsAndCategories();
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      setNotice('❌ Error saving product: ' + (err.response?.data?.message || err.message));
      setTimeout(() => setNotice(''), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      setProducts(products.filter((p) => String(p._id) !== String(id)));
      setNotice('Product deleted from database.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice('Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 min-h-screen bg-slate-900 text-slate-100">
      <Header
        title="Product Inventory Management"
        subtitle={`Managing ${products.length} live catalog items stored in MongoDB`}
        onRefresh={fetchProductsAndCategories}
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            {notice}
          </div>
        )}

        {/* Filter and Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative min-w-[260px] flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products by title or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 py-2.5 rounded-xl bg-slate-950 border-slate-800 text-white placeholder-slate-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>

            {/* Category Dropdown (Dynamic) */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-bold rounded-xl bg-slate-950 border-slate-800 text-slate-200 py-2.5 px-4 cursor-pointer"
            >
              {categoriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-black tracking-wider">
                <tr>
                  <th className="p-4 pl-6">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Deals / Tags</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500">
                      Loading products...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-slate-500">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-950 p-1.5 border border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={p.coverImage || p.images?.[0]}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.brand}</p>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-slate-300">{p.category}</td>

                      <td className="p-4">
                        <span className="font-black font-outfit text-white">
                          ${p.price.toFixed(2)}
                        </span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-[10px] text-slate-500 line-through block">
                            ${p.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`badge text-[10px] ${
                            p.stock > 10
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : p.stock > 0
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1.5">
                          {p.isFeatured && (
                            <span className="badge bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px]">
                              Featured
                            </span>
                          )}
                          {p.isFlashDeal && (
                            <span className="badge bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px]">
                              🔥 Flash Deal
                            </span>
                          )}
                          {p.tags?.includes('festival-offer') && (
                            <span className="badge bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px]">
                              🪔 Festive Offer
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <h3 className="text-lg font-black font-outfit text-white">
                  {editingId ? 'Edit Product Details' : 'Add New Product to Store'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-900 border-slate-800 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Sale Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Original / MRP Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Category (Dynamic)
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full text-xs rounded-xl bg-slate-900 border-slate-800 text-white"
                    >
                      {categoriesList.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Available Stock Units
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl bg-slate-900 border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-900 border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs rounded-xl bg-slate-900 border-slate-800 text-white"
                  />
                </div>

                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="accent-orange-500 rounded"
                    />
                    Mark as Featured Product
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFlashDeal}
                      onChange={(e) => setFormData({ ...formData, isFlashDeal: e.target.checked })}
                      className="accent-orange-500 rounded"
                    />
                    Mark as Flash Deal 🔥
                  </label>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold border border-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/20 cursor-pointer"
                  >
                    Save Changes
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

export default ProductManager;
