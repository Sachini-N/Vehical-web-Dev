const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const seedData = require('../seed/seedData.json');

// Check if MongoDB is connected and ready
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET /api/vehicles - Get all vehicles
router.get('/', async (req, res) => {
  try {
    let vehicles = null;
    if (isDbConnected()) {
      vehicles = await Vehicle.find().sort({ brand: 1, model: 1 });
    }
    if (!vehicles || vehicles.length === 0) {
      vehicles = seedData.vehicles;
    }
    res.json({ success: true, count: vehicles.length, data: vehicles });
  } catch (error) {
    res.json({ success: true, count: seedData.vehicles.length, data: seedData.vehicles });
  }
});

// GET /api/vehicles/brands - Get unique list of brands
router.get('/brands', async (req, res) => {
  try {
    let brands = null;
    if (isDbConnected()) {
      brands = await Vehicle.distinct('brand');
    }
    if (!brands || brands.length === 0) {
      brands = [...new Set(seedData.vehicles.map((v) => v.brand))];
    }
    res.json({ success: true, data: brands.sort() });
  } catch (error) {
    const brands = [...new Set(seedData.vehicles.map((v) => v.brand))];
    res.json({ success: true, data: brands.sort() });
  }
});

// GET /api/vehicles/models?brand=TOYOTA - Get models for a selected brand
router.get('/models', async (req, res) => {
  const { brand } = req.query;
  if (!brand) {
    return res.status(400).json({ success: false, message: 'Brand query parameter is required' });
  }
  try {
    let models = null;
    if (isDbConnected()) {
      models = await Vehicle.find({ brand: brand.toUpperCase() }).select('model fuelType supportedSensors');
    }
    if (!models || models.length === 0) {
      models = seedData.vehicles.filter((v) => v.brand.toUpperCase() === brand.toUpperCase());
    }
    res.json({ success: true, data: models });
  } catch (error) {
    const models = seedData.vehicles.filter((v) => v.brand.toUpperCase() === brand.toUpperCase());
    res.json({ success: true, data: models });
  }
});

module.exports = router;
