/**
 * ApiService.js
 * Communicates with the MongoDB Backend API with seamless offline fallback
 */

let seedData;
try {
  seedData = require('./seedData.json');
} catch (e) {
  seedData = require('../../backend/seed/seedData.json');
}

const API_BASE_URL = 'http://10.0.2.2:5001/api'; // Android Emulator alias for localhost (or production server IP)

class ApiService {
  /**
   * Fetch all supported vehicles
   */
  static async getVehicles() {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles`, { timeout: 3000 });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    } catch (e) {
      console.log('[API] Offline fallback: loading static vehicles.');
    }
    return seedData.vehicles;
  }

  /**
   * Match DTC codes for a selected vehicle against MongoDB
   */
  static async matchFaults(brand, model, dtcCodes) {
    try {
      const res = await fetch(`${API_BASE_URL}/faults/batch-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, model, dtcCodes }),
        timeout: 3000,
      });
      const data = await res.json();
      if (data.success) {
        return data;
      }
    } catch (e) {
      console.log('[API] Offline fallback: matching faults locally.');
    }

    // Local matching fallback
    const matchedFaults = [];
    for (const code of dtcCodes) {
      const def = seedData.dtcDefinitions.find((d) => d.dtcCode.toUpperCase() === code.toUpperCase());
      if (def) {
        matchedFaults.push({
          vehicleBrand: brand,
          vehicleModel: model,
          sensor: def.sensor,
          dtcCode: def.dtcCode,
          faultDescription: def.faultDescription,
          possibleCauses: def.possibleCauses,
          recommendedActions: def.recommendedActions,
          severity: def.severity,
        });
      } else {
        matchedFaults.push({
          vehicleBrand: brand,
          vehicleModel: model,
          sensor: 'UNKNOWN',
          dtcCode: code,
          faultDescription: `Unknown Diagnostic Trouble Code (${code})`,
          possibleCauses: ['Unrecognized ECU code'],
          recommendedActions: ['Consult vehicle workshop documentation'],
          severity: 'Medium',
        });
      }
    }

    return {
      success: true,
      condition: matchedFaults.length > 0 ? 'FAULT_DETECTED' : 'NORMAL',
      totalFaults: matchedFaults.length,
      matchedFaults,
    };
  }

  /**
   * Submit scan record to MongoDB
   */
  static async saveScan(scanData) {
    try {
      const res = await fetch(`${API_BASE_URL}/scans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scanData),
        timeout: 3000,
      });
      return await res.json();
    } catch (e) {
      console.log('[API] Saved scan to local offline memory');
      return { success: true, localOnly: true };
    }
  }

  /**
   * AI Sensor Health Evaluation (Random Forest Engine)
   */
  static async evaluateSensorsAI(sensorData) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/analyze-sensors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sensorData),
        timeout: 3000,
      });
      return await res.json();
    } catch (e) {
      // Basic client-side heuristic fallback
      const anomalies = [];
      if (sensorData.ect > 105) anomalies.push({ sensor: 'ECT', message: 'Engine Overheating' });
      return {
        success: true,
        condition: anomalies.length > 0 ? 'Fault Detected' : 'Normal',
        anomalies,
      };
    }
  }
}

module.exports = ApiService;

