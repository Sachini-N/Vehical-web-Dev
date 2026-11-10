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
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'OK',
    project: 'Real-Time Vehicle Fault Detection & Recommendation System',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes (support both /api/* and direct path if rewritten by serverless gateway)
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const faultRoutes = require('./routes/faultRoutes');
const scanRoutes = require('./routes/scanRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/vehicles', vehicleRoutes);
app.use('/vehicles', vehicleRoutes);

app.use('/api/faults', faultRoutes);
app.use('/faults', faultRoutes);

app.use('/api/scans', scanRoutes);
app.use('/scans', scanRoutes);

app.use('/api/ai', aiRoutes);
app.use('/ai', aiRoutes);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 7000;

function startServer(port, maxAttempts = 5) {
  let attempts = 0;

  function tryListen(p) {
    attempts++;
    const server = app.listen(p, () => {
      console.log(`====================================================`);
      console.log(`  Engine Fault Detection Backend API running on port ${p}`);
      console.log(`  Endpoints:`);
      console.log(`    - Health:    http://localhost:${p}/health`);
      console.log(`    - Auth:      http://localhost:${p}/api/auth/register`);
      console.log(`    - Vehicles:  http://localhost:${p}/api/vehicles`);
      console.log(`    - Faults:    http://localhost:${p}/api/faults/match`);
      console.log(`    - Scans:     http://localhost:${p}/api/scans`);
      console.log(`    - AI Engine: http://localhost:${p}/api/ai/analyze-sensors`);
      console.log(`====================================================`);
    });

    server.on('error', (err) => {
      if ((err.code === 'EADDRINUSE' || err.code === 'EACCES') && attempts < maxAttempts) {
        console.warn(`[Port ${p} unavailable (${err.code})]: Trying port ${p + 1}...`);
        tryListen(p + 1);
      } else {
        console.error('[Server Start Error]:', err.message);
      }
    });
  }

  tryListen(port);
}

module.exports = app;

if (require.main === module) {
  startServer(DEFAULT_PORT);
}
