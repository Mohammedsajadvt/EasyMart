const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'delivery', 'sales'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    phone: {
      type: String,
      default: '',
    },
    // Delivery Fleet Logistics Fields (Amazon / Flipkart Model)
    vehicleType: {
      type: String,
      enum: ['Bike', 'Electric Scooter', 'Van', 'Truck', 'Auto'],
      default: 'Bike',
    },
    vehicleNumber: {
      type: String,
      default: '',
    },
    assignedHub: {
      type: String,
      default: 'Central Logistics Hub',
    },
    dutyStatus: {
      type: String,
      enum: ['online', 'offline', 'on_delivery'],
      default: 'offline',
    },
    currentLocation: {
      lat: { type: Number, default: 12.9716 },
      lng: { type: Number, default: 77.5946 },
      address: { type: String, default: 'Central Fulfillment Hub, Bangalore' },
      lastUpdated: { type: Date, default: Date.now },
    },
    rating: {
      type: Number,
      default: 4.9,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    emergencyPhone: {
      type: String,
      default: '',
    },
    // Sales Executive Fields (Field Sales Team Tracking)
    salesCode: {
      type: String,
      default: '',
      trim: true,
    },
    region: {
      type: String,
      default: 'South Metro Territory',
    },
    monthlyTarget: {
      type: Number,
      default: 15000,
    },
    commissionRate: {
      type: Number,
      default: 5.0, // 5% standard commission
    },
    totalSalesGenerated: {
      type: Number,
      default: 0,
    },
    totalCommissionEarned: {
      type: Number,
      default: 0,
    },
    activeLeadsCount: {
      type: Number,
      default: 0,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: '' },
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
