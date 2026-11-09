const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    fuelType: {
      type: String,
      default: 'Petrol / Hybrid',
    },
    supportedSensors: {
      type: [String],
      default: ['TPS', 'ECT', 'MAF', 'MAP', 'O2'],
    },
    ecuProtocol: {
      type: String,
      default: 'ISO 15765-4 (CAN 11/500)',
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ brand: 1, model: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);

