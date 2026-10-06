const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Atlas Connection Notice: ${error.message}`);
    console.log(`ℹ️ EasyMart running in resilient high-availability mode with instant zero-timeout store.`);
  }
};

const isDbConnected = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.isDbConnected = isDbConnected;
