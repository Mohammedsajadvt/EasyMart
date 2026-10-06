import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Search,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Trash2,
  X,
  Navigation,
  KeyRound,
  RefreshCw,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import Header from '../components/Header';
import { adminAPI } from '../services/api';

const DeliveryFleetManager = () => {
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // New Driver Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '',
    vehicleType: 'Bike',
    vehicleNumber: '',
    assignedHub: 'Central Fulfillment Hub, Bangalore',
    emergencyPhone: '',
  });

  const fetchFleet = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDeliveryFleet();
      setFleet(res.data || []);
    } catch (err) {
      console.error('Failed to load fleet:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  const handleCreateDriver = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setNotice('Please fill all required fields');
      return;
    }

    try {
      setActionLoading(true);
      await adminAPI.createDeliveryPartner(formData);
      setNotice(`✅ Delivery partner "${formData.name}" created successfully!`);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        phone: '',
        vehicleType: 'Bike',
        vehicleNumber: '',
        assignedHub: 'Central Fulfillment Hub, Bangalore',
        emergencyPhone: '',
      });
      fetchFleet();
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      setNotice(err.response?.data?.message || 'Failed to create delivery partner');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteStaff = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate delivery partner "${name}"?`)) return;
    try {
      await adminAPI.deleteStaff(id);
      setFleet(fleet.filter((f) => f._id !== id));
      setNotice(`✅ Delivery partner "${name}" removed from active fleet`);
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice('Failed to remove staff member');
    }
  };

  const filteredFleet = fleet.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.vehicleNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (driver.assignedHub || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Metrics
  const totalDrivers = fleet.length;
  const onDutyCount = fleet.filter((d) => d.dutyStatus === 'online' || d.dutyStatus === 'on_delivery').length;
  const activeTripsTotal = fleet.reduce((acc, d) => acc + (d.activeTripsCount || 0), 0);
  const completedTotal = fleet.reduce((acc, d) => acc + (d.completedCount || 0), 0);

  return (
    <div className="space-y-6 text-left">
      <Header
        title="Delivery Fleet & Logistics Hub"
        subtitle="Manage on-demand delivery agents, track live GPS locations & warehouse dispatch allocation (Amazon / Flipkart Logistics Engine)"
      />

      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-xs font-bold animate-fade">
          {notice}
        </div>
      )}

      {/* 1. Fleet Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Courier Fleet
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-white mt-1">
              {totalDrivers}
            </h3>
            <span className="text-[10px] text-orange-400 font-bold mt-0.5 block">
              Registered Drivers
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              On-Duty Agents
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-emerald-400 mt-1">
              {onDutyCount}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
              Live & Dispatched
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Trips In Route
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-amber-400 mt-1">
              {activeTripsTotal}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
              Out for Delivery
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-card p-5 sm:p-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Deliveries Done
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-outfit text-indigo-400 mt-1">
              {completedTotal}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
              100% OTP Verified
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Fleet Search & Action Bar */}
      <div className="admin-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search driver by name, email, vehicle number, or hub..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '40px', paddingRight: '16px' }}
              className="w-full h-11 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchFleet}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              title="Refresh Fleet"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Delivery Agent
            </button>
          </div>
        </div>

        {/* 3. Fleet Cards Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-500 text-xs animate-pulse">
            Loading delivery fleet from MongoDB Atlas...
          </div>
        ) : filteredFleet.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No delivery agents registered. Click "Add Delivery Agent" to onboard your first courier driver!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFleet.map((driver) => {
              const isOnline = driver.dutyStatus === 'online' || driver.dutyStatus === 'on_delivery';
              const mapQuery = driver.currentLocation?.address || `${driver.currentLocation?.lat},${driver.currentLocation?.lng}`;

              return (
                <div
                  key={driver._id}
                  className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4 hover:border-orange-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Driver Name & Duty Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black text-sm">
                          {driver.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">{driver.name}</h4>
                          <span className="text-[11px] text-slate-400 font-mono">{driver.email}</span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isOnline
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {isOnline ? '● On Duty' : '○ Offline'}
                      </span>
                    </div>

                    {/* Vehicle & Hub Information */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Vehicle</span>
                        <span className="font-bold text-slate-200">{driver.vehicleType}</span>
                        <span className="text-[10px] text-orange-400 font-mono block mt-0.5">
                          {driver.vehicleNumber || 'KA-01-EA-2026'}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block">Assigned Hub</span>
                        <span className="font-bold text-slate-200 line-clamp-1">{driver.assignedHub}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Rating: ⭐ 4.9</span>
                      </div>
                    </div>

                    {/* Live GPS Pinpoint Location */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-500" /> Live Location Tracking
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-400 hover:text-orange-300 font-bold inline-flex items-center gap-0.5"
                        >
                          Map View <Navigation className="w-3 h-3" />
                        </a>
                      </div>
                      <p className="text-xs text-slate-300 font-medium line-clamp-1">
                        {driver.currentLocation?.address || 'Central Logistics Hub, Bangalore'}
                      </p>
                    </div>

                    {/* Performance & Active Trips Bar */}
                    <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                      <span>In-Route: <strong className="text-amber-400">{driver.activeTripsCount || 0} order(s)</strong></span>
                      <span>Total Done: <strong className="text-emerald-400">{driver.completedCount || 0} delivered</strong></span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Phone: <strong className="text-slate-300">{driver.phone || '+91 9876543210'}</strong>
                    </span>
                    <button
                      onClick={() => handleDeleteStaff(driver._id, driver.name)}
                      className="p-1.5 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      title="Deactivate Driver"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Add Delivery Agent Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade">
          <div className="admin-card max-w-lg w-full p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-outfit text-white">
                    Onboard Delivery Partner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Create dynamic credentials for delivery app access (`http://localhost:5175`)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh.courier@easymart.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Access Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="password123"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="Bike">Bike (Motorcycle)</option>
                    <option value="Electric Scooter">Electric Scooter (EV)</option>
                    <option value="Van">Van / Express Carrier</option>
                    <option value="Truck">Truck (Heavy Cargo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    License Plate / Vehicle No.
                  </label>
                  <input
                    type="text"
                    placeholder="KA-01-EA-2026"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Assigned Warehouse Hub
                  </label>
                  <input
                    type="text"
                    placeholder="Central Hub, Bangalore"
                    value={formData.assignedHub}
                    onChange={(e) => setFormData({ ...formData, assignedHub: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-xl text-xs shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
                >
                  {actionLoading ? 'Onboarding Driver...' : 'Register Delivery Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryFleetManager;
