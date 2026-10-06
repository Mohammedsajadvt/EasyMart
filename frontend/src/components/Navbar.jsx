import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  Flame,
  Sparkles,
  LogOut,
  Package,
  SlidersHorizontal,
  PhoneCall,
  Truck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { categoryAPI } from '../services/api';
import FestivalBanner from './FestivalBanner';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemsCount, totalPrice, setIsDrawerOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryAPI.getAll();
        const catNames = (res.data || []).map((c) => c.name);
        setCategories(['All', ...catNames]);
      } catch (e) {
        setCategories([
          'All',
          'Electronics',
          'Mobiles & Tablets',
          'Wearables',
          'Fashion & Bags',
          'Home & Kitchen',
          'Sports & Shoes',
          'Beauty & Care',
        ]);
      }
    };
    fetchCats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(
        `/shop?keyword=${encodeURIComponent(searchQuery.trim())}${
          selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : ''
        }`
      );
    } else if (selectedCategory !== 'All') {
      navigate(`/shop?category=${encodeURIComponent(selectedCategory)}`);
    } else {
      navigate('/shop');
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const isShopRoot = location.pathname === '/shop' && !currentCategory && !searchParams.get('flashDeals') && !searchParams.get('featured') && !searchParams.get('keyword');
  const isCategoriesPage = location.pathname === '/categories';
  const isAllCategoriesActive = isCategoriesPage || (location.pathname === '/shop' && currentCategory === 'All');
  const isFlashActive = searchParams.get('flashDeals') === 'true';
  const isFeaturedActive = searchParams.get('featured') === 'true';

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-slate-100">
      {/* 0. Live Indian Festival Announcement Bar */}
      <FestivalBanner />

      {/* 1. Top Utility Header Bar */}
      <div className="bg-[#0F172A] text-slate-300 text-xs font-medium py-2 px-4 border-b border-slate-800">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-orange-500" />
              <span>Helpline: <strong className="text-white font-bold">+1 (800) 555-EASY</strong></span>
            </div>
            <span className="hidden md:inline text-slate-700">|</span>
            <span className="hidden md:inline text-slate-300">
              ⚡ 20% OFF coupon code: <strong className="text-orange-400 font-bold tracking-wide">EASYMART20</strong>
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-300">
            <div className="hidden sm:flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free Express Delivery over $150</span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <Link to="/orders" className="hover:text-orange-400 transition-colors font-semibold">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Center Header */}
      <div className="container py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FF5A1F 0%, #FF8A00 100%)' }}
            >
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-outfit text-slate-900 leading-none">
                Easy<span className="text-orange-500">Mart</span>
              </span>
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                Online Superstore
              </span>
            </div>
          </Link>

          {/* Integrated Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-2xl mx-4">
            <div className="flex items-center w-full bg-slate-50 rounded-2xl border-2 border-slate-200 focus-within:border-orange-500 focus-within:bg-white transition-all overflow-hidden shadow-xs">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 pl-4 pr-3 py-3 border-r border-slate-200 cursor-pointer focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search products, brands, electronics, fashion, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none py-3 px-4 text-xs sm:text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
              />

              <button
                type="submit"
                className="h-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-slate-700 hover:text-orange-600 rounded-2xl hover:bg-orange-50 transition-colors flex items-center"
              title="My Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger with Price Badge */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 text-slate-900 transition-all cursor-pointer border border-orange-200 shadow-xs"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5.5 h-5.5 text-orange-600" />
                {itemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {itemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-500 leading-tight uppercase tracking-wider">My Cart</span>
                <span className="text-xs font-black font-outfit text-orange-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </button>

            {/* Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 h-11 px-3.5 rounded-2xl border border-slate-200 hover:border-orange-500 bg-white hover:bg-orange-50/40 shadow-xs transition-all cursor-pointer"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || 'User'
                      )}&background=FF5A1F&color=fff&bold=true&font-size=0.4&rounded=true`
                    }
                    alt={user.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border-2 border-orange-500 shadow-xs"
                  />
                  <span className="text-xs font-black text-slate-800 hidden sm:inline max-w-[100px] truncate capitalize">
                    {user.name ? user.name.split(' ')[0] : 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-fade"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <User className="w-4 h-4" /> Profile & Address
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                      <Package className="w-4 h-4" /> Order History & Tracking
                    </Link>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="h-11 px-5 sm:px-6 text-xs sm:text-sm font-black rounded-2xl border-2 border-slate-200 text-slate-800 hover:border-orange-500 hover:text-orange-600 transition-all inline-flex items-center justify-center shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="h-11 px-5 sm:px-6 text-xs sm:text-sm font-black rounded-2xl bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all hidden sm:inline-flex items-center justify-center active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-orange-600 lg:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Categories Navigation Bar (Dynamic Background Highlight Container) */}
      <nav className="border-t border-slate-100 bg-[#F8FAFC] hidden md:block mb-4 sm:mb-6 shadow-xs">
        <div className="container flex items-center justify-between py-2.5 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* All Categories Button */}
            <Link
              to="/categories"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 shadow-xs flex-shrink-0 cursor-pointer ${
                isAllCategoriesActive
                  ? 'bg-orange-500 text-white font-black shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-orange-50 hover:text-orange-600 border border-slate-200/90 font-bold'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </Link>

            {/* Dynamic Categories with Active Background Container */}
            {categories.filter((c) => c !== 'All').map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 flex-shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-orange-500 text-white font-black shadow-md shadow-orange-500/25 scale-[1.02]'
                      : 'text-slate-700 hover:bg-white hover:text-orange-600 font-bold hover:shadow-xs'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 pl-4">
            <Link
              to="/shop?flashDeals=true"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 flex-shrink-0 ${
                isFlashActive
                  ? 'bg-orange-500 text-white font-black shadow-md shadow-orange-500/25'
                  : 'text-orange-600 font-black hover:bg-orange-50'
              }`}
            >
              <Flame className={`w-4 h-4 ${isFlashActive ? 'fill-white text-white' : 'text-orange-500 fill-orange-500'} animate-pulse`} />
              Flash Deals
            </Link>
            <Link
              to="/shop?featured=true"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all duration-200 flex-shrink-0 ${
                isFeaturedActive
                  ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-500/25'
                  : 'text-indigo-600 font-bold hover:bg-indigo-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Featured Drops
            </Link>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-5 space-y-4 animate-fade">
          <form onSubmit={handleSearch} className="flex items-center w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none py-2.5 px-4 text-xs focus:outline-none"
            />
            <button type="submit" className="p-2.5 px-5 bg-orange-500 text-white">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="grid grid-cols-2 gap-2.5 text-xs font-bold pt-1">
            <Link
              to="/shop"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`p-3.5 rounded-2xl flex items-center justify-between col-span-2 transition-all ${
                isAllCategoriesActive
                  ? 'bg-orange-500 text-white font-black shadow-md'
                  : 'bg-orange-50 text-orange-700'
              }`}
            >
              <span>All Categories</span>
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </Link>
            {categories.filter((c) => c !== 'All').map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white font-black shadow-sm'
                      : 'bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
