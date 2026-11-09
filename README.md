<<<<<<< HEAD
# Real-Time Engine Fault Detection & Recommendation System
### React Native + MongoDB + ELM327 Bluetooth OBD-II

This project implements an AI-ready Real-Time Vehicle Engine Fault Detection and Recommendation Mobile Application matching University Group 07's specifications.

---

## 📁 Project Structure

```
d:\New folder (3)\
├── backend/                  # Node.js + Express + MongoDB Backend
│   ├── config/db.js          # Mongoose MongoDB connection
│   ├── models/
│   │   ├── Vehicle.js        # Vehicle Schema (Brand, Model, Supported Sensors)
│   │   ├── DtcFault.js       # DTC Database Schema (Brand, Model, Sensor, Code, Causes, Actions)
│   │   └── ScanHistory.js    # Scan records & telemetry logs
│   ├── seed/
│   │   ├── seedData.json     # All 28 vehicles & 26 DTC records from Excel
│   │   └── seed.js           # Automated MongoDB seed migration script
│   ├── routes/
│   │   ├── vehicleRoutes.js  # /api/vehicles
│   │   ├── faultRoutes.js    # /api/faults/match & /batch-match
│   │   ├── scanRoutes.js     # /api/scans
│   │   └── aiRoutes.js       # /api/ai/analyze-sensors (Random Forest heuristic)
│   ├── package.json
│   └── server.js
│
├── mobile/                   # React Native Mobile Application
│   ├── src/
│   │   ├── services/
│   │   │   ├── BluetoothService.js # ELM327 Bluetooth Classic SPP & Mock Simulator
│   │   │   ├── OBDParser.js        # Decodes Mode 01 PIDs (RPM, ECT, MAF, MAP, TPS, O2) & Mode 03 DTCs
│   │   │   └── ApiService.js       # Communicates with MongoDB API with offline caching
│   │   └── screens/
│   │       ├── HomeScreen.js       # Screen 1: Connected status, Vehicle card, 4 main action cards
│   │       ├── LiveDataScreen.js   # Screen 2: Real-time sensor dials & gauges
│   │       ├── FaultsScreen.js     # Screen 3: "Engine Fault Detected", active DTC list, Clear codes
│   │       ├── FaultDetailsScreen.js # Screen 4: Active badge, Description, Possible Causes, Recommended Actions
│   │       ├── HistoryScreen.js    # Saved MongoDB diagnostic history
│   │       └── VehicleSelectModal.js # Dynamic dropdown for all 28 vehicles
│   ├── App.js
│   └── package.json
│
└── web/
    └── index.html            # Standalone React Interactive Automotive Studio (Open directly in browser)
```

---

## 🚀 How to Run

### 1. Run the MongoDB Backend
```bash
cd backend
npm install
# Seed all 28 vehicles & DTC codes from the Excel database into MongoDB:
npm run seed
# Start Express API server:
npm start
```

### 2. Run the React Native Mobile App
```bash
cd mobile
npm install
npm run android   # or npm start
```

### 3. Open the Interactive Visual Studio (No setup required!)
Simply open `web/index.html` in Google Chrome or Microsoft Edge to test:
- Live vehicle switching across Toyota, Honda, Suzuki, Nissan, Mitsubishi, Micro
- Real-time sensor gauge streaming (RPM, ECT, MAF, MAP, TPS, O2)
- Fault code simulation and instant matching with possible causes & recommended actions!

=======
# Vehical-web-Dev
Vehicle Web Development Project
>>>>>>> 89920fddb96f62bb61f59988ab1062bdffbe40c4
