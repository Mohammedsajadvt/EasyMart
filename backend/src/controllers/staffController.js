const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all delivery fleet personnel (Admin)
// @route   GET /api/staff/delivery
// @access  Private/Admin
const getDeliveryFleet = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'delivery' }).select('-password').sort({ createdAt: -1 });

    // Populate active delivery counts for each driver
    const fleetWithStats = await Promise.all(
      drivers.map(async (driver) => {
        const activeTripsCount = await Order.countDocuments({
          assignedDeliveryPartner: driver._id,
          status: { $in: ['Pending', 'Processing', 'Out for Delivery'] },
        });
        const completedCount = await Order.countDocuments({
          assignedDeliveryPartner: driver._id,
          status: 'Delivered',
        });
        return {
          ...driver.toObject(),
          activeTripsCount,
          completedCount,
        };
      })
    );

    res.json(fleetWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new delivery partner account (Admin Only)
// @route   POST /api/staff/delivery
// @access  Private/Admin
const createDeliveryPartner = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType, vehicleNumber, assignedHub, emergencyPhone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const driver = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone || '',
      role: 'delivery',
      vehicleType: vehicleType || 'Bike',
      vehicleNumber: vehicleNumber || 'KA-01-EA-2026',
      assignedHub: assignedHub || 'Central Logistics Hub',
      dutyStatus: 'online',
      emergencyPhone: emergencyPhone || '',
      currentLocation: {
        lat: 12.9716 + (Math.random() - 0.5) * 0.05,
        lng: 77.5946 + (Math.random() - 0.5) * 0.05,
        address: `${assignedHub || 'Central Logistics Hub'}, Bangalore`,
        lastUpdated: new Date(),
      },
    });

    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      role: driver.role,
      vehicleType: driver.vehicleType,
      vehicleNumber: driver.vehicleNumber,
      assignedHub: driver.assignedHub,
      dutyStatus: driver.dutyStatus,
      currentLocation: driver.currentLocation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update driver duty status or GPS location (Driver or Admin)
