const express = require('express');
const router = express.Router();
const DtcFault = require('../models/DtcFault');
const seedData = require('../seed/seedData.json');

// Helper to find fault in static seed data if MongoDB is offline
const findStaticFault = (brand, model, dtcCode) => {
  const code = dtcCode.toUpperCase().trim();
  const def = seedData.dtcDefinitions.find((d) => d.dtcCode.toUpperCase() === code);
  if (!def) return null;
  return {
    vehicleBrand: brand || 'GENERIC',
    vehicleModel: model || 'GENERIC',
    sensor: def.sensor,
    dtcCode: def.dtcCode,
    faultDescription: def.faultDescription,
    possibleCauses: def.possibleCauses,
    recommendedActions: def.recommendedActions,
    severity: def.severity,
  };
};

// GET /api/faults/match?brand=SUZUKI&model=Wagon%20R&dtc=P0101
router.get('/match', async (req, res) => {
  const { brand, model, dtc } = req.query;

  if (!dtc) {
    return res.status(400).json({ success: false, message: 'DTC code is required' });
  }

  const cleanDtc = dtc.toUpperCase().trim();
  const cleanBrand = brand ? brand.toUpperCase().trim() : '';
  const cleanModel = model ? model.trim() : '';

  try {
    // 1. Try exact vehicle-specific match
    let fault = null;
    if (cleanBrand && cleanModel) {
      fault = await DtcFault.findOne({
        vehicleBrand: cleanBrand,
        vehicleModel: { $regex: new RegExp(`^${cleanModel}$`, 'i') },
        dtcCode: cleanDtc,
      });
    }

    // 2. Fallback to generic DTC entry if model-specific record is missing
    if (!fault) {
      fault = await DtcFault.findOne({ dtcCode: cleanDtc });
    }

    // 3. Fallback to static seed data
    if (!fault) {
      fault = findStaticFault(cleanBrand, cleanModel, cleanDtc);
    }

    if (fault) {
      return res.json({
        success: true,
        matched: true,
        data: fault,
      });
    }

    // Unknown code - do not invent fault descriptions
    return res.json({
      success: true,
      matched: false,
      data: {
        vehicleBrand: cleanBrand || 'N/A',
        vehicleModel: cleanModel || 'N/A',
        sensor: 'UNKNOWN',
        dtcCode: cleanDtc,
        faultDescription: `Unknown Diagnostic Trouble Code (${cleanDtc})`,
        possibleCauses: [
          'Unrecognized ECU fault code',
          'Manufacturer-specific proprietary code',
          'Aftermarket modification',
        ],
        recommendedActions: [
          'Consult vehicle OEM service manual',
          'Use professional dealership diagnostic scanner',
        ],
        severity: 'Medium',
      },
    });
  } catch (error) {
    const staticResult = findStaticFault(cleanBrand, cleanModel, cleanDtc);
    if (staticResult) {
      return res.json({ success: true, matched: true, data: staticResult });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/faults/batch-match
// Body: { brand: "SUZUKI", model: "Wagon R", dtcCodes: ["P0101", "P0118"] }
router.post('/batch-match', async (req, res) => {
  const { brand, model, dtcCodes } = req.body;

  if (!dtcCodes || !Array.isArray(dtcCodes) || dtcCodes.length === 0) {
    return res.json({
      success: true,
      condition: 'NORMAL',
      totalFaults: 0,
      matchedFaults: [],
      message: 'Vehicle Condition: No Known DTC Faults Detected',
    });
  }

  const cleanBrand = brand ? brand.toUpperCase().trim() : '';
  const cleanModel = model ? model.trim() : '';
  const results = [];

  for (const code of dtcCodes) {
    const cleanDtc = code.toUpperCase().trim();
    let fault = null;
    try {
      if (cleanBrand && cleanModel) {
        fault = await DtcFault.findOne({
          vehicleBrand: cleanBrand,
          vehicleModel: { $regex: new RegExp(`^${cleanModel}$`, 'i') },
          dtcCode: cleanDtc,
        });
      }
      if (!fault) {
        fault = await DtcFault.findOne({ dtcCode: cleanDtc });
      }
    } catch (e) {
      // ignore db error, fallback to static
    }

    if (!fault) {
      fault = findStaticFault(cleanBrand, cleanModel, cleanDtc);
    }

    if (fault) {
      results.push(fault);
    } else {
      results.push({
        vehicleBrand: cleanBrand,
        vehicleModel: cleanModel,
        sensor: 'UNKNOWN',
        dtcCode: cleanDtc,
        faultDescription: `Unknown Diagnostic Trouble Code (${cleanDtc})`,
        possibleCauses: ['Unrecognized ECU code', 'Check OEM repair documentation'],
        recommendedActions: ['Perform full workshop diagnostic scan'],
        severity: 'Medium',
      });
    }
  }

  res.json({
    success: true,
    condition: results.length > 0 ? 'FAULT_DETECTED' : 'NORMAL',
    totalFaults: results.length,
    matchedFaults: results,
  });
});

module.exports = router;

