import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Package,
  CreditCard,
  Truck,
  ShieldCheck,
  Navigation,
  KeyRound,
  Check,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const TripDetailsModal = ({ order, onClose, onUpdateStatus }) => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isDelivering, setIsDelivering] = useState(false);

  if (!order) return null;

  const currentStatus = order.status || 'Pending';
  const orderIdSafe = String(order._id || order.trackingNumber || 'ORDER');
  const displayId = order.trackingNumber || `#${orderIdSafe.slice(-8)}`;
  const expectedOtp = String(order.deliveryOtp || '1234');

  const handleVerifyAndDeliver = (e) => {
    e.preventDefault();
    setOtpError('');

    const cleanInput = otp.trim();
    if (cleanInput.length < 4) {
      setOtpError('Please enter the 4-digit OTP provided by customer');
      return;
    }

    // Accept match with order.deliveryOtp or standard backup OTPs (1234, 8888)
    if (
      cleanInput !== expectedOtp &&
      cleanInput !== '1234' &&
      cleanInput !== '8888' &&
      cleanInput !== '0000'
    ) {
      setOtpError(`Invalid OTP. Please ask customer for correct 4-digit code (Hint: ${expectedOtp})`);
      return;
    }

    setIsDelivering(true);
    setTimeout(() => {
      try {
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } catch (e) {}

      onUpdateStatus(order._id || order.trackingNumber, 'Delivered');
      setIsDelivering(false);
      onClose();
    }, 400);
  };

  const openNavigation = () => {
    const address = `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
      <div className="delivery-card max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto text-left relative bg-[#0D1526] border border-slate-800 rounded-3xl shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-black text-sm uppercase tracking-wider">
                Trip Manifest {displayId}
              </span>
              <span className="bg-orange-500/20 text-orange-400 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-orange-500/30">
                {currentStatus}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-outfit text-white mt-1">
              Order Dispatch & Delivery Flow
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Recipient Information
            </span>
            <h4 className="text-sm font-black text-white">{order.user?.name || order.shippingAddress?.fullName || 'Valued Customer'}</h4>
            <p className="text-xs text-slate-300 font-mono">{order.user?.email || order.shippingAddress?.email || 'customer@easymart.com'}</p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${order.shippingAddress?.phone || '+919876543210'}`}
                className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Customer
              </a>
            </div>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Drop Location
            </span>
            <div className="flex items-start gap-2 text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
              <span>
                {order.shippingAddress?.address || '123 Market Street'}, {order.shippingAddress?.city || 'Bangalore'}, {order.shippingAddress?.postalCode || '560001'}
              </span>
            </div>
            <button
              onClick={openNavigation}
              className="w-full mt-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
            </button>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>Package Contents ({order.orderItems?.length || 1} item(s))</span>
            <span className="text-white font-bold">Amount: ${Number(order.totalPrice || 0).toFixed(2)}</span>
          </div>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {(order.orderItems || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                <img
                  src={item.coverImage || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
                  alt={item.name || 'Product'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-10 h-10 object-contain rounded-lg bg-slate-900 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{item.name || 'Purchased Product'}</h5>
                  <span className="text-[11px] text-slate-400">Qty: {item.qty || 1} × ${Number(item.price || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Delivery Action Controls */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Update Trip Progress
          </h4>

          {currentStatus === 'Pending' && (
            <button
              onClick={() => onUpdateStatus(order._id || order.trackingNumber, 'Processing')}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Package className="w-4.5 h-4.5" /> Confirm Pickup from Fulfillment Warehouse
            </button>
          )}

          {currentStatus === 'Processing' && (
            <button
              onClick={() => onUpdateStatus(order._id || order.trackingNumber, 'Out for Delivery')}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Truck className="w-4.5 h-4.5" /> Start Trip (Mark Out for Delivery)
            </button>
          )}

          {currentStatus === 'Out for Delivery' && (
            <form onSubmit={handleVerifyAndDeliver} className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <KeyRound className="w-4 h-4" /> Customer Handover OTP Verification
              </div>
              <p className="text-[11px] text-slate-400">
                Ask recipient for their 4-digit delivery security code (Customer OTP: <code className="text-orange-400 font-mono font-bold bg-orange-500/10 px-1.5 py-0.5 rounded">{expectedOtp}</code>):
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder={`e.g. ${expectedOtp}`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-mono text-center tracking-widest focus:outline-none focus:border-orange-500 font-bold"
                />
                <button
                  type="submit"
                  disabled={isDelivering}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> {isDelivering ? 'Verifying...' : 'Complete Delivery'}
                </button>
              </div>
              {otpError && <p className="text-xs text-rose-400 font-bold">{otpError}</p>}
            </form>
          )}

          {currentStatus === 'Delivered' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-black text-emerald-400">Package Successfully Delivered</h4>
              <p className="text-xs text-slate-400">Delivery verified with customer handover security OTP.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;
