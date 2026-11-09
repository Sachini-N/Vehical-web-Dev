import React, { useState, useEffect } from 'react';
import { VEHICLES } from './data/vehicleData';
import { DTC_DATABASE } from './data/dtcData';
import { matchFaultsAPI, saveScanRecord } from './services/api';

import BluetoothScanner from './components/BluetoothScanner';
import GaugeCluster from './components/GaugeCluster';
import SensorGrid from './components/SensorGrid';
import FaultsView from './components/FaultsView';
import FaultDetailsView from './components/FaultDetailsView';
import VehicleSelector from './components/VehicleSelector';
import ScanHistoryView from './components/ScanHistoryView';
import AuthView from './components/AuthView';
import GarageView from './components/GarageView';

export default function App() {
  // FIRST SCREEN DISPLAYED IS 'auth' (User must register/login first)
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [liveViewMode, setLiveViewMode] = useState('cluster'); // 'cluster' or 'grid'

  // User Profile & Vehicle State (Starts as null)
  const [currentUser, setCurrentUser] = useState(null);

  // Active Diagnostic Vehicle (matches primary vehicle of user)
  const [selectedVehicle, setSelectedVehicle] = useState({
    brand: 'SUZUKI',
    model: 'Wagon R',
    licensePlate: 'WP CAC-4589',
    year: 2018,
  });

  // Bluetooth Connection State
  const [connectedDevice, setConnectedDevice] = useState({
    name: 'ELM327 (Bluetooth)',
    address: '00:1D:A5:68:98:8B',
  });
  const [isConnected, setIsConnected] = useState(true);

  // Active DTC Faults
  const [activeDTCs, setActiveDTCs] = useState(['P0101']);
  const [selectedFault, setSelectedFault] = useState(DTC_DATABASE['P0101']);
  const [isScanningVehicle, setIsScanningVehicle] = useState(false);

  // History State
  const [history, setHistory] = useState([
    {
      id: '1',
      date: new Date().toLocaleString(),
      vehicle: 'SUZUKI Wagon R',
      codes: ['P0101'],
      status: 'Fault Detected',
      rpm: 1402,
      ect: 51,
    },
  ]);

  // Live Sensor Stream
  const [sensors, setSensors] = useState({
    rpm: 1402,
    speed: 0,
    ect: 51,
    iat: 35,
    tps: 14.5,
    maf: 2.8,
    map: 36,
    o2: 0.72,
  });

  // Jitter sensor simulation
  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setSensors((prev) => ({
        ...prev,
        rpm: Math.round(1350 + Math.random() * 140),
        ect: Math.min(95, prev.ect + (Math.random() > 0.8 ? 1 : 0)),
        tps: Number((14.0 + Math.random() * 1.5).toFixed(1)),
        maf: Number((2.7 + Math.random() * 0.3).toFixed(1)),
        map: Math.round(35 + Math.random() * 3),
        o2: Number((0.65 + Math.random() * 0.15).toFixed(2)),
      }));
    }, 1100);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Handle successful login or registration
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    if (userData.vehicles && userData.vehicles.length > 0) {
      const primary = userData.vehicles.find((v) => v.isPrimary) || userData.vehicles[0];
      setSelectedVehicle({
        brand: primary.brand,
        model: primary.model,
        licensePlate: primary.licensePlate,
        year: primary.year,
      });
    }
    setCurrentScreen('garage');
  };

  // Run OBD Vehicle Scan
  const handleRunScan = async () => {
    if (!isConnected) {
      alert('Please connect to an ELM327 Bluetooth adapter first.');
      setCurrentScreen('bluetooth');
      return;
    }

    setIsScanningVehicle(true);
    try {
      const match = await matchFaultsAPI(
        selectedVehicle.brand,
        selectedVehicle.model,
        activeDTCs
      );

      const record = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        vehicle: `${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.licensePlate || 'N/A'})`,
        codes: [...activeDTCs],
        status: activeDTCs.length > 0 ? 'Fault Detected' : 'Normal',
        rpm: sensors.rpm,
        ect: sensors.ect,
      };

      setHistory([record, ...history]);
      await saveScanRecord(record);
      setIsScanningVehicle(false);
      setCurrentScreen('faults');
    } catch (e) {
      setIsScanningVehicle(false);
      setCurrentScreen('faults');
    }
  };

  const handleClearCodes = () => {
    if (confirm('Send OBD Mode 04 command to clear trouble codes from ECU?')) {
      setActiveDTCs([]);
      alert('DTC Codes cleared successfully.');
    }
  };

  const handleTriggerFault = (code) => {
    if (!activeDTCs.includes(code)) {
      setActiveDTCs([...activeDTCs, code]);
    } else {
      setActiveDTCs(activeDTCs.filter((c) => c !== code));
    }
  };

  return (
    <div className="flex flex-col h-full select-none text-slate-100">
      {/* Top Status Bar */}
      <div className="flex justify-between items-center px-5 pt-3 pb-2 text-xs text-slate-400 border-b border-slate-800/80 bg-[#070e1a]">
        <span className="font-mono text-slate-300">10:24 PM</span>
        <div className="flex items-center space-x-2">
          <span
            className={`flex items-center text-[11px] font-semibold ${
              isConnected ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            ></span>
            {isConnected ? 'ELM327 Bluetooth' : 'Disconnected'}
          </span>
          <span>🔋 78%</span>
        </div>
      </div>

      {/* Main Dynamic View Area */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4">
        {/* ============================================================== */}
        {/* 1. HOME SCREEN */}
        {/* ============================================================== */}
        {currentScreen === 'home' && (
          <div className="space-y-4">
            {/* Header with Title and User Profile / Bluetooth Buttons */}
            <div className="flex justify-between items-center pb-1">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🚗</span>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">OBD II</h1>
                  <p className="text-xs text-slate-400">
                    Vehicle Health Monitor
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Bluetooth Scanner Button */}
                <button
                  onClick={() => setCurrentScreen('bluetooth')}
                  title="Bluetooth Scanner"
                  className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 text-sky-400 flex items-center space-x-1 transition-colors"
                >
                  <span>📡</span>
                  <span className="text-xs font-bold">BT</span>
                </button>

                {/* Driver Profile / Garage Avatar */}
                <button
                  onClick={() => setCurrentScreen(currentUser ? 'garage' : 'auth')}
                  title="My Garage & Profile"
                  className="p-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 border border-sky-400/30 rounded-xl text-white flex items-center space-x-1.5 shadow"
                >
                  <span className="text-xs font-bold px-1">
                    {currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Sign In'}
                  </span>
                  <span className="text-sm">🚘</span>
                </button>
              </div>
            </div>

            {/* Connection Status Banner */}
            <div
              onClick={() => setCurrentScreen('bluetooth')}
              className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                isConnected
                  ? 'bg-emerald-950/40 border-emerald-500/50 hover:bg-emerald-950/60'
                  : 'bg-rose-950/40 border-rose-500/50 hover:bg-rose-950/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <div>
                  <h3 className="font-semibold text-sm">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {isConnected
                      ? `${connectedDevice?.name || 'ELM327'} (Bluetooth SPP)`
                      : 'Tap to open Bluetooth Scanner'}
                  </p>
                </div>
              </div>
              <span className="text-slate-400 font-bold text-lg">›</span>
            </div>

            {/* Selected Vehicle Card (Displays Registered License Plate & Specs) */}
            <div className="bg-[#101b2d] border border-slate-800/80 rounded-2xl p-4 flex justify-between items-center shadow-lg relative overflow-hidden">
              <div className="z-10">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                    {currentUser ? 'Registered Vehicle' : 'Selected Vehicle'}
                  </span>
                  {selectedVehicle.licensePlate && (
                    <span className="bg-slate-800 border border-slate-700 text-sky-300 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {selectedVehicle.licensePlate}
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Owner: {currentUser?.fullName || 'Guest Driver'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sensors: TPS, ECT, MAF, MAP, O2
                </p>
              </div>

              <div className="z-10 flex flex-col items-end space-y-1.5">
                <button
                  onClick={() => setCurrentScreen('garage')}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                >
                  My Garage
                </button>
                <button
                  onClick={() => setCurrentScreen('vehicleSelect')}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  Change DB Model
                </button>
              </div>
            </div>

            {/* Start Vehicle Scan Button */}
            <button
              onClick={handleRunScan}
              disabled={isScanningVehicle}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
            >
              {isScanningVehicle ? (
                <>
                  <span className="animate-spin text-lg">⏳</span>
                  <span>SCANNING ECU SENSORS & DTCS...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>START VEHICLE SCAN</span>
                </>
              )}
            </button>

            {/* Quick Test Injector with all 26 Excel DTC codes */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-300 font-semibold flex items-center space-x-1">
                  <span>🧪</span>
                  <span>Fault Simulator (26 DTC Codes from Excel):</span>
                </span>
                <span className="text-[10px] text-sky-400 font-mono">Mode 03</span>
              </div>

              {/* Quick Sensor Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {[
                  { code: 'P0101', label: 'MAF (P0101)' },
                  { code: 'P0120', label: 'TPS (P0120)' },
                  { code: 'P0118', label: 'ECT (P0118)' },
                  { code: 'P0107', label: 'MAP (P0107)' },
                  { code: 'P0130', label: 'O2 (P0130)' },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleTriggerFault(item.code)}
                    className={`px-2 py-1 rounded-lg border text-[10px] font-mono transition-all ${
                      activeDTCs.includes(item.code)
                        ? 'bg-rose-600 text-white border-rose-500 font-bold shadow-md shadow-rose-900/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {item.label} {activeDTCs.includes(item.code) ? '✓ Active' : '+'}
                  </button>
                ))}
              </div>

              {/* All 26 DTC Dropdown */}
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center space-x-2">
                <span className="text-[10px] text-slate-400">All 26 Codes:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) handleTriggerFault(e.target.value);
                  }}
                  value=""
                  className="flex-1 bg-[#0b1424] border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-sky-300 focus:outline-none"
                >
                  <option value="">-- Choose DTC Code to Test --</option>
                  {Object.keys(DTC_DATABASE).sort().map((c) => (
                    <option key={c} value={c}>
                      {c} ({DTC_DATABASE[c].sensor}) - {DTC_DATABASE[c].faultDescription}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4 Main Action Cards (Matches Presentation Slide 8) */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {/* 1. Live Data (Blue) */}
              <div
                onClick={() => setCurrentScreen('live')}
                className="bg-[#1d63d8] hover:bg-[#1853ba] p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    📊
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      Live Data
                    </h3>
                    <p className="text-xs text-blue-100">
                      View sensor values & gauges
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-white font-light">›</span>
              </div>

              {/* 2. Faults (Red) */}
              <div
                onClick={() => setCurrentScreen('faults')}
                className="bg-[#d92d20] hover:bg-[#b82418] p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Faults</h3>
                    <p className="text-xs text-red-100">
                      {activeDTCs.length > 0
                        ? `${activeDTCs.length} active engine fault(s)`
                        : 'Check engine errors'}
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-white font-light">›</span>
              </div>

              {/* 3. History (Green) */}
              <div
                onClick={() => setCurrentScreen('history')}
                className="bg-[#099250] hover:bg-[#077a43] p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    🕒
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">History</h3>
                    <p className="text-xs text-emerald-100">
                      Past fault records in MongoDB
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-white font-light">›</span>
              </div>

              {/* 4. Garage / Register (Indigo) */}
              <div
                onClick={() => setCurrentScreen(currentUser ? 'garage' : 'auth')}
                className="bg-[#6366f1] hover:bg-[#4f46e5] p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md transition-transform active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                    🚘
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">
                      My Garage
                    </h3>
                    <p className="text-xs text-indigo-100">
                      Vehicle & owner registration
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-white font-light">›</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. REGISTRATION / SIGN IN VIEW */}
        {/* ============================================================== */}
        {currentScreen === 'auth' && (
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* ============================================================== */}
        {/* 3. MY GARAGE VIEW */}
        {/* ============================================================== */}
        {currentScreen === 'garage' && (
          <GarageView
            user={currentUser}
            activeVehicle={selectedVehicle}
            onSelectActiveVehicle={(v) => {
              setSelectedVehicle(v);
              setCurrentScreen('home');
            }}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentScreen('auth');
            }}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* ============================================================== */}
        {/* 4. BLUETOOTH SCANNER SCREEN */}
        {/* ============================================================== */}
        {currentScreen === 'bluetooth' && (
          <BluetoothScanner
            isConnected={isConnected}
            connectedDevice={connectedDevice}
            onConnect={(dev) => {
              setIsConnected(true);
              setConnectedDevice(dev);
              setCurrentScreen('home');
            }}
            onDisconnect={() => {
              setIsConnected(false);
              setConnectedDevice(null);
            }}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* ============================================================== */}
        {/* 5. LIVE DATA SCREEN */}
        {/* ============================================================== */}
        {currentScreen === 'live' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 hover:bg-slate-800 rounded-lg text-lg text-slate-300 transition-colors"
                >
                  ←
                </button>
                <h2 className="text-lg font-bold">Live Data</h2>
              </div>
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setLiveViewMode('cluster')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    liveViewMode === 'cluster'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Gauge Dials
                </button>
                <button
                  onClick={() => setLiveViewMode('grid')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    liveViewMode === 'grid'
                      ? 'bg-sky-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sensors List
                </button>
              </div>
            </div>

            {liveViewMode === 'cluster' ? (
              <GaugeCluster sensors={sensors} />
            ) : (
              <SensorGrid sensors={sensors} />
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. FAULTS SCREEN */}
        {/* ============================================================== */}
        {currentScreen === 'faults' && (
          <FaultsView
            activeDTCs={activeDTCs}
            onSelectFault={(f) => {
              setSelectedFault(f);
              setCurrentScreen('details');
            }}
            onClearCodes={handleClearCodes}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* ============================================================== */}
        {/* 7. FAULT DETAILS SCREEN */}
        {/* ============================================================== */}
        {currentScreen === 'details' && (
          <FaultDetailsView
            fault={selectedFault}
            onBack={() => setCurrentScreen('faults')}
          />
        )}

        {/* ============================================================== */}
        {/* 8. HISTORY SCREEN */}
        {/* ============================================================== */}
        {currentScreen === 'history' && (
          <ScanHistoryView
            history={history}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* ============================================================== */}
        {/* 9. VEHICLE SELECTION MODAL */}
        {/* ============================================================== */}
        {currentScreen === 'vehicleSelect' && (
          <VehicleSelector
            selectedVehicle={selectedVehicle}
            onSelectVehicle={(v) => setSelectedVehicle(v)}
            onClose={() => setCurrentScreen('home')}
          />
        )}
      </div>

      {/* Bottom App Navigation Bar (Only visible after user registers/logs in) */}
      {currentScreen !== 'auth' && currentUser && (
        <div className="grid grid-cols-5 bg-[#070e1a] border-t border-slate-800/80 py-2.5 text-center text-[10px] text-slate-400">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center ${
              currentScreen === 'home'
                ? 'text-sky-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen('live')}
            className={`flex flex-col items-center ${
              currentScreen === 'live'
                ? 'text-sky-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            <span className="text-lg">📈</span>
            <span>Live Data</span>
          </button>
          <button
            onClick={() => setCurrentScreen('faults')}
            className={`flex flex-col items-center ${
              currentScreen === 'faults'
                ? 'text-sky-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            <span className="text-lg">⚠️</span>
            <span>Faults</span>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className={`flex flex-col items-center ${
              currentScreen === 'history'
                ? 'text-sky-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🕒</span>
            <span>History</span>
          </button>
          <button
            onClick={() => setCurrentScreen('garage')}
            className={`flex flex-col items-center ${
              currentScreen === 'garage'
                ? 'text-indigo-400 font-bold'
                : 'hover:text-slate-200'
            }`}
          >
            <span className="text-lg">🚘</span>
            <span>Garage</span>
          </button>
        </div>
      )}
    </div>
  );
}
