const mongoose = require('mongoose');
const User = require('../models/User');
const { inMemoryUsers } = require('../config/store');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        if (users.length > 0) return res.json(users);
      } catch (e) {}
    }

    res.json(inMemoryUsers.map((u) => ({ ...u, password: undefined })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const user = await User.findById(req.params.id);
        if (user) await user.deleteOne();
      } catch (e) {}
    }

    const idx = inMemoryUsers.findIndex((u) => String(u._id) === String(req.params.id));
    if (idx !== -1) inMemoryUsers.splice(idx, 1);

    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role & auto-configure profile permissions (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const cleanRole = (role || 'customer').toLowerCase().trim();

    if (isDbConnected()) {
      try {
        const user = await User.findById(req.params.id);
        if (user) {
          user.role = cleanRole;

          // If assigned to delivery, auto-configure logistics defaults
          if (cleanRole === 'delivery') {
            user.dutyStatus = user.dutyStatus || 'online';
            user.vehicleType = user.vehicleType || 'Bike';
            user.vehicleNumber = user.vehicleNumber || `KA-${Math.floor(10 + Math.random() * 89)}-EA-${Math.floor(1000 + Math.random() * 9000)}`;
            user.assignedHub = user.assignedHub || 'Central Logistics Hub, Bangalore';
            user.currentLocation = user.currentLocation || {
              lat: 12.9716,
              lng: 77.5946,
              address: 'Central Fulfillment Hub, Bangalore',
              lastUpdated: new Date(),
            };
          }

          // If assigned to sales, auto-configure quota and referral code
          if (cleanRole === 'sales') {
            const initials = (user.name || 'REP').split(' ')[0].toUpperCase();
            user.salesCode = user.salesCode || `EM-SALES-${initials}-${Math.floor(10 + Math.random() * 90)}`;
            user.monthlyTarget = user.monthlyTarget || 15000;
            user.commissionRate = user.commissionRate || 5.0;
            user.region = user.region || 'Metro Territory';
          }

          const updated = await user.save();
          return res.json(updated);
        }
      } catch (e) {
        console.error('Update user role DB error:', e.message);
      }
    }

    const u = inMemoryUsers.find((x) => String(x._id) === String(req.params.id));
    if (u) {
      u.role = cleanRole;
      return res.json(u);
    }

    res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  updateUserRole,
};
