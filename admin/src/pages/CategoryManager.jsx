import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  X,
  Sparkles,
  ShoppingBag,
  Headphones,
  Smartphone,
  Watch,
  Coffee,
  Activity,
  Tag,
} from 'lucide-react';
import { adminAPI } from '../services/api';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    iconName: 'ShoppingBag',
    color: 'orange',
  });

  const iconOptions = [
    'ShoppingBag',
    'Headphones',
    'Smartphone',
    'Watch',
    'Coffee',
    'Activity',
    'Sparkles',
    'Tag',
  ];

  const colorOptions = [
    'orange',
    'blue',
    'emerald',
    'amber',
    'rose',
    'cyan',
    'purple',
    'indigo',
  ];

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      iconName: 'ShoppingBag',
      color: 'orange',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      iconName: cat.iconName || 'ShoppingBag',
      color: cat.color || 'orange',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await adminAPI.deleteCategory(id);
      setStatusMsg({ text: `Category "${name}" deleted successfully!`, isError: false });
      fetchCategories();
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || 'Failed to delete category', isError: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      if (editingCategory) {
        await adminAPI.updateCategory(editingCategory._id, formData);
        setStatusMsg({ text: `Category "${formData.name}" updated successfully!`, isError: false });
      } else {
        await adminAPI.createCategory(formData);
        setStatusMsg({ text: `Category "${formData.name}" created successfully!`, isError: false });
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || 'Failed to save category', isError: true });
    } finally {
      setSaving(false);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black font-outfit text-white">
            Category Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, and organize dynamic product categories live on store and catalog
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {statusMsg.text && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            statusMsg.isError
              ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
              : 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
          }`}
        >
          <span>{statusMsg.text}</span>
          <button onClick={() => setStatusMsg({ text: '', isError: false })}>
            <X className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-[#111827] p-3 rounded-2xl border border-slate-800">
        <Search className="w-4 h-4 text-slate-500 ml-2" />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none text-xs text-white placeholder-slate-500 w-full focus:outline-none"
        />
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-900/60 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-[#111827] rounded-3xl border border-slate-800 text-slate-400 text-xs">
          No categories found. Click "Add Category" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="bg-[#111827] border border-slate-800 hover:border-orange-500/50 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all shadow-sm hover:shadow-xl group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800/80 border border-slate-700 p-2 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      {cat.color || 'orange'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      /{cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-white mt-1 group-hover:text-orange-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {cat.description || 'No description added.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-slate-500">
                  Icon: <strong className="text-slate-300">{cat.iconName || 'ShoppingBag'}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-lg font-black font-outfit text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gaming & VR, Smart Home, Luxury Watches..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Brief summary of items in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Image URL (Tile / Thumbnail)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Icon Style
                  </label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    {iconOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Theme Color
                  </label>
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full bg-[#1F2937] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  >
                    {colorOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
