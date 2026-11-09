const mongoose = require('mongoose');

const dtcFaultSchema = new mongoose.Schema(
  {
    vehicleBrand: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    vehicleModel: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sensor: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      enum: ['TPS', 'ECT', 'MAF', 'MAP', 'O2', 'GENERAL'],
      index: true,
    },
    dtcCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    faultDescription: {
      type: String,
      required: true,
      trim: true,
    },
    possibleCauses: {
      type: [String],
      required: true,
      default: [],
    },
    recommendedActions: {
      type: [String],
      required: true,
      default: [],
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast queries: Brand + Model + DTC Code
dtcFaultSchema.index({ vehicleBrand: 1, vehicleModel: 1, dtcCode: 1 });

module.exports = mongoose.model('DtcFault', dtcFaultSchema);

