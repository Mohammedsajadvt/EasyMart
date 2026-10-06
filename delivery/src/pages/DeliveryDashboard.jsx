import React, { useState, useEffect } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Navigation,
  DollarSign,
  Award,
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import Header from '../components/Header';
import TripDetailsModal from './TripDetailsModal';
import { deliveryAPI } from '../services/api';
import { useDeliveryAuth } from '../context/DeliveryAuthContext';

const DeliveryDashboard = () => {
  const { isOnline } = useDeliveryAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notice, setNotice] = useState('');

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const res = await deliveryAPI.getOrders();
      const list = Array.isArray(res.data) ? res.data : res.data?.orders || [];
      setOrders(list);
    } catch (err) {
      console.error('Failed to load deliveries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await deliveryAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          String(o._id) === String(orderId) || String(o.trackingNumber) === String(orderId)
            ? { ...o, status: newStatus }
            : o
        )
      );
      if (
        selectedOrder &&
        (String(selectedOrder._id) === String(orderId) ||
          String(selectedOrder.trackingNumber) === String(orderId))
      ) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
      setNotice(`✅ Order status updated to "${newStatus}"!`);
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      console.error('Failed to update status:', err);
      setNotice('Failed to update status on server');
    }
  };

  const filteredOrders =
    filterStatus === 'All'
      ? orders
      : orders.filter((o) => (o.status || 'Pending').toLowerCase() === filterStatus.toLowerCase());

  // Metrics
  const activeCount = orders.filter((o) =>
    ['Pending', 'Processing', 'Out for Delivery'].includes(o.status || 'Pending')
  ).length;
  const completedCount = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;
  const estimatedEarnings = (completedCount * 12.5 + activeCount * 5.0).toFixed(2);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 pb-16 text-left">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-8 space-y-8">
        {/* Banner Alert for Notice */}
        {notice && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-2xl text-xs font-bold animate-fade">
            {notice}
          </div>
        )}

        {/* Offline Warning Banner */}
        {!isOnline && (
          <div className="bg-rose-500/15 border border-rose-500/30 p-4 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-rose-400">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <p className="text-xs font-bold">
                You are currently <span className="uppercase font-black">Offline</span>. Switch duty to "Online" from top bar to receive new dispatch requests.
              </p>
            </div>
          </div>
        )}

        {/* 1. Driver Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="delivery-card p-5 sm:p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Deliveries
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-1">
                {activeCount}
              </h3>
              <span className="text-[10px] text-orange-400 font-bold mt-0.5 block">
                In Queue / Transit
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="delivery-card p-5 sm:p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Delivered Today
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-emerald-400 mt-1">
                {completedCount}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
                100% Success Rate
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="delivery-card p-5 sm:p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Estimated Payout
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-amber-400 mt-1">
                ${estimatedEarnings}
              </h3>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
                Base Fee + Tips
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="delivery-card p-5 sm:p-6 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Driver Rating
              </span>
              <h3 className="text-2xl sm:text-3xl font-black font-outfit text-indigo-400 mt-1">
                ⭐ 4.95
              </h3>
              <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
                Top Courier Tier
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2. Deliveries Queue Table & Cards */}
        <div className="delivery-card p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-black text-orange-500 uppercase tracking-widest mb-1">
                <Package className="w-4 h-4" /> Real-time Logistics
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-outfit text-white">
                Live Delivery Trips Queue
              </h2>
            </div>

            {/* Filter Tabs & Refresh */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Pending', 'Processing', 'Out for Delivery', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === status
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}

              <button
                onClick={fetchDeliveries}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer ml-1"
                title="Refresh Deliveries"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Deliveries List */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
              Fetching live delivery dispatches from MongoDB Atlas...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No orders found for selected filter status.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrders.map((order, idx) => {
                const status = order.status || 'Pending';
                const isDelivered = status.toLowerCase() === 'delivered';
                const orderIdSafe = String(order._id || order.trackingNumber || `order-${idx}`);
                const displayId = order.trackingNumber || `#${orderIdSafe.slice(-8)}`;

                return (
                  <div
                    key={order._id || order.trackingNumber || idx}
                    className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-orange-500/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Order Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                        <div>
                          <span className="text-orange-400 font-mono text-xs font-black">
                            {displayId}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(order.createdAt || Date.now()).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isDelivered
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : status === 'Out for Delivery'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {/* Recipient & Location */}
                      <div className="pt-3 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="font-bold text-white">
                            {order.user?.name || order.shippingAddress?.fullName || 'Customer'}
                          </span>
                          <span className="font-mono font-black text-orange-400">
                            ${Number(order.totalPrice || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 text-slate-400 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">
                            {order.shippingAddress?.address || '123 Market Street'},{' '}
                            {order.shippingAddress?.city || 'Bangalore'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>📦 {order.orderItems?.length || 1} Package Item(s)</span>
                          {order.deliveryOtp && (
                            <span className="text-emerald-400 font-mono text-[10px] font-bold">
                              OTP: {order.deliveryOtp}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-3 border-t border-slate-800">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
                      >
                        <span>Manage Trip & OTP</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Trip Modal */}
      {selectedOrder && (
        <TripDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </div>
  );
};

export default DeliveryDashboard;
