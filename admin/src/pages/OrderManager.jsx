import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Trash2,
  Eye,
  X,
  MapPin,
  CreditCard,
  User,
  ShieldCheck,
  Navigation,
  KeyRound,
  TrendingUp,
  RotateCcw,
  DollarSign,
  AlertCircle,
  Filter,
} from 'lucide-react';
import Header from '../components/Header';
import { adminAPI } from '../services/api';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'returns' | 'dispatches' | 'delivered'
  const [returnProcessing, setReturnProcessing] = useState(false);

  const fetchOrdersAndStaff = async () => {
    try {
      setLoading(true);
      const [ordersRes, driversRes, salesRes] = await Promise.all([
        adminAPI.getOrders(),
        adminAPI.getDeliveryFleet(),
        adminAPI.getSalesTeam(),
      ]);
      setOrders(ordersRes.data || []);
      setDrivers(driversRes.data || []);
      setSalesReps(salesRes.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndStaff();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) =>
          String(o._id) === String(orderId) ? { ...o, status: newStatus } : o
        )
      );
      if (selectedOrder && String(selectedOrder._id) === String(orderId)) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      setNotice(`✅ Order status updated to "${newStatus}"`);
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice('Failed to update status');
    }
  };

  const handleAssignDelivery = async (orderId, driverId) => {
    try {
      const res = await adminAPI.assignOrderDelivery(orderId, driverId);
      setOrders(
        orders.map((o) => (String(o._id) === String(orderId) ? res.data : o))
      );
      if (selectedOrder && String(selectedOrder._id) === String(orderId)) {
        setSelectedOrder(res.data);
      }
      setNotice('🚚 Delivery partner assigned to order successfully!');
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      setNotice('Failed to assign delivery partner');
    }
  };

  const handleProcessReturn = async (returnStatus, refundStatus) => {
    if (!selectedOrder) return;
    setReturnProcessing(true);
    try {
      const res = await adminAPI.processReturn(selectedOrder._id, {
        returnStatus,
        refundStatus,
        adminNotes: `Admin processed return status to ${returnStatus} on ${new Date().toLocaleDateString()}`,
      });
      const updated = res.data?.order || {
        ...selectedOrder,
        status: returnStatus === 'Refunded' ? 'Returned & Refunded' : returnStatus === 'Approved' ? 'Return Approved' : 'Return Rejected',
        returnRequest: {
          ...selectedOrder.returnRequest,
          status: returnStatus,
          refundStatus: refundStatus || selectedOrder.returnRequest?.refundStatus,
        },
      };
      setSelectedOrder(updated);
      setOrders(orders.map((o) => (String(o._id) === String(selectedOrder._id) ? updated : o)));
      setNotice(`🔄 Return workflow updated: "${returnStatus}"`);
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      console.error(err);
      setNotice('Failed to process return request');
    } finally {
      setReturnProcessing(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to remove this order from history?')) return;
    try {
      await adminAPI.deleteOrder(orderId);
      setOrders(orders.filter((o) => String(o._id) !== String(orderId)));
      if (selectedOrder && String(selectedOrder._id) === String(orderId)) {
        setSelectedOrder(null);
      }
      setNotice('Order removed from records.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice('Error deleting order');
    }
  };

  const returnOrders = orders.filter((o) => o.returnRequest?.isRequested || (o.status || '').includes('Return'));

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'returns') {
      return o.returnRequest?.isRequested || (o.status || '').includes('Return');
    }
    if (filterTab === 'dispatches') {
      return ['Processing', 'Shipped', 'Out for Delivery'].includes(o.status);
    }
    if (filterTab === 'delivered') {
      return o.status === 'Delivered';
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <Header
        title="Live Orders, Dispatch & Returns"
        subtitle="Manage customer shipments, Amazon/Flipkart courier allocation, and doorstep return & refund workflows"
      />

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold animate-fade">
          {notice}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterTab === 'all'
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
            : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
        >
          All Orders ({orders.length})
        </button>
        <button
          onClick={() => setFilterTab('returns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${filterTab === 'returns'
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
            : 'text-purple-400 hover:text-white bg-purple-500/10 border border-purple-500/20'
            }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Returns & Refunds ({returnOrders.length})</span>
        </button>
        <button
          onClick={() => setFilterTab('dispatches')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterTab === 'dispatches'
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
            : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
        >
          Active Dispatches
        </button>
        <button
          onClick={() => setFilterTab('delivered')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${filterTab === 'delivered'
            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
            : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
        >
          Delivered
        </button>
      </div>

      {/* Orders List Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Order ID & Date</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Items & Total</th>
                <th className="py-4 px-6">Assigned Delivery Partner</th>
                <th className="py-4 px-6">Fulfillment & Return</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    Loading orders from MongoDB Atlas...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500">
                    No orders matching this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isDelivered = (order.status || '').toLowerCase() === 'delivered';
                  const hasReturn = order.returnRequest?.isRequested || (order.status || '').includes('Return');
                  const assignedDriver = drivers.find((d) => String(d._id) === String(order.assignedDeliveryPartner?._id || order.assignedDeliveryPartner));

                  return (
                    <tr key={order._id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-mono font-bold text-orange-400">
                          {order.trackingNumber || `#${order._id.slice(-8)}`}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">
                          {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.shippingAddress?.city || 'Bangalore'}, {order.shippingAddress?.country || 'India'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {order.orderItems?.length || 1} item(s) • {order.paymentMethod || 'Card'}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {/* Delivery Partner Dispatch Select */}
                        <select
                          value={assignedDriver?._id || ''}
                          onChange={(e) => handleAssignDelivery(order._id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl py-1.5 px-3 focus:outline-none focus:border-orange-500 max-w-[170px]"
                        >
                          <option value="">⚡ Auto Dispatch Queue</option>
                          {drivers.map((d) => (
                            <option key={d._id} value={d._id}>
                              🚚 {d.name} ({d.vehicleType})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        {hasReturn ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                            <RotateCcw className="w-3 h-3" />
                            <span>{order.status || 'Return Requested'}</span>
                          </div>
                        ) : (
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none ${isDelivered
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : order.status === 'Out for Delivery'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                              }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Return Requested">Return Requested</option>
                            <option value="Returned & Refunded">Returned & Refunded</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade">
          <div className="admin-card p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                  Order Dispatch & Manifest
                </span>
                <h3 className="text-lg font-black font-mono text-white">
                  {selectedOrder.trackingNumber || selectedOrder._id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Return / Refund Workflow Action Panel (Amazon/Flipkart Model) */}
            {selectedOrder.returnRequest?.isRequested && (
              <div className="bg-purple-950/40 border-2 border-purple-500/40 p-4 sm:p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
                    <RotateCcw className="w-4 h-4" />
                    <span>Customer Return & Refund Request</span>
                  </div>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                    Status: {selectedOrder.returnRequest?.status || 'Requested'}
                  </span>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <p className="text-slate-300">
                    <strong>Reason:</strong> {selectedOrder.returnRequest?.reason || 'Defective item'}
                  </p>
                  {selectedOrder.returnRequest?.comments && (
                    <p className="text-slate-400 text-[11px]">
                      <strong>Customer Note:</strong> {selectedOrder.returnRequest.comments}
                    </p>
                  )}
                  <p className="text-emerald-400 text-[11px] font-bold">
                    Refund Amount: ${Number(selectedOrder.totalPrice || 0).toFixed(2)} (Refund Status: {selectedOrder.returnRequest?.refundStatus || 'Pending'})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    disabled={returnProcessing}
                    onClick={() => handleProcessReturn('Approved', 'Approved')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Return & Schedule Pickup
                  </button>
                  <button
                    disabled={returnProcessing}
                    onClick={() => handleProcessReturn('Refunded', 'Processed & Credited')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" /> Process 100% Refund
                  </button>
                  <button
                    disabled={returnProcessing}
                    onClick={() => handleProcessReturn('Rejected', 'Rejected')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 font-bold text-xs cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {/* Delivery OTP Callout */}
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <KeyRound className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer Delivery Handover OTP</span>
                  <span className="font-mono text-base font-black text-orange-400 tracking-widest">
                    {selectedOrder.deliveryOtp || '8492'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Required by driver to mark delivered</span>
            </div>

            {/* Shipping & Customer Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <User className="w-3.5 h-3.5 text-orange-400" /> Customer Information
                </div>
                <p className="text-white font-bold">{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name || 'Customer'}</p>
                <p className="text-slate-400">{selectedOrder.shippingAddress?.phone || '+91 9876543210'}</p>
                <p className="text-slate-400">{selectedOrder.user?.email || 'customer@easymart.com'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" /> Destination Address
                </div>
                <p className="text-white font-bold">{selectedOrder.shippingAddress?.address || '123 Market Street'}</p>
                <p className="text-slate-400">
                  {selectedOrder.shippingAddress?.city || 'Bangalore'}, {selectedOrder.shippingAddress?.postalCode || '560001'}
                </p>
                <p className="text-slate-400">{selectedOrder.shippingAddress?.country || 'India'}</p>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Purchased Items ({selectedOrder.orderItems?.length || 0})
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 divide-y divide-slate-800 pr-1">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 pt-2">
                    <img
                      src={item.coverImage || item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 object-contain p-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.qty} × ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-xs font-black text-white">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Calculations */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400">Total Charged</span>
              <span className="text-orange-400 text-lg font-black font-outfit">
                ${Number(selectedOrder.totalPrice || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
