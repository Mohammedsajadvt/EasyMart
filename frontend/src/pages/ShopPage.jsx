import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  RotateCcw,
  Star,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { productAPI } from '../services/api';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get('keyword') || ''
  );
  const [priceRange, setPriceRange] = useState(3000);
  const [sortBy, setSortBy] = useState('newest');
  const [minRating, setMinRating] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productAPI.getCategories();
        const catNames = (res.data || []).map((c) => (typeof c === 'string' ? c : c.name));
        setCategories(['All', ...catNames]);
      } catch (e) {
        setCategories(['All', 'Electronics', 'Mobiles & Tablets', 'Wearables', 'Fashion & Bags', 'Home & Kitchen', 'Sports & Shoes', 'Beauty & Care']);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const keywordParam = searchParams.get('keyword');
    if (categoryParam) setSelectedCategory(categoryParam);
    if (keywordParam) setSearchKeyword(keywordParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const params = {
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          keyword: searchKeyword || undefined,
          maxPrice: priceRange,
          sort: sortBy,
        };
        const res = await productAPI.getAll(params);
        let list = res.data.products || [];
        if (minRating > 0) {
          list = list.filter((p) => (p.rating || 0) >= minRating);
        }
        setProducts(list);
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, searchKeyword, priceRange, sortBy, minRating]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchKeyword('');
    setPriceRange(3000);
    setSortBy('newest');
    setMinRating(0);
    setSearchParams({});
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    const newParams = {};
    if (cat !== 'All') newParams.category = cat;
    if (searchKeyword) newParams.keyword = searchKeyword;
    setSearchParams(newParams);
  };

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4.5rem' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav style={{ marginBottom: '2rem' }} className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <Link to="/" className="hover:text-slate-800">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold">Store Catalog</span>
          {selectedCategory !== 'All' && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-orange-600 font-bold">{selectedCategory}</span>
            </>
          )}
        </nav>

        {/* Page Top Header Bar */}
        <div
          style={{ marginBottom: '2.5rem', padding: '1.75rem 2rem' }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white rounded-3xl border border-slate-200/80 shadow-sm"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900 leading-tight">
              {selectedCategory === 'All' ? 'All Products Catalog' : selectedCategory}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Showing <strong className="text-slate-900">{products.length}</strong> verified products available in warehouse
            </p>
          </div>

          {/* Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="lg:hidden h-11 px-5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2 bg-slate-50 hover:bg-slate-100 cursor-pointer shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Filters
            </button>

            <div className="flex items-center gap-2.5 bg-slate-50 h-11 px-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-xs font-black text-slate-900 p-0 focus:outline-none cursor-pointer"
              >
                <option value="newest">Featured & Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Products */}
        <div style={{ gap: '2rem' }} className="grid grid-cols-1 lg:grid-cols-4 items-start">
          {/* Filter Sidebar */}
          <aside
            className={`bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col gap-6 ${
              isMobileFilterOpen
                ? 'block fixed inset-0 z-50 overflow-y-auto p-6 bg-white'
                : 'hidden lg:flex'
            }`}
          >
            {isMobileFilterOpen && (
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 lg:hidden">
                <h3 className="text-base font-black font-outfit">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Sidebar Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" /> Catalog Filters
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            {/* 1. Keyword Search */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Search in Catalog
              </label>
              <div className="relative flex items-center h-12">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                <input
                  type="text"
                  placeholder="e.g. Sony, iPhone, Nike..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  style={{ paddingLeft: '44px', paddingRight: '16px' }}
                  className="w-full h-full text-xs sm:text-sm rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-all font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 2. Categories List */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Product Categories
              </label>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    style={{ padding: '10px 16px' }}
                    className={`w-full text-left rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-orange-500 text-white font-black shadow-md shadow-orange-500/25 scale-[1.01]'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{cat}</span>
                    {selectedCategory === cat && (
                      <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Price Range Slider */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-xs font-bold text-slate-700">Max Price</label>
                <span className="text-sm font-black text-orange-600 font-outfit">
                  ${priceRange}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="3000"
                step="50"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2 font-mono px-0.5">
                <span>$20</span>
                <span>$1500</span>
                <span>$3000</span>
              </div>
            </div>

            {/* 4. Customer Rating Filter */}
            <div className="pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Minimum Rating
              </label>
              <div className="flex flex-col gap-1.5">
                {[4, 3, 2, 0].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    style={{ padding: '9px 14px' }}
                    className={`w-full text-left rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer ${
                      minRating === rating
                        ? 'bg-orange-50 text-orange-600 font-bold border border-orange-200/60'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rating ? 'fill-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold">
                      {rating > 0 ? `${rating} Stars & Up` : 'All Ratings'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full h-12 btn btn-primary py-3 rounded-2xl font-bold lg:hidden mt-4"
              >
                Apply Filters
              </button>
            )}
          </aside>

          {/* Product Cards Grid Area (3 cols on Desktop) */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200/80 text-center flex flex-col items-center gap-5 shadow-sm">
                <div className="w-18 h-18 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-outfit text-slate-900">No matching products found</h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                    Try adjusting your search terms or broadening your price filter to see more items.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="h-12 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95 mt-2"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

export default ShopPage;
