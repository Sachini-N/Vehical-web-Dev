const mongoose = require('mongoose');

// Prevent Mongoose from buffering queries when MongoDB is offline,
// ensuring immediate fallback without 10-second request timeouts.
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vehicle_fault_db', {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`[MongoDB Offline]: ${error.message}`);
    console.log('[Fallback Mode]: Running in instant local offline fallback mode.');
  }
};

module.exports = connectDB;
