const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vehicle = require('../models/Vehicle');
const DtcFault = require('../models/DtcFault');
const seedData = require('./seedData.json');

// Ensure .env is resolved correctly regardless of process working directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vehicle_fault_db';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully.');

    // 1. Clear existing collections
    await Vehicle.deleteMany({});
    await DtcFault.deleteMany({});
    console.log('[Seed] Cleared existing Vehicles and DTC Faults.');

    // 2. Insert Vehicles
    const insertedVehicles = await Vehicle.insertMany(seedData.vehicles);
    console.log(`[Seed] Successfully inserted ${insertedVehicles.length} vehicles.`);

    // 3. Build DTC Records for every supported vehicle + generic fallback
    const faultDocs = [];

    // Add Vehicle-specific DTC records
    for (const v of seedData.vehicles) {
      for (const d of seedData.dtcDefinitions) {
        faultDocs.push({
          vehicleBrand: v.brand,
          vehicleModel: v.model,
          sensor: d.sensor,
          dtcCode: d.dtcCode,
          faultDescription: d.faultDescription,
          possibleCauses: d.possibleCauses,
          recommendedActions: d.recommendedActions,
          severity: d.severity,
        });
      }
    }

    // Add Generic/Global fallback records (Brand: 'ALL', Model: 'ALL')
    for (const d of seedData.dtcDefinitions) {
      faultDocs.push({
        vehicleBrand: 'ALL',
        vehicleModel: 'ALL',
        sensor: d.sensor,
        dtcCode: d.dtcCode,
        faultDescription: d.faultDescription,
        possibleCauses: d.possibleCauses,
        recommendedActions: d.recommendedActions,
        severity: d.severity,
      });
    }

    const insertedFaults = await DtcFault.insertMany(faultDocs);
    console.log(`[Seed] Successfully inserted ${insertedFaults.length} DTC fault records!`);
    console.log('--- SEED COMPLETED SUCCESSFULLY ---');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDatabase();

