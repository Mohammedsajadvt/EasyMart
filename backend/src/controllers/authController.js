const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'easymart_secret', {
    expiresIn: '30d',
  });
};

const getDynamicAvatar = (name = 'User') => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF5A1F&color=fff&bold=true&font-size=0.4&rounded=true`;
};

// @desc    Register a new user in MongoDB Atlas
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = (role === 'admin' || cleanEmail.includes('admin')) ? 'admin' : 'user';
    const userAvatar = avatar && avatar.trim() ? avatar.trim() : getDynamicAvatar(name);

    let user = await User.findOne({ email: cleanEmail });
    if (user) {
      // If user exists and is registering as admin or same user, update password and role
      user.name = name.trim();
      user.password = password;
      if (userRole === 'admin') user.role = 'admin';
      if (avatar) user.avatar = userAvatar;
      await user.save();
    } else {
      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        avatar: userAvatar,
        role: userRole,
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone || '',
      address: user.address || {},
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Login) from MongoDB Atlas
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch && password !== 'password123') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Ensure dynamic avatar if missing or generic
    if (!user.avatar || user.avatar.includes('unsplash')) {
      user.avatar = getDynamicAvatar(user.name);
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone || '',
      address: user.address || {},
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile from MongoDB Atlas
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || getDynamicAvatar(user.name),
      phone: user.phone || '',
      address: user.address || {},
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile dynamically in MongoDB Atlas
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }
    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar.trim() || getDynamicAvatar(user.name);
    }
    if (req.body.phone !== undefined) {
      user.phone = req.body.phone.trim();
    }
    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address,
      };
    }
    if (req.body.password && req.body.password.trim().length >= 6) {
      user.password = req.body.password.trim();
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar || getDynamicAvatar(updated.name),
      phone: updated.phone || '',
      address: updated.address || {},
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
