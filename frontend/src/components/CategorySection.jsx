import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { categoryAPI } from '../services/api';

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
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
    fetchCats();
  }, []);

  return (
    <section style={{ paddingTop: '0.75rem', paddingBottom: '1.25rem' }}>
      <div className="container">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" /> Popular Collections
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-outfit text-slate-900">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 group bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-200 transition-colors"
          >
            All Categories
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-44 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id || cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group p-4 sm:p-5 bg-white rounded-3xl border border-slate-200/80 hover:border-orange-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-3 hover:-translate-y-1.5"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 relative p-3 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform border border-slate-100 shadow-inner">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="w-full">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400 block mt-0.5">
                    {cat.productCount ? `${cat.productCount}+ Products` : 'Explore Items'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
