import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  ArrowRight,
  Quote,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from 'lucide-react';
import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import FlashDealsSection from '../components/FlashDealsSection';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { productAPI } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featRes, dealsRes, catRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getFlashDeals(),
          productAPI.getCategories(),
        ]);
        setFeaturedProducts(featRes.data || []);
        setFlashDeals(dealsRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterTabs = ['All', ...categories.slice(0, 5)];

  const filteredFeatured =
    selectedCategoryTab === 'All'
      ? featuredProducts
      : featuredProducts.filter((p) => p.category === selectedCategoryTab);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 pb-8 sm:pb-12">
      {/* 1. Hero Banner Slider */}
      <HeroBanner />

      {/* 2. Category Grid */}
      <CategorySection />

      {/* 3. Flash Deals Countdown Section */}
      <FlashDealsSection
        products={flashDeals}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* 4. Trending & Best Sellers Section */}
      <section style={{ paddingTop: '0.75rem', paddingBottom: '1.25rem' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-widest mb-1">
                <TrendingUp className="w-4 h-4" /> Handpicked Collection
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-outfit text-slate-900">
                Trending & Best Sellers
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedCategoryTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategoryTab === tab
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-orange-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-88 bg-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filteredFeatured.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No products found for this filter tab.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredFeatured.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/shop"
              className="px-8 py-3.5 rounded-2xl font-black inline-flex items-center gap-2.5 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all text-xs sm:text-sm shadow-sm hover:shadow-lg"
            >
              Explore Full 10,000+ Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Promotional Banners */}
      <section style={{ paddingTop: '0.75rem', paddingBottom: '1.5rem' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 to-amber-500 !text-white flex flex-col justify-between shadow-xl"
              style={{ padding: '2rem 2.25rem', minHeight: '260px' }}
            >
              <div className="space-y-2.5 max-w-xs relative z-10 text-left">
                <span className="bg-white/20 backdrop-blur-md !text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  Weekend Special
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-outfit !text-white leading-tight">
                  Flagship ANC Headphones
                </h3>
                <p className="text-xs sm:text-sm !text-orange-100">
                  Spatial sound and up to 30h playback with soft comfort fit.
                </p>
              </div>
              <div className="pt-6 relative z-10 text-left">
                <Link
                  to="/shop?category=Electronics"
                  className="bg-white !text-orange-600 hover:bg-orange-50 font-black rounded-2xl shadow-xl inline-flex items-center gap-2.5 hover:scale-105 transition-all cursor-pointer"
                  style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem' }}
                >
                  Shop Deal Now <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                alt=""
                className="absolute right-0 bottom-0 w-40 h-40 sm:w-44 sm:h-44 object-contain translate-x-1 translate-y-1 opacity-90 drop-shadow-2xl pointer-events-none"
              />
            </div>

            <div
              className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 to-slate-900 !text-white flex flex-col justify-between shadow-xl"
              style={{ padding: '2rem 2.25rem', minHeight: '270px' }}
            >
              <div className="space-y-2.5 max-w-xs relative z-10 text-left">
                <span className="bg-indigo-500/30 backdrop-blur-md !text-indigo-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  Exclusive Drop
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-outfit !text-white leading-tight">
                  Smart Lifestyle Watches
                </h3>
                <p className="text-xs sm:text-sm !text-indigo-200">
                  Track fitness, oxygen, sleep and stay connected on the move.
                </p>
              </div>
              <div className="pt-6 relative z-10 text-left">
                <Link
                  to="/shop?category=Wearables"
                  className="bg-indigo-500 hover:bg-indigo-600 !text-white font-black rounded-2xl shadow-xl inline-flex items-center gap-2.5 hover:scale-105 transition-all cursor-pointer"
                  style={{ padding: '0.85rem 1.85rem', fontSize: '0.95rem' }}
                >
                  Explore Collection <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </div>
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
                alt=""
                className="absolute right-0 bottom-0 w-40 h-40 sm:w-44 sm:h-44 object-contain translate-x-1 translate-y-1 opacity-90 drop-shadow-2xl pointer-events-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
