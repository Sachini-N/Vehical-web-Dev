const mongoose = require('mongoose');

const registeredVehicleSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  licensePlate: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  year: {
    type: Number,
    min: 1996,
    max: 2030,
    default: 2018,
  },
  fuelType: {
    type: String,
    default: 'Petrol / Hybrid',
  },
  mileage: {
    type: Number,
    default: 0,
  },
  engineCapacity: {
    type: String,
    default: '660cc',
  },
  isPrimary: {
    type: Boolean,
    default: true,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    vehicles: [registeredVehicleSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

