import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    itemsCount,
    itemsPrice,
    discountPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    applyCoupon,
    removeCoupon,
    coupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-24">
        <div className="max-w-md mx-auto bg-white p-10 sm:p-12 rounded-3xl border border-slate-200/90 shadow-sm text-center flex flex-col items-center gap-5">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            You don't have any items in your cart yet. Explore thousands of deals in our superstore!
          </p>
          <Link to="/shop" className="btn btn-primary px-8 py-3.5 rounded-xl font-bold inline-flex mt-2">
            Start Shopping Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="container">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-outfit text-slate-900">
              Shopping Cart ({itemsCount} {itemsCount === 1 ? 'item' : 'items'})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review your items and proceed to fast express checkout
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Cart Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item._id} className="p-5 sm:p-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
                <Link to={`/product/${item._id}`} className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-50 p-3 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                  <img src={item.coverImage} alt={item.name} className="w-full h-full object-contain" />
                </Link>

                <div className="flex-1 min-w-0 text-center sm:text-left flex flex-col gap-1">
                  <span className="text-[11px] font-extrabold text-orange-600 uppercase tracking-wider">{item.category}</span>
                  <Link to={`/product/${item._id}`} className="block text-sm sm:text-base font-bold text-slate-900 hover:text-orange-600 transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-base font-black text-slate-900 mt-0.5">
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item._id, item.qty - 1)}
                      className="p-2.5 px-3.5 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.qty + 1)}
                      className="p-2.5 px-3.5 hover:bg-slate-200 text-slate-600 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-black font-outfit text-slate-900 min-w-[80px] text-right hidden sm:block">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="p-5 sm:p-7 bg-slate-50 flex items-center justify-between">
              <Link to="/shop" className="text-xs sm:text-sm font-bold text-slate-700 hover:text-orange-600 flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Box (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col gap-6">
            <h3 className="text-xl font-black font-outfit text-slate-900 pb-4 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex flex-col gap-2.5">
              <label className="text-xs font-bold text-slate-700 block">Promo Code</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. EASYMART20"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full text-xs pl-9 py-2.5 rounded-xl uppercase border border-slate-200 focus:border-orange-500"
                  />
                </div>
                <button type="submit" className="btn btn-secondary text-xs px-5 py-2.5 rounded-xl font-bold">
                  Apply
                </button>
              </div>

              {couponMsg.text && (
                <p className={`text-xs font-bold ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {couponMsg.text}
                </p>
              )}

              {coupon.applied && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-3.5 py-2 rounded-xl text-xs font-bold">
                  <span>Coupon {coupon.code} ({coupon.discountPercent}% OFF)</span>
                  <button onClick={removeCoupon} className="text-rose-600 underline cursor-pointer">Remove</button>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-5">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">${itemsPrice.toFixed(2)}</span>
              </div>
              {discountPrice > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount Applied</span>
                  <span>-${discountPrice.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? <strong className="text-emerald-600 font-bold">FREE ($0.00)</strong> : `$${shippingPrice.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-4">
                <span>Total Amount</span>
                <span className="text-orange-600 font-outfit text-2xl font-black">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn btn-primary py-4 rounded-xl font-black flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/25 text-sm sm:text-base mt-2"
            >
              Proceed to Checkout <ArrowRight className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              <span>Safe 256-Bit SSL Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
