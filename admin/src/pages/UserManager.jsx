import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Truck,
  Briefcase,
  UserCheck,
  Trash2,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Header from '../components/Header';
import { adminAPI } from '../services/api';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (String(u._id) === String(userId) ? { ...u, role: newRole } : u))
      );
      setNotice(`✅ Role updated to "${newRole.toUpperCase()}"! Connected apps can access now.`);
      setTimeout(() => setNotice(''), 3500);
    } catch (err) {
      setNotice('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this account from MongoDB Atlas?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => String(u._id) !== String(id)));
      setNotice('🗑️ Account removed from database.');
      setTimeout(() => setNotice(''), 3000);
    } catch (err) {
      setNotice('Error deleting user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u._id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || (u.role || 'customer').toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (role) => {
    switch ((role || 'customer').toLowerCase()) {
      case 'admin':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'delivery':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'sales':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#080C14] text-slate-100 pb-16 text-left">
      <Header
        title="Accounts & Roles"
        subtitle={`Managing ${users.length} registered accounts in MongoDB Atlas with dynamic role assignment`}
        onRefresh={fetchUsers}
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
        {notice && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-fade">
            {notice}
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {['all', 'admin', 'delivery', 'sales', 'customer'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === role
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {role === 'all' ? `All (${users.length})` : role}
              </button>
            ))}
          </div>
        </div>

        {/* User Accounts Table */}
        <div className="admin-card overflow-hidden bg-slate-900/60 border border-slate-800/80 rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-4 px-6">User / Account</th>
                  <th className="py-4 px-6">Contact Email</th>
                  <th className="py-4 px-6">Role Permission</th>
                  <th className="py-4 px-6">Member Since</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-slate-500">
                      Loading user accounts from MongoDB Atlas...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-16 text-center text-slate-500">
                      No customer accounts matching your search filter.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const currentRole = (u.role || 'customer').toLowerCase();
                    return (
                      <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-4 px-6 flex items-center gap-3">
                          <img
                            src={
                              u.avatar ||
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'
                            }
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800 flex-shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block text-sm">{u.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: #{u._id ? u._id.slice(-6) : 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-300 font-medium">
                          {u.email}
                        </td>

                        <td className="py-4 px-6">
                          <select
                            value={currentRole}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            className={`text-xs font-bold py-1.5 px-3 rounded-xl border focus:outline-none cursor-pointer ${getRoleBadgeStyle(
                              currentRole
                            )}`}
                          >
                            <option value="customer" className="bg-slate-900 text-slate-200">
                              👤 Customer
                            </option>
                            <option value="delivery" className="bg-slate-900 text-emerald-400">
                              🚚 Delivery Courier
                            </option>
                            <option value="sales" className="bg-slate-900 text-purple-400">
                              💼 Sales Executive
                            </option>
                            <option value="admin" className="bg-slate-900 text-amber-400">
                              🛡️ Administrator
                            </option>
                          </select>
                        </td>

                        <td className="py-4 px-6 text-slate-400">
                          {new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
