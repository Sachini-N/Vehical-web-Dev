const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    project: 'Real-Time Vehicle Fault Detection & Recommendation System',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/faults', require('./routes/faultRoutes'));
app.use('/api/scans', require('./routes/scanRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  Engine Fault Detection Backend API running on port ${PORT}`);
  console.log(`  Endpoints:`);
  console.log(`    - Auth:      http://localhost:${PORT}/api/auth/register`);
  console.log(`    - Vehicles:  http://localhost:${PORT}/api/vehicles`);
  console.log(`    - Faults:    http://localhost:${PORT}/api/faults/match`);
  console.log(`    - Scans:     http://localhost:${PORT}/api/scans`);
  console.log(`    - AI Engine: http://localhost:${PORT}/api/ai/analyze-sensors`);
  console.log(`====================================================`);
});

