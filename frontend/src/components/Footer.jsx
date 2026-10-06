import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
  Heart,
} from 'lucide-react';

const Footer = () => {
  return (
    <div style={{ marginTop: '5rem' }}>
      {/* 1. Value Proposition Guarantees Bar (Pure White with Bold Black Text & Generous Padding) */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          <div className="flex items-center gap-5 p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-orange-500 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0 border border-orange-200 shadow-sm">
              <Truck className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h4 className="!text-slate-900 text-base font-black font-outfit tracking-tight">Free Fast Delivery</h4>
              <p className="!text-slate-600 text-xs mt-1.5 font-semibold">On all orders exceeding $150</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-emerald-500 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-200 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h4 className="!text-slate-900 text-base font-black font-outfit tracking-tight">100% Safe Payments</h4>
              <p className="!text-slate-600 text-xs mt-1.5 font-semibold">Encrypted 256-bit SSL security</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-cyan-500 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 border border-cyan-200 shadow-sm">
              <RotateCcw className="w-7 h-7 text-cyan-600" />
            </div>
            <div>
              <h4 className="!text-slate-900 text-base font-black font-outfit tracking-tight">30 Days Returns</h4>
              <p className="!text-slate-600 text-xs mt-1.5 font-semibold">Hassle-free instant money back</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 sm:p-7 rounded-3xl bg-white border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-indigo-500 transition-all hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 border border-indigo-200 shadow-sm">
              <Headphones className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h4 className="!text-slate-900 text-base font-black font-outfit tracking-tight">24/7 Priority Support</h4>
              <p className="!text-slate-600 text-xs mt-1.5 font-semibold">Dedicated expert assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Dark Footer */}
      <footer style={{ paddingTop: '4.5rem', paddingBottom: '3.5rem' }} className="bg-[#0B0F19] !text-white border-t-2 border-slate-800">
        <div className="container py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <Link to="/" className="flex items-center gap-3 group">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-lg group-hover:scale-105 transition-transform"
                  style={{ background: 'linear-gradient(135deg, #FF5A1F 0%, #FF8A00 100%)' }}
                >
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <span style={{ color: '#FFFFFF' }} className="text-3xl font-black font-outfit tracking-tight">
                  Easy<span className="text-orange-500">Mart</span>
                </span>
              </Link>

              <p style={{ color: '#CBD5E1' }} className="text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
                Your premier one-stop destination for cutting-edge electronics, trendy fashion, smart living devices, and everyday essentials with unmatched convenience.
              </p>

              <div className="pt-3 pb-2">
                <p style={{ color: '#FFFFFF' }} className="text-xs sm:text-sm font-black mb-3">
                  Subscribe to unlock VIP discounts & drops
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert('🎉 Subscribed successfully to EasyMart VIP newsletter!');
                  }}
                  className="flex items-center max-w-md bg-[#1E293B] border-2 border-slate-700 focus-within:border-orange-500 rounded-2xl p-1.5 sm:p-2 transition-all shadow-xl gap-2 overflow-hidden"
                >
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    style={{ color: '#FFFFFF', paddingLeft: '16px', paddingRight: '12px' }}
                    className="w-full bg-transparent border-none text-xs sm:text-sm placeholder-slate-400 focus:outline-none font-medium min-w-0"
                  />
                  <button
                    type="submit"
                    style={{ paddingLeft: '22px', paddingRight: '20px' }}
                    className="h-11 bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm font-black rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-orange-500/30 flex-shrink-0 hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 style={{ color: '#FFFFFF' }} className="text-white font-black text-sm sm:text-base mb-5 font-outfit tracking-wide">
                Top Categories
              </h5>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm font-medium">
                <li>
                  <Link to="/shop?category=Electronics" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    Electronics & Audio
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Mobiles%20%26%20Tablets" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    Smartphones & Tablets
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Wearables" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    Smartwatches & Rings
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Fashion%20%26%20Bags" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    Luxury Bags & Shoes
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=Home%20%26%20Kitchen" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    Kitchen Appliances
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h5 style={{ color: '#FFFFFF' }} className="text-white font-black text-sm sm:text-base mb-5 font-outfit tracking-wide">
                Customer Care
              </h5>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm font-medium">
                <li>
                  <Link to="/orders" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    Order Tracking
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    Wishlist & Favorites
                  </Link>
                </li>
                <li>
                  <Link to="/profile" style={{ color: '#CBD5E1' }} className="hover:!text-orange-400 transition-colors">
                    My Account
                  </Link>
                </li>
                <li>
                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Live support is active: support@easymart.com');
                    }}
                    style={{ color: '#CBD5E1' }}
                    className="hover:!text-orange-400 transition-colors"
                  >
                    Help Center & FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#returns"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Returns policy: 30 days hassle-free return guaranteed.');
                    }}
                    style={{ color: '#CBD5E1' }}
                    className="hover:!text-orange-400 transition-colors"
                  >
                    Shipping & Returns
                  </a>
                </li>
              </ul>
            </div>

            {/* Direct Contact */}
            <div>
              <h5 style={{ color: '#FFFFFF' }} className="text-white font-black text-sm sm:text-base mb-5 font-outfit tracking-wide">
                EasyMart Store
              </h5>
              <ul className="flex flex-col gap-3.5 text-xs sm:text-sm font-medium">
                <li className="flex items-start gap-2.5">
                  <Mail className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <span style={{ color: '#FFFFFF' }} className="font-bold">support@easymart.com</span>
                </li>
                <li>
                  <span style={{ color: '#94A3B8' }} className="block text-xs font-semibold">Customer Helpline:</span>
                  <span style={{ color: '#FFFFFF' }} className="font-black text-sm sm:text-base">+1 (800) 555-EASY</span>
                </li>
                <li>
                  <span style={{ color: '#94A3B8' }} className="block text-xs font-semibold">Headquarters:</span>
                  <span style={{ color: '#E2E8F0' }} className="font-medium">San Francisco, California, USA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright and Badges */}
        <div style={{ marginTop: '4.5rem', paddingTop: '2.5rem' }} className="container border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs gap-5 font-medium">
          <p style={{ color: '#94A3B8' }}>© {new Date().getFullYear()} EasyMart E-Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span style={{ color: '#E2E8F0' }} className="bg-[#1E293B] border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold">
              VISA
            </span>
            <span style={{ color: '#E2E8F0' }} className="bg-[#1E293B] border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold">
              MasterCard
            </span>
            <span style={{ color: '#E2E8F0' }} className="bg-[#1E293B] border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold">
              Apple Pay
            </span>
            <span style={{ color: '#E2E8F0' }} className="bg-[#1E293B] border border-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold">
              PayPal
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
