const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { inMemoryOrders, inMemoryProducts, inMemoryUsers } = require('../config/store');

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Create new order directly in MongoDB Atlas
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountPrice,
      totalPrice,
      salesCode,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    // Sanitize order items to ensure valid ObjectIds for MongoDB
    let defaultProduct = null;
    if (isDbConnected()) {
      try {
        defaultProduct = await Product.findOne({});
      } catch (e) {}
    }

    const sanitizedItems = orderItems.map((item) => {
      const isValidId = item.product && mongoose.Types.ObjectId.isValid(String(item.product));
      return {
        name: item.name || 'Product Item',
        qty: Number(item.qty || 1),
        price: Number(item.price || 0),
        image:
          item.image ||
          item.coverImage ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        product: isValidId
          ? item.product
          : defaultProduct?._id || new mongoose.Types.ObjectId(),
      };
    });

    const trackingNum = 'EM-' + Math.floor(10000000 + Math.random() * 90000000);
    const otpCode = String(Math.floor(1000 + Math.random() * 9000));

    // Optional Sales Executive Attribution
    let salesRepId = null;
    let matchedSalesCode = '';
    let commissionAmt = 0;

    const codeToSearch = salesCode || req.body.referralCode || req.query.ref;
    if (codeToSearch && isDbConnected()) {
      try {
        const salesRep = await User.findOne({
          salesCode: String(codeToSearch).toUpperCase().trim(),
        });
        if (salesRep) {
          salesRepId = salesRep._id;
          matchedSalesCode = salesRep.salesCode;
          commissionAmt = Number(
            ((Number(totalPrice || 0) * (salesRep.commissionRate || 5)) / 100).toFixed(2)
          );
        }
      } catch (e) {}
    }

    const orderData = {
      user: req.user._id,
      orderItems: sanitizedItems,
      shippingAddress: shippingAddress || {
        fullName: req.user.name || 'Customer',
        address: '123 Main Street',
        city: 'Bangalore',
        postalCode: '560001',
        country: 'India',
        phone: req.user.phone || '9876543210',
      },
      paymentMethod: paymentMethod || 'Credit Card / Online',
      itemsPrice: Number(itemsPrice || 0),
      taxPrice: Number(taxPrice || 0),
      shippingPrice: Number(shippingPrice || 0),
      discountPrice: Number(discountPrice || 0),
      totalPrice: Number(totalPrice || 0),
      isPaid: true,
      paidAt: new Date(),
      status: 'Processing',
      trackingNumber: trackingNum,
      deliveryOtp: otpCode,
      pickupHub: 'Central Logistics Fulfillment Hub, Bangalore',
      assignedSalesRepresentative: salesRepId,
      salesCode: matchedSalesCode,
      commissionAmount: commissionAmt,
    };

    if (isDbConnected()) {
      try {
        const created = await Order.create(orderData);
        const populated = await Order.findById(created._id)
          .populate('user', 'name email phone')
          .populate('assignedDeliveryPartner', 'name phone vehicleType')
          .populate('assignedSalesRepresentative', 'name salesCode');
        inMemoryOrders.unshift(populated || created);
        return res.status(201).json(populated || created);
      } catch (dbErr) {
        console.error('Order creation Mongo error:', dbErr.message);
      }
    }

    // In-memory fallback
    const memOrder = {
      ...orderData,
      _id: 'EM-' + Math.floor(10000000 + Math.random() * 90000000),
      createdAt: new Date().toISOString(),
    };
    inMemoryOrders.unshift(memOrder);
    res.status(201).json(memOrder);
  } catch (error) {
    console.error('addOrderItems exception:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID or trackingNumber
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const idParam = req.params.id;

    if (isDbConnected()) {
      try {
        let order = null;
        if (mongoose.Types.ObjectId.isValid(idParam)) {
          order = await Order.findById(idParam)
            .populate('user', 'name email phone')
            .populate('assignedDeliveryPartner', 'name phone vehicleType vehicleNumber')
            .populate('assignedSalesRepresentative', 'name email salesCode');
        }
        if (!order) {
          order = await Order.findOne({ trackingNumber: idParam })
            .populate('user', 'name email phone')
            .populate('assignedDeliveryPartner', 'name phone vehicleType vehicleNumber')
            .populate('assignedSalesRepresentative', 'name email salesCode');
        }
        if (order) return res.json(order);
      } catch (e) {}
    }

    const order = inMemoryOrders.find(
      (o) => String(o._id) === String(idParam) || String(o.trackingNumber) === String(idParam)
    );
    if (order) return res.json(order);

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const orders = await Order.find({ user: req.user._id })
          .populate('assignedDeliveryPartner', 'name phone vehicleType')
          .populate('assignedSalesRepresentative', 'name salesCode')
          .sort({ createdAt: -1 });
        return res.json(orders);
      } catch (e) {}
    }

    const orders = inMemoryOrders.filter((o) => String(o.user) === String(req.user._id));
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin Portal)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const orders = await Order.find({})
          .populate('user', 'name email phone')
          .populate('assignedDeliveryPartner', 'name phone vehicleType vehicleNumber')
          .populate('assignedSalesRepresentative', 'name email salesCode')
          .sort({ createdAt: -1 });
        return res.json(orders);
      } catch (e) {}
    }

    res.json(inMemoryOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (isDbConnected()) {
      try {
        let order = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          order = await Order.findById(req.params.id);
        } else {
          order = await Order.findOne({ trackingNumber: req.params.id });
        }

        if (order) {
          order.status = status || order.status;
          if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
          }
          const updated = await order.save();
          return res.json(updated);
        }
      } catch (e) {}
    }

    const idx = inMemoryOrders.findIndex(
      (o) => String(o._id) === String(req.params.id) || String(o.trackingNumber) === String(req.params.id)
    );
    if (idx !== -1) {
      inMemoryOrders[idx].status = status;
      if (status === 'Delivered') {
        inMemoryOrders[idx].isDelivered = true;
        inMemoryOrders[idx].deliveredAt = new Date().toISOString();
      }
      return res.json(inMemoryOrders[idx]);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard summary statistics
// @route   GET /api/orders/stats/summary
// @access  Private/Admin
const getStatsSummary = async (req, res) => {
  try {
    let totalSales = 0;
    let ordersCount = 0;
    let productsCount = 0;
    let usersCount = 0;

    if (isDbConnected()) {
      try {
        const [orders, dbProdCount, dbUserCount] = await Promise.all([
          Order.find({}),
          Product.countDocuments({}),
          User.countDocuments({}),
        ]);
        totalSales = orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
        ordersCount = orders.length;
        productsCount = dbProdCount;
        usersCount = dbUserCount;

        return res.json({
          totalSales: totalSales.toFixed(2),
          ordersCount,
          productsCount,
          usersCount,
        });
      } catch (e) {}
    }

    totalSales = inMemoryOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
    ordersCount = inMemoryOrders.length;
    productsCount = inMemoryProducts.length;
    usersCount = inMemoryUsers.length;

    res.json({
      totalSales: totalSales.toFixed(2),
      ordersCount,
      productsCount,
      usersCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Customer or Admin requests return / refund / replacement (Amazon/Flipkart model)
// @route   POST /api/orders/:id/return
// @access  Private
const requestOrderReturn = async (req, res) => {
  try {
    const { reason, comments } = req.body;
    let order = null;

    if (isDbConnected()) {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        order = await Order.findById(req.params.id);
      } else {
        order = await Order.findOne({ trackingNumber: req.params.id });
      }
    } else {
      order = inMemoryOrders.find(
        (o) => String(o._id) === String(req.params.id) || String(o.trackingNumber) === String(req.params.id)
      );
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'Return Requested';
    order.returnRequest = {
      isRequested: true,
      requestedAt: new Date(),
      reason: reason || 'Item defective / Not satisfied',
      comments: comments || '',
      status: 'Requested',
      refundAmount: order.totalPrice,
      refundStatus: 'Pending',
    };

    if (isDbConnected()) {
      await order.save();
    }

    res.json({
      message: 'Return request submitted successfully. A courier will be assigned for doorstep reverse pickup.',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin reviews and updates return/refund status
// @route   PUT /api/orders/:id/return-process
// @access  Private/Admin
const processReturnAdmin = async (req, res) => {
  try {
    const { returnStatus, refundStatus, adminNotes, pickupDriverId, pickupHub } = req.body;
    let order = null;

    if (isDbConnected()) {
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        order = await Order.findById(req.params.id);
      } else {
        order = await Order.findOne({ trackingNumber: req.params.id });
      }
    } else {
      order = inMemoryOrders.find(
        (o) => String(o._id) === String(req.params.id) || String(o.trackingNumber) === String(req.params.id)
      );
    }

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.returnRequest) {
      order.returnRequest = { isRequested: true };
    }

    if (returnStatus) {
      order.returnRequest.status = returnStatus;
      if (returnStatus === 'Approved') order.status = 'Return Approved';
      if (returnStatus === 'Picked Up') order.status = 'Return In-Transit';
      if (returnStatus === 'Refunded') {
        order.status = 'Returned & Refunded';
        order.returnRequest.refundStatus = 'Processed & Credited';
      }
      if (returnStatus === 'Rejected') {
        order.status = 'Return Rejected';
        order.returnRequest.refundStatus = 'Rejected';
      }
    }

    if (refundStatus) {
      order.returnRequest.refundStatus = refundStatus;
      if (refundStatus === 'Processed & Credited') {
        order.status = 'Returned & Refunded';
      }
    }

    if (adminNotes) order.returnRequest.adminNotes = adminNotes;
    if (pickupDriverId) order.returnRequest.pickupDriver = pickupDriverId;
    if (pickupHub) order.returnRequest.pickupHub = pickupHub;

    if (isDbConnected()) {
      await order.save();
    }

    res.json({
      message: 'Return and refund workflow status updated successfully.',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        let order = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          order = await Order.findById(req.params.id);
        } else {
          order = await Order.findOne({ trackingNumber: req.params.id });
        }
        if (order) await order.deleteOne();
      } catch (e) {}
    }

    const idx = inMemoryOrders.findIndex(
      (o) => String(o._id) === String(req.params.id) || String(o.trackingNumber) === String(req.params.id)
    );
    if (idx !== -1) {
      inMemoryOrders.splice(idx, 1);
    }

    res.json({ message: 'Order removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  getStatsSummary,
  deleteOrder,
  requestOrderReturn,
  processReturnAdmin,
};
