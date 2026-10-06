import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  RotateCcw,
  AlertCircle,
  X,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Return Modal State
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('Defective / item not functioning');
  const [returnComments, setReturnComments] = useState('');
  const [returnLoading, setReturnLoading] = useState(false);
  const [returnNotice, setReturnNotice] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnOrder) return;
    setReturnLoading(true);
    setReturnNotice('');

    try {
      await orderAPI.requestReturn(returnOrder._id, {
        reason: returnReason,
        comments: returnComments,
      });
      setReturnNotice('Return & refund request submitted successfully! A pickup courier will be dispatched to your doorstep.');
      setTimeout(() => {
        setReturnOrder(null);
        setReturnNotice('');
        fetchOrders();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit return request');
    } finally {
      setReturnLoading(false);
    }
  };

  const getStatusBadge = (status, returnReq) => {
    if (returnReq?.isRequested || status?.includes('Return')) {
      return (
        <span className="badge bg-purple-100 text-purple-800 flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-full border border-purple-200">
          <RotateCcw className="w-3.5 h-3.5 text-purple-600" /> {status || 'Return Requested'}
        </span>
      );
    }

    switch (status) {
      case 'Delivered':
        return (
          <span className="badge bg-emerald-100 text-emerald-700 flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'Shipped':
      case 'Out for Delivery':
        return (
          <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-full border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> In Transit
          </span>
        );
      default:
        return (
          <span className="badge bg-amber-100 text-amber-700 flex items-center gap-1 font-bold text-[11px] px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
    }
  };

  return (
    <div className="py-8">
      <div className="container max-w-5xl">
        <div className="pb-6 mb-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-outfit text-slate-900">
              My Orders & Returns
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Track your shipments, check OTP for delivery, or request hassle-free returns & refunds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/shop" className="btn btn-primary text-xs px-5 py-2.5 rounded-xl font-bold">
              Shop More Products
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 mx-auto flex items-center justify-center">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No past orders yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start shopping today to discover incredible deals on top rated products.
            </p>
            <Link to="/shop" className="btn btn-primary text-xs px-6 py-2.5 rounded-xl font-bold">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isDelivered = order.status === 'Delivered';
              const hasReturn = order.returnRequest?.isRequested || order.status?.includes('Return');

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100 transition-all hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="p-4 sm:p-6 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">ORDER ID</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {order.trackingNumber || order._id}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">DATE PLACED</span>
                      <span className="font-bold text-slate-800">
                        {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-bold text-[10px] uppercase">TOTAL AMOUNT</span>
                      <span className="font-black text-slate-900 font-outfit text-sm">
                        ${Number(order.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>

                    {order.deliveryOtp && !isDelivered && (
                      <div className="bg-orange-50 border border-orange-200 px-3 py-1 rounded-xl">
                        <span className="text-[10px] font-bold text-orange-600 block">DELIVERY OTP</span>
                        <span className="font-mono font-black text-orange-700 text-xs tracking-wider">{order.deliveryOtp}</span>
                      </div>
                    )}

                    <div>{getStatusBadge(order.status, order.returnRequest)}</div>
                  </div>

                  {/* Items in this order */}
                  <div className="p-4 sm:p-6 space-y-4">
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt=""
                          className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 object-contain p-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-slate-400">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                        </div>
                        <span className="text-xs font-black text-slate-900">
                          ${(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Return / Refund Footer Bar */}
                  <div className="p-3.5 sm:px-6 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>7-Day Easy Replacement & 100% Refund Guarantee (Amazon/Flipkart model)</span>
                    </div>

                    <div>
                      {hasReturn ? (
                        <div className="flex items-center gap-2 text-purple-700 font-bold text-[11px] bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Status: {order.returnRequest?.status || 'Return in Process'} • Refund: {order.returnRequest?.refundStatus || 'Pending'}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReturnOrder(order)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs transition-colors cursor-pointer shadow-sm hover:text-orange-600"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
                          <span>Request Return / Refund</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Return & Refund Request Modal */}
      {returnOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade text-left border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black font-outfit text-slate-900">
                    Request Return & Refund
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Order ID: <strong className="font-mono">{returnOrder.trackingNumber || returnOrder._id}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReturnOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {returnNotice ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                <p>{returnNotice}</p>
              </div>
            ) : (
              <form onSubmit={handleReturnSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">
                    Reason for Return / Replacement *
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:border-orange-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Defective / item not functioning">Defective / item not functioning</option>
                    <option value="Received wrong item or size">Received wrong item or size</option>
                    <option value="Quality not as expected">Quality not as expected</option>
                    <option value="Damaged packaging during transit">Damaged packaging during transit</option>
                    <option value="Found better price elsewhere">Found better price elsewhere</option>
                    <option value="No longer needed">No longer needed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">
                    Additional Comments & Item Condition
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the issue or defect..."
                    value={returnComments}
                    onChange={(e) => setReturnComments(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-600">Estimated Refund Amount:</span>
                  <span className="font-black text-slate-900 text-sm font-outfit">
                    ${Number(returnOrder.totalPrice || 0).toFixed(2)}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                  <p className="font-bold text-amber-900">Doorstep Reverse Pickup Policy:</p>
                  <p>Our courier partner will inspect the package at your address. Upon reverse collection, your refund will be credited back automatically.</p>
                </div>

                <button
                  type="submit"
                  disabled={returnLoading}
                  className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  {returnLoading ? 'Submitting Request...' : 'Confirm & Request Doorstep Return'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
