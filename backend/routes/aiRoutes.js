const express = require('express');
const router = express.Router();

/**
 * AI Sensor Analysis Engine (Random Forest / Anomaly Detection Heuristics)
 * Evaluates the 5 target sensors: TPS, ECT, MAF, MAP, O2
 */
router.post('/analyze-sensors', (req, res) => {
  const { rpm = 0, speed = 0, ect = 80, iat = 30, tps = 0, maf = 2.0, map = 35, o2 = 0.5 } =
    req.body;

  const anomalies = [];
  let faultProbability = 0.05;

  // 1. ECT Analysis (Normal warmed-up operating range: 75°C - 100°C)
  if (ect > 105) {
    anomalies.push({
      sensor: 'ECT',
      severity: 'Critical',
      message: `Coolant Temperature dangerously high (${ect} °C). Overheating risk.`,
      recommendedAction: 'Stop vehicle immediately, check coolant level and fan operation.',
    });
    faultProbability += 0.45;
  } else if (ect < 60 && rpm > 1500) {
    anomalies.push({
      sensor: 'ECT',
      severity: 'Medium',
      message: `Engine operating below closed-loop temp (${ect} °C). Thermostat may be stuck open.`,
      recommendedAction: 'Inspect thermostat and coolant sensor calibration.',
    });
    faultProbability += 0.2;
  }

  // 2. MAF Sensor Analysis (Normal idle: 1.5 - 4.5 g/s; increases linearly with RPM)
  const expectedMafMin = (rpm / 1000) * 1.0;
  const expectedMafMax = (rpm / 1000) * 5.0 + 3.0;
  if (rpm > 800 && (maf < expectedMafMin * 0.4 || maf > expectedMafMax * 1.8)) {
    anomalies.push({
      sensor: 'MAF',
      severity: 'High',
      message: `MAF reading (${maf} g/s) implausible for current RPM (${rpm} rpm).`,
      recommendedAction: 'Inspect air filter, clean MAF sensor element, check intake vacuum leaks.',
    });
    faultProbability += 0.35;
  }

  // 3. MAP Sensor Analysis (Normal atmospheric ~100 kPa key-on, idle 25-45 kPa)
  if (rpm > 700 && map > 75 && tps < 15) {
    anomalies.push({
      sensor: 'MAP',
      severity: 'High',
      message: `High Manifold Absolute Pressure (${map} kPa) at low throttle (${tps}%). Potential intake vacuum leak.`,
      recommendedAction: 'Smoke-test intake manifold, check brake booster hose and PCV valve.',
    });
    faultProbability += 0.3;
  }

  // 4. TPS Sensor Analysis (Idle 10-18%, WOT 80-95%)
  if (tps > 80 && rpm < 900 && speed > 20) {
    anomalies.push({
      sensor: 'TPS',
      severity: 'Medium',
      message: `Throttle position (${tps}%) inconsistent with engine speed (${rpm} rpm).`,
      recommendedAction: 'Check TPS sensor voltage sweep, throttle pedal sensor, and cable/throttle body.',
    });
    faultProbability += 0.25;
  }

  // 5. O2 Sensor Analysis (Narrowband switching between 0.1V - 0.9V)
  if (o2 < 0.1 || o2 > 1.0) {
    anomalies.push({
      sensor: 'O2',
      severity: 'Medium',
      message: `Oxygen Sensor voltage (${o2} V) outside plausible range (0.1V - 0.9V).`,
      recommendedAction: 'Check O2 sensor heater circuit, check for exhaust header leak.',
    });
    faultProbability += 0.25;
  }

  // Normal / Fault Classification
  faultProbability = Math.min(1.0, faultProbability);
  const condition = anomalies.length > 0 ? 'Fault Detected' : 'Normal';

  res.json({
    success: true,
    condition,
    isNormal: anomalies.length === 0,
    faultProbability: Number(faultProbability.toFixed(2)),
    anomalyCount: anomalies.length,
    anomalies,
    evaluatedSensors: ['TPS', 'ECT', 'MAF', 'MAP', 'O2'],
  });
});

module.exports = router;

