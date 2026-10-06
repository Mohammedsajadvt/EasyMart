import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Search,
  Layers,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Flame,
  ChevronRight,
} from 'lucide-react';
import { categoryAPI } from '../services/api';

const categoryHighlights = {
  'Electronics': ['Headphones & Audio', 'Smart Speakers', 'Laptops & PCs', 'Cameras & Video', 'Gaming Accessories'],
  'Mobiles & Tablets': ['Flagship Smartphones', '5G Devices', 'iPads & Tablets', 'Fast Chargers', 'Cases & Covers'],
  'Wearables': ['Smart Fitness Watches', 'Luxury Timepieces', 'Wireless Bands', 'Health Trackers', 'Sport Straps'],
  'Fashion & Bags': ['Italian Leather Bags', 'Designer Backpacks', 'Polarized Sunglasses', 'Apparel & Shoes', 'Travel Luggage'],
  'Home & Kitchen': ['Robot Vacuums', 'Air Fryers & Blenders', 'Smart Coffee Machines', 'Home Decor', 'Kitchenware'],
  'Sports & Shoes': ['Running Sneakers', 'Gym Equipment', 'Outdoor Gear', 'Athletic Wear', 'Yoga Mats'],
  'Beauty & Care': ['Hair Stylers & Dryers', 'Skincare Serums', 'Fragrances & Perfumes', 'Grooming Kits', 'Personal Wellness'],
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryAPI.getAll();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-16 sm:pb-24">
      {/* 1. Header Banner */}
      <div
        className="text-white py-12 sm:py-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
        }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-black uppercase tracking-wider text-orange-400 mb-4">
              <Layers className="w-3.5 h-3.5" /> All Store Departments
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-outfit text-white tracking-tight leading-tight">
              Explore All Categories
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-2xl">
              Discover curated collections across electronics, smartphones, luxury fashion, lifestyle wearables, home appliances, and more.
            </p>

            {/* Quick Search Bar */}
            <div className="mt-8 relative max-w-lg">
              <Search className="w-5 h-5 text-slate-400 absolute left-4.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Find a category (e.g. Electronics, Fashion, Mobiles)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '48px', paddingRight: '16px' }}
                className="w-full h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-orange-400 focus:bg-white/15 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Categories Grid Section */}
      <div className="container mt-10 sm:mt-12">
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-slate-200">
          <div>
            <span className="text-xs font-black text-orange-600 uppercase tracking-widest block mb-1">
              Browse Collections
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-outfit text-slate-900">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Departments & Categories'}
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
            {filteredCategories.length} Categories Available
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-white rounded-3xl border border-slate-100 p-6 animate-pulse" />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 mx-auto flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No categories found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with another keyword or browse all catalog departments.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="mt-5 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCategories.map((cat) => {
              const highlights = categoryHighlights[cat.name] || [
                'Top Rated Deals',
                'New Arrivals',
                'Best Sellers',
                'Express Shipping',
              ];

              return (
                <div
                  key={cat._id || cat.name}
                  className="group bg-white rounded-3xl border border-slate-200/80 hover:border-orange-500/80 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
                  style={{ padding: '1.75rem 1.75rem 1.5rem 1.75rem' }}
                >
                  <div>
                    {/* Visual Image Container */}
                    <div className="w-full h-48 rounded-2xl bg-gradient-to-tr from-slate-50 to-orange-50/40 p-4 flex items-center justify-center relative overflow-hidden border border-slate-100 mb-6">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                        alt={cat.name}
                        className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                        loading="lazy"
                      />
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-slate-700 shadow-sm border border-slate-100">
                        {cat.productCount ? `${cat.productCount}+ Items` : 'Active'}
                      </span>
                    </div>

                    {/* Category Title */}
                    <div className="text-left mb-4">
                      <h3 className="text-xl font-black font-outfit text-slate-900 group-hover:text-orange-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {cat.description || `Browse the full collection of verified ${cat.name.toLowerCase()} products.`}
                      </p>
                    </div>

                    {/* Sub-tags Highlights */}
                    <div className="flex flex-wrap gap-1.5 mb-6 text-left">
                      {highlights.map((item, idx) => (
                        <Link
                          key={idx}
                          to={`/shop?category=${encodeURIComponent(cat.name)}&keyword=${encodeURIComponent(item)}`}
                          className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-orange-50 hover:text-orange-600 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Browse Button */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      to={`/shop?category=${encodeURIComponent(cat.name)}`}
                      className="w-full py-3 px-5 rounded-2xl bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-orange-500/25 cursor-pointer"
                    >
                      <span>Explore {cat.name}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3. Trust & Perks Footer */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-orange-50 border border-orange-100/80 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">100% Genuine Brands</h4>
              <p className="text-xs text-slate-500">Every product backed by manufacturer warranty.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Free Express Delivery</h4>
              <p className="text-xs text-slate-500">Fast doorstep shipping on orders above $150.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Daily Flash Discounts</h4>
              <p className="text-xs text-slate-500">Up to 40% off on top-selling tech & style.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
