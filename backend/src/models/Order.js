const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'Credit Card / Debit Card',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    discountPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Shipped',
        'Out for Delivery',
        'Delivered',
        'Return Requested',
        'Return Approved',
        'Return In-Transit',
        'Returned & Refunded',
        'Return Rejected',
        'Cancelled',
      ],
      default: 'Processing',
    },
    returnRequest: {
      isRequested: { type: Boolean, default: false },
      requestedAt: { type: Date },
      reason: { type: String, default: '' },
      comments: { type: String, default: '' },
      status: {
        type: String,
        enum: ['None', 'Requested', 'Approved', 'Pickup Assigned', 'Picked Up', 'Refunded', 'Rejected'],
        default: 'None',
      },
      refundAmount: { type: Number, default: 0 },
      refundStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Processed & Credited', 'Rejected'],
        default: 'Pending',
      },
      pickupDate: { type: Date },
      pickupHub: { type: String, default: '' },
      pickupDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      adminNotes: { type: String, default: '' },
    },
    trackingNumber: {
      type: String,
      default: function () {
        return 'EM-' + Math.floor(10000000 + Math.random() * 90000000);
      },
    },
    // Amazon/Flipkart Logistics Dispatch Assignment
    assignedDeliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    pickupHub: {
      type: String,
      default: 'Central Fulfillment Hub, Bangalore',
    },
    deliveryOtp: {
      type: String,
      default: function () {
        return String(Math.floor(1000 + Math.random() * 9000));
      },
    },
    // Sales Executive Attribution
    assignedSalesRepresentative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    salesCode: {
      type: String,
      default: '',
    },
    commissionAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
