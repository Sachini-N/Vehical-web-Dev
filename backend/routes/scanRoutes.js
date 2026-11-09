const express = require('express');
const router = express.Router();
const ScanHistory = require('../models/ScanHistory');

// In-memory fallback if MongoDB connection is pending
let localScanCache = [];

// POST /api/scans - Save a new vehicle scan result
router.post('/', async (req, res) => {
  const {
    vehicle,
    connectionType,
    sensorReadings,
    detectedDTCs,
    matchedFaults,
    condition,
    mlAnalysis,
  } = req.body;

  const scanRecord = {
    vehicle: vehicle || { brand: 'UNKNOWN', model: 'UNKNOWN' },
    connectionType: connectionType || 'ELM327_BLUETOOTH',
    scanDate: new Date(),
    sensorReadings: sensorReadings || {},
    detectedDTCs: detectedDTCs || [],
    matchedFaults: matchedFaults || [],
    condition: condition || (detectedDTCs && detectedDTCs.length > 0 ? 'FAULT_DETECTED' : 'NORMAL'),
    mlAnalysis: mlAnalysis || { predictedCondition: 'Normal', confidence: 1.0 },
  };

  try {
    const saved = await ScanHistory.create(scanRecord);
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    scanRecord._id = 'local_' + Date.now();
    localScanCache.unshift(scanRecord);
    res.status(201).json({ success: true, data: scanRecord, note: 'Saved in local fallback' });
  }
});

// GET /api/scans - Retrieve recent scan history
router.get('/', async (req, res) => {
  try {
    const history = await ScanHistory.find().sort({ scanDate: -1 }).limit(50);
    if (history && history.length > 0) {
      return res.json({ success: true, count: history.length, data: history });
    }
    return res.json({ success: true, count: localScanCache.length, data: localScanCache });
  } catch (error) {
    return res.json({ success: true, count: localScanCache.length, data: localScanCache });
  }
});

// GET /api/scans/:id - Retrieve specific scan details
router.get('/:id', async (req, res) => {
  try {
    const scan = await ScanHistory.findById(req.params.id);
    if (!scan) {
      const fallback = localScanCache.find((s) => s._id === req.params.id);
      if (fallback) return res.json({ success: true, data: fallback });
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }
    res.json({ success: true, data: scan });
  } catch (error) {
    const fallback = localScanCache.find((s) => s._id === req.params.id);
    if (fallback) return res.json({ success: true, data: fallback });
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