// @route   PUT /api/staff/delivery/:id/location
// @access  Private
const updateDeliveryLocation = async (req, res) => {
  try {
    const { lat, lng, address, dutyStatus } = req.body;
    const driver = await User.findById(req.params.id);

    if (!driver || driver.role !== 'delivery') {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    if (lat && lng) {
      driver.currentLocation = {
        lat: Number(lat),
        lng: Number(lng),
        address: address || driver.currentLocation.address,
        lastUpdated: new Date(),
      };
    }

    if (dutyStatus) {
      driver.dutyStatus = dutyStatus;
    }

    await driver.save();
    res.json({
      _id: driver._id,
      dutyStatus: driver.dutyStatus,
      currentLocation: driver.currentLocation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sales team representatives (Admin)
// @route   GET /api/staff/sales
// @access  Private/Admin
const getSalesTeam = async (req, res) => {
  try {
    const reps = await User.find({ role: 'sales' }).select('-password').sort({ createdAt: -1 });

    // Calculate live sales metrics from orders
    const repsWithMetrics = await Promise.all(
      reps.map(async (rep) => {
        const orders = await Order.find({
          $or: [
            { assignedSalesRepresentative: rep._id },
            { salesCode: rep.salesCode },
          ],
        });

        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
        const commissionEarned = (totalRevenue * ((rep.commissionRate || 5) / 100));
        const ordersCount = orders.length;

        return {
          ...rep.toObject(),
          totalSalesGenerated: Number(totalRevenue.toFixed(2)),
          totalCommissionEarned: Number(commissionEarned.toFixed(2)),
          ordersClosedCount: ordersCount,
          targetProgressPercent: Math.min(100, Math.round((totalRevenue / (rep.monthlyTarget || 10000)) * 100)),
        };
      })
    );

    res.json(repsWithMetrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new sales representative (Admin Only)
// @route   POST /api/staff/sales
// @access  Private/Admin
const createSalesRepresentative = async (req, res) => {
  try {
    const { name, email, password, phone, region, monthlyTarget, commissionRate, salesCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const generatedCode = salesCode && salesCode.trim()
      ? salesCode.toUpperCase().trim()
      : `EM-SALES-${name.split(' ')[0].toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const rep = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      phone: phone || '',
      role: 'sales',
      salesCode: generatedCode,
      region: region || 'South Metro Territory',
      monthlyTarget: Number(monthlyTarget) || 15000,
      commissionRate: Number(commissionRate) || 5.0,
      totalSalesGenerated: 0,
      totalCommissionEarned: 0,
    });

    res.status(201).json({
      _id: rep._id,
      name: rep.name,
      email: rep.email,
      phone: rep.phone,
      role: rep.role,
      salesCode: rep.salesCode,
      region: rep.region,
      monthlyTarget: rep.monthlyTarget,
      commissionRate: rep.commissionRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign an order to a delivery partner (Admin Dispatch / Amazon Model)
// @route   PUT /api/orders/:id/assign-delivery
// @access  Private/Admin
const assignOrderDelivery = async (req, res) => {
  try {
    const { driverId, pickupHub } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'delivery') {
      return res.status(400).json({ message: 'Selected delivery partner is invalid' });
    }

    order.assignedDeliveryPartner = driver._id;
    if (pickupHub) order.pickupHub = pickupHub;
    if (order.status === 'Pending') order.status = 'Processing';

    // Generate delivery OTP for customer verification
    if (!order.deliveryOtp) {
      order.deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));
    }

    const updated = await order.save();
    const populated = await Order.findById(updated._id)
      .populate('user', 'name email phone')
      .populate('assignedDeliveryPartner', 'name phone vehicleType vehicleNumber');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign an order to a sales executive (Admin Attribution)
// @route   PUT /api/orders/:id/assign-sales
// @access  Private/Admin
const assignOrderSales = async (req, res) => {
  try {
    const { salesRepId, salesCode } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    let rep = null;
    if (salesRepId) {
      rep = await User.findById(salesRepId);
    } else if (salesCode) {
      rep = await User.findOne({ salesCode: salesCode.toUpperCase().trim() });
    }

    if (rep) {
      order.assignedSalesRepresentative = rep._id;
      order.salesCode = rep.salesCode;
      order.commissionAmount = Number((order.totalPrice * ((rep.commissionRate || 5) / 100)).toFixed(2));
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assigned delivery trips for logged-in driver
// @route   GET /api/delivery/my-trips
// @access  Private (Driver)
const getDriverTrips = async (req, res) => {
  try {
    const driverId = req.user?._id;
    let orders = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = {};
        if (driverId && mongoose.Types.ObjectId.isValid(driverId)) {
          query = {
            $or: [
              { assignedDeliveryPartner: driverId },
              { assignedDeliveryPartner: { $exists: false } },
              { assignedDeliveryPartner: null },
            ],
          };
        }
        orders = await Order.find(query)
          .populate('user', 'name email phone')
          .populate('assignedDeliveryPartner', 'name phone vehicleType')
          .sort({ createdAt: -1 });
        return res.json(orders);
      } catch (dbErr) {
        console.error('getDriverTrips DB error:', dbErr.message);
      }
    }

    const { inMemoryOrders } = require('../config/store');
    res.json(inMemoryOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics for logged-in sales rep
// @route   GET /api/staff/sales/my-dashboard
// @access  Private (Sales Rep)
const getSalesRepDashboard = async (req, res) => {
  try {
    const rep = await User.findById(req.user._id).select('-password');
    if (!rep || (rep.role !== 'sales' && rep.role !== 'admin')) {
      return res.status(403).json({ message: 'Access restricted to sales executives' });
    }

    const orders = await Order.find({
      $or: [
        { assignedSalesRepresentative: rep._id },
        { salesCode: rep.salesCode },
      ],
    })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const commissionEarned = totalRevenue * ((rep.commissionRate || 5) / 100);
    const monthlyTarget = rep.monthlyTarget || 15000;
    const targetProgressPercent = Math.min(100, Math.round((totalRevenue / monthlyTarget) * 100));

    res.json({
      rep,
      metrics: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        commissionEarned: Number(commissionEarned.toFixed(2)),
        monthlyTarget,
        targetProgressPercent,
        closedDealsCount: orders.length,
        averageOrderValue: orders.length ? Number((totalRevenue / orders.length).toFixed(2)) : 0,
      },
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sales rep creates a direct client lead / order with attached referral code
// @route   POST /api/staff/sales/create-lead-order
// @access  Private (Sales Rep)
const createSalesLeadOrder = async (req, res) => {
  try {
    const rep = await User.findById(req.user._id);
    const {
      clientName,
      clientEmail,
      clientPhone,
      clientAddress,
      clientCity,
      orderItems,
      totalPrice,
      notes,
    } = req.body;

    if (!clientName || !orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Client name and items are required' });
    }

    const firstDbProd = await Product.findOne({});

    const sanitizedItems = orderItems.map((item) => {
      const isValidId = item.product && mongoose.Types.ObjectId.isValid(item.product);
      return {
        name: item.name || 'Enterprise Product',
        qty: Number(item.qty || 1),
        price: Number(item.price || 0),
        image: item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        product: isValidId ? item.product : (firstDbProd?._id || new mongoose.Types.ObjectId()),
      };
    });

    const commissionAmount = Number(((totalPrice || 0) * ((rep?.commissionRate || 5) / 100)).toFixed(2));

    const newOrder = await Order.create({
      user: rep?._id || (await User.findOne({ role: 'admin' }))?._id,
      orderItems: sanitizedItems,
      shippingAddress: {
        fullName: clientName,
        address: clientAddress || 'Direct Sales Drop',
        city: clientCity || 'Metro City',
        postalCode: '560001',
        country: 'India',
        phone: clientPhone || '',
      },
      paymentMethod: 'Direct Sales Invoice / Net 30',
      totalPrice: Number(totalPrice || 0),
      itemsPrice: Number(totalPrice || 0),
      isPaid: true,
      paidAt: new Date(),
      status: 'Processing',
      assignedSalesRepresentative: rep?._id,
      salesCode: rep?.salesCode || 'DIRECT-SALES',
      commissionAmount,
    });

    res.status(201).json({
      message: 'Client lead order logged and attributed to your sales quota!',
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete/Deactivate a staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    await staff.deleteOne();
    res.json({ message: 'Staff member account removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDeliveryFleet,
  createDeliveryPartner,
  updateDeliveryLocation,
  getSalesTeam,
  createSalesRepresentative,
  assignOrderDelivery,
  assignOrderSales,
  getDriverTrips,
  getSalesRepDashboard,
  createSalesLeadOrder,
  deleteStaff,
};
