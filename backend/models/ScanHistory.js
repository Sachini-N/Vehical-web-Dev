const mongoose = require('mongoose');

const scanHistorySchema = new mongoose.Schema(
  {
    vehicle: {
      brand: { type: String, required: true },
      model: { type: String, required: true },
    },
    scanDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    connectionType: {
      type: String,
      enum: ['ELM327_BLUETOOTH', 'OBD_SIMULATOR', 'BLE'],
      default: 'ELM327_BLUETOOTH',
    },
    sensorReadings: {
      rpm: { type: Number, default: 0 },
      speed: { type: Number, default: 0 },
      ect: { type: Number, default: 0 },
      iat: { type: Number, default: 0 },
      tps: { type: Number, default: 0 },
      maf: { type: Number, default: 0 },
      map: { type: Number, default: 0 },
      o2: { type: Number, default: 0 },
    },
    detectedDTCs: {
      type: [String],
      default: [],
    },
    matchedFaults: [
      {
        dtcCode: String,
        sensor: String,
        faultDescription: String,
        possibleCauses: [String],
        recommendedActions: [String],
        severity: String,
      },
    ],
    condition: {
      type: String,
      enum: ['NORMAL', 'FAULT_DETECTED', 'UNKNOWN'],
      default: 'NORMAL',
    },
    mlAnalysis: {
      predictedCondition: { type: String, default: 'Normal' },
      confidence: { type: Number, default: 1.0 },
      anomalySensors: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ScanHistory', scanHistorySchema);

