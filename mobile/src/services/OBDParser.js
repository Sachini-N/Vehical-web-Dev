/**
 * OBDParser.js
 * Standard SAE J1979 / ISO 15765-4 OBD-II PID & DTC Decoder for ELM327
 */

class OBDParser {
  /**
   * Parse hex responses for Mode 01 Live Sensor PIDs
   */
  static parseSensorPID(rawResponse, pid) {
    if (!rawResponse) return null;

    // Clean response string (remove whitespace, prompts, carriage returns)
    const cleaned = rawResponse.replace(/[\r\n\s>]/g, '').toUpperCase();

    // Look for response matching 41 + PID
    const expectedPrefix = '41' + pid.toUpperCase();
    const index = cleaned.indexOf(expectedPrefix);
    if (index === -1) return null;

    const dataBytesHex = cleaned.substring(index + 4);
    if (dataBytesHex.length < 2) return null;

    // Helper: hex byte to integer
    const byteA = parseInt(dataBytesHex.substring(0, 2), 16);
    const byteB = dataBytesHex.length >= 4 ? parseInt(dataBytesHex.substring(2, 4), 16) : 0;

    switch (pid.toUpperCase()) {
      // 010C: Engine RPM -> ((A * 256) + B) / 4
      case '0C': {
        const rpm = Math.round(((byteA * 256) + byteB) / 4);
        return { name: 'Engine RPM', pid: '010C', value: rpm, unit: 'rpm', min: 0, max: 8000 };
      }

      // 010D: Vehicle Speed -> A
      case '0D': {
        return { name: 'Vehicle Speed', pid: '010D', value: byteA, unit: 'km/h', min: 0, max: 250 };
      }

      // 0105: Engine Coolant Temperature (ECT) -> A - 40
      case '05': {
        const ect = byteA - 40;
        return { name: 'Coolant Temperature (ECT)', pid: '0105', value: ect, unit: '°C', min: -40, max: 120 };
      }

      // 010F: Intake Air Temperature (IAT) -> A - 40
      case '0F': {
        const iat = byteA - 40;
        return { name: 'Intake Air Temperature (IAT)', pid: '010F', value: iat, unit: '°C', min: -40, max: 120 };
      }

      // 0111: Throttle Position Sensor (TPS) -> (A * 100) / 255
      case '11': {
        const tps = Number(((byteA * 100) / 255).toFixed(1));
        return { name: 'Throttle Position (TPS)', pid: '0111', value: tps, unit: '%', min: 0, max: 100 };
      }

      // 0110: Mass Air Flow (MAF) -> ((A * 256) + B) / 100
      case '10': {
        const maf = Number((((byteA * 256) + byteB) / 100).toFixed(1));
        return { name: 'Mass Air Flow (MAF)', pid: '0110', value: maf, unit: 'g/s', min: 0, max: 100 };
      }

      // 010B: Manifold Absolute Pressure (MAP) -> A
      case '0B': {
        return { name: 'Manifold Absolute Pressure (MAP)', pid: '010B', value: byteA, unit: 'kPa', min: 10, max: 255 };
      }

      // 0114: Oxygen Sensor (Bank 1, Sensor 1) -> A / 200
      case '14': {
        const o2 = Number((byteA / 200).toFixed(2));
        return { name: 'Oxygen Sensor (O2)', pid: '0114', value: o2, unit: 'V', min: 0.1, max: 0.9 };
      }

      default:
        return { pid, raw: dataBytesHex };
    }
  }

  /**
   * Parse Mode 03 / Mode 07 Diagnostic Trouble Codes (DTCs)
   * Response format: 43 01 01 01 18 ...
   */
  static parseDTCs(rawResponse) {
    if (!rawResponse) return [];

    const cleaned = rawResponse.replace(/[\r\n\s>]/g, '').toUpperCase();
    if (cleaned.includes('NO DATA') || cleaned.includes('NODATA') || cleaned === '4300') {
      return [];
    }

    const dtcList = [];
    const index = cleaned.indexOf('43');
    if (index === -1) return [];

    const payload = cleaned.substring(index + 2);

    // Each DTC is encoded in 2 bytes (4 hex characters)
    for (let i = 0; i < payload.length; i += 4) {
      if (i + 4 > payload.length) break;
      const dtcHex = payload.substring(i, i + 4);
      if (dtcHex === '0000') continue; // padding bytes

      const firstCharNum = parseInt(dtcHex.charAt(0), 16);
      let systemLetter = 'P'; // Powertrain
      let secondCharDigit = '0';

      // SAE standard DTC prefix decode:
      // 0 = P0, 1 = P1, 2 = P2, 3 = P3
      // 4 = C0, 5 = C1, 6 = C2, 7 = C3 (Chassis)
      // 8 = B0, 9 = B1, A = B2, B = B3 (Body)
      // C = U0, D = U1, E = U2, F = U3 (Network)
      switch (firstCharNum) {
        case 0: systemLetter = 'P'; secondCharDigit = '0'; break;
        case 1: systemLetter = 'P'; secondCharDigit = '1'; break;
        case 2: systemLetter = 'P'; secondCharDigit = '2'; break;
        case 3: systemLetter = 'P'; secondCharDigit = '3'; break;
        case 4: systemLetter = 'C'; secondCharDigit = '0'; break;
        case 5: systemLetter = 'C'; secondCharDigit = '1'; break;
        case 6: systemLetter = 'C'; secondCharDigit = '2'; break;
        case 7: systemLetter = 'C'; secondCharDigit = '3'; break;
        case 8: systemLetter = 'B'; secondCharDigit = '0'; break;
        case 9: systemLetter = 'B'; secondCharDigit = '1'; break;
        case 10: systemLetter = 'B'; secondCharDigit = '2'; break;
        case 11: systemLetter = 'B'; secondCharDigit = '3'; break;
        case 12: systemLetter = 'U'; secondCharDigit = '0'; break;
        case 13: systemLetter = 'U'; secondCharDigit = '1'; break;
        case 14: systemLetter = 'U'; secondCharDigit = '2'; break;
        case 15: systemLetter = 'U'; secondCharDigit = '3'; break;
      }

      const formattedCode = `${systemLetter}${secondCharDigit}${dtcHex.substring(1)}`;
      if (!dtcList.includes(formattedCode)) {
        dtcList.push(formattedCode);
      }
    }

    return dtcList;
  }
}

module.exports = OBDParser;

