import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    itemsCount,
    itemsPrice,
    discountPrice,
    shippingPrice,
    totalPrice,
    applyCoupon,
    removeCoupon,
    coupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-fade">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-bold font-outfit text-slate-900">
                Your Cart ({itemsCount})
              </h2>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="btn btn-primary text-xs px-6 py-2.5 rounded-xl font-bold"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4 pt-3 pb-2 items-center">
                    <img
                      src={item.coverImage}
                      alt={item.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-orange-600 font-extrabold mt-0.5">
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => updateQuantity(item._id, item.qty - 1)}
                            className="p-1 px-2 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-slate-800">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.qty + 1)}
                            className="p-1 px-2 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/70 space-y-4">
              {/* Coupon form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Coupon (e.g. EASYMART20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full text-xs pl-8 py-2 bg-white rounded-xl border border-slate-200 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </form>

              {couponMsg.text && (
                <p className={`text-xs font-semibold ${couponMsg.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {couponMsg.text}
                </p>
              )}

              {coupon.applied && (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold">
                  <span>Coupon {coupon.code} ({coupon.discountPercent}% OFF)</span>
                  <button onClick={removeCoupon} className="text-rose-600 underline">
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">${itemsPrice.toFixed(2)}</span>
                </div>
                {discountPrice > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-${discountPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total</span>
                  <span className="text-orange-600 font-outfit text-base">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full btn btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Guaranteed Safe & Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
