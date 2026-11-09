const express = require('express');
const router = express.Router();
const User = require('../models/User');

// In-memory fallback if MongoDB connection is offline
let localUsers = [
  {
    _id: 'user_default_1',
    fullName: 'Kasun Perera',
    email: 'kasun@example.com',
    password: 'password123',
    phone: '0771234567',
    vehicles: [
      {
        _id: 'veh_default_1',
        brand: 'SUZUKI',
        model: 'Wagon R',
        licensePlate: 'WP CAC-4589',
        year: 2018,
        fuelType: 'Petrol / Hybrid',
        mileage: 68500,
        engineCapacity: '660cc',
        isPrimary: true,
      },
    ],
  },
];

// POST /api/auth/register - Register new user along with their vehicle
router.post('/register', async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    vehicleBrand,
    vehicleModel,
    licensePlate,
    year,
    fuelType,
    mileage,
    engineCapacity,
  } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Full Name, Email and Password are required.',
    });
  }

  // Initial vehicle payload
  const initialVehicle = {
    brand: (vehicleBrand || 'SUZUKI').toUpperCase().trim(),
    model: vehicleModel || 'Wagon R',
    licensePlate: (licensePlate || 'WP-NEW-0001').toUpperCase().trim(),
    year: parseInt(year, 10) || 2018,
    fuelType: fuelType || 'Petrol / Hybrid',
    mileage: parseInt(mileage, 10) || 0,
    engineCapacity: engineCapacity || '660cc',
    isPrimary: true,
    registeredAt: new Date(),
  };

  try {
    // Check if user already exists in MongoDB
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password, // In production, use bcrypt.hash()
      phone: phone || '',
      vehicles: [initialVehicle],
    });

    return res.status(201).json({
      success: true,
      message: 'User and vehicle registered successfully!',
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        vehicles: newUser.vehicles,
      },
    });
  } catch (error) {
    // Fallback to local memory if MongoDB is disconnected
    console.log('[Auth API] MongoDB offline, storing in local fallback memory.');
    const localUser = {
      _id: 'user_' + Date.now(),
      fullName,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      vehicles: [
        {
          _id: 'veh_' + Date.now(),
          ...initialVehicle,
        },
      ],
    };
    localUsers.push(localUser);

    return res.status(201).json({
      success: true,
      message: 'User and vehicle registered successfully (Local Session)!',
      user: localUser,
    });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please enter both email and password.',
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      password: password,
    });

    if (user) {
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          vehicles: user.vehicles,
        },
      });
    }
  } catch (error) {
    // Try local fallback
  }

  const localUser = localUsers.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase().trim() &&
      u.password === password
  );

  if (localUser) {
    return res.json({
      success: true,
      message: 'Login successful (Local Session)',
      user: localUser,
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid email or password. Please check your credentials.',
  });
});

// POST /api/auth/vehicles - Add another vehicle to user's garage
router.post('/vehicles', async (req, res) => {
  const {
    userId,
    brand,
    model,
    licensePlate,
    year,
    fuelType,
    mileage,
    engineCapacity,
  } = req.body;

  const newVehicle = {
    brand: (brand || 'TOYOTA').toUpperCase().trim(),
    model: model || 'Prius',
    licensePlate: (licensePlate || 'WP-AAA-1234').toUpperCase().trim(),
    year: parseInt(year, 10) || 2018,
    fuelType: fuelType || 'Petrol / Hybrid',
    mileage: parseInt(mileage, 10) || 0,
    engineCapacity: engineCapacity || '1800cc',
    isPrimary: false,
    registeredAt: new Date(),
  };

  try {
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.vehicles.push(newVehicle);
        await user.save();
        return res.json({ success: true, vehicles: user.vehicles });
      }
    }
  } catch (e) {
    // MongoDB offline fallback
  }

  // Update local memory
  const local = localUsers.find((u) => u._id === userId) || localUsers[0];
  if (local) {
    const v = { _id: 'veh_' + Date.now(), ...newVehicle };
    local.vehicles.push(v);
    return res.json({ success: true, vehicles: local.vehicles });
  }

  return res.status(404).json({ success: false, message: 'User not found' });
});

module.exports = router;

