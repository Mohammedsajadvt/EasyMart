import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, Truck } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const orderNumber = id || 'EM-' + Math.floor(10000000 + Math.random() * 90000000);

  return (
    <div className="py-16">
      <div className="container max-w-xl text-center">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-xl space-y-6 animate-fade">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="badge bg-emerald-100 text-emerald-700 text-xs font-black">
              Payment & Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              Thank You For Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Your order has been received and is now being processed at our nearest fulfillment warehouse.
            </p>
          </div>

          {/* Tracking Number Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Tracking & Reference ID
            </span>
            <div className="flex items-center justify-between">
              <span className="text-base font-black font-mono text-slate-900">
                {orderNumber}
              </span>
              <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Processing
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="btn btn-primary px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" /> View My Orders
            </Link>
            <Link
              to="/shop"
              className="btn btn-outline px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
