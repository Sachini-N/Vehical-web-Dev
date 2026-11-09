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
  // Starts directly on Home screen with clear light UI
  const [currentScreen, setCurrentScreen] = useState('home');
  const [liveViewMode, setLiveViewMode] = useState('cluster'); // 'cluster' or 'grid'

  // Default registered user profile
  const [currentUser, setCurrentUser] = useState({
    _id: 'user_default_1',
    fullName: 'Kasun Perera',
    email: 'kasun@example.com',
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
  });

  // Active Diagnostic Vehicle (matches primary vehicle)
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
      vehicle: 'SUZUKI Wagon R (WP CAC-4589)',
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
    setCurrentScreen('home');
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
    <div className="flex flex-col h-full select-none text-slate-800 bg-slate-50">
      {/* Top Status Bar */}
      <div className="flex justify-between items-center px-5 pt-3 pb-2 text-xs font-medium text-slate-600 border-b border-slate-200/90 bg-white/95">
        <span className="font-mono text-slate-700 font-semibold">10:24 AM</span>
        <div className="flex items-center space-x-2.5">
          <span
            className={`flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isConnected
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            ></span>
            {isConnected ? 'ELM327 Bluetooth' : 'Disconnected'}
          </span>
          <span className="text-slate-600 font-semibold">🔋 78%</span>
        </div>
      </div>

      {/* Main Dynamic View Area */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4 space-y-4">
        {/* ============================================================== */}
        {/* 1. HOME SCREEN (LIGHT THEMED & CLEAR) */}
        {/* ============================================================== */}
        {currentScreen === 'home' && (
          <div className="space-y-4">
            {/* Header with Title and User Profile / Bluetooth Buttons */}
            <div className="flex justify-between items-center pb-1">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-2xl text-white shadow-md shadow-blue-500/25">
                  🚗
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">OBD-II Diagnostic</h1>
                  <p className="text-xs text-slate-500 font-medium">
                    Vehicle Health & Fault Detection
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Bluetooth Scanner Button */}
                <button
                  onClick={() => setCurrentScreen('bluetooth')}
                  title="Bluetooth Scanner"
                  className="p-2 bg-white border border-slate-200 hover:border-blue-300 rounded-xl hover:bg-blue-50 text-blue-600 flex items-center space-x-1.5 shadow-xs transition-colors font-bold text-xs"
                >
                  <span>📡</span>
                  <span>BT</span>
                </button>

                {/* Driver Profile / Garage Avatar */}
                <button
                  onClick={() => setCurrentScreen(currentUser ? 'garage' : 'auth')}
                  title="My Garage & Profile"
                  className="px-2.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white flex items-center space-x-1.5 shadow-sm text-xs font-bold transition-all"
                >
                  <span>🚘</span>
                  <span>{currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Sign In'}</span>
                </button>
              </div>
            </div>

            {/* Connection Status Banner */}
            <div
              onClick={() => setCurrentScreen('bluetooth')}
              className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border shadow-xs transition-all ${
                isConnected
                  ? 'bg-emerald-50/90 border-emerald-300 hover:bg-emerald-100/90 text-emerald-950'
                  : 'bg-rose-50/90 border-rose-300 hover:bg-rose-100/90 text-rose-950'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <div>
                  <h3 className="font-bold text-sm">
                    {isConnected ? 'Adapter Connected' : 'ELM327 Disconnected'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {isConnected
                      ? `${connectedDevice?.name || 'ELM327 OBD-II'} (Bluetooth SPP)`
                      : 'Tap here to scan and pair adapter'}
                  </p>
                </div>
              </div>
              <span className="text-slate-400 font-bold text-xl">›</span>
            </div>

            {/* Selected Vehicle Card (Light with High Contrast) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 tracking-wider">
                      {currentUser ? 'Active Vehicle' : 'Selected Vehicle'}
                    </span>
                    {selectedVehicle.licensePlate && (
                      <span className="bg-amber-50 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold px-2 py-0.5 rounded shadow-2xs">
                        {selectedVehicle.licensePlate}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Driver: {currentUser?.fullName || 'Guest Driver'} ({selectedVehicle.year})
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Monitored Sensors: <span className="font-bold text-slate-700">TPS, ECT, MAF, MAP, O2</span>
                  </p>
                </div>

                <div className="flex flex-col items-end space-y-1.5">
                  <button
                    onClick={() => setCurrentScreen('garage')}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                  >
                    My Garage
                  </button>
                  <button
                    onClick={() => setCurrentScreen('vehicleSelect')}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline"
                  >
                    Change Model
                  </button>
                </div>
              </div>
            </div>

            {/* Start Vehicle Scan Button */}
            <button
              onClick={handleRunScan}
              disabled={isScanningVehicle}
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-2xl shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2.5 transition-all active:scale-[0.99]"
            >
              {isScanningVehicle ? (
                <>
                  <span className="animate-spin text-xl">⏳</span>
                  <span className="tracking-wide">SCANNING SENSORS & DIAGNOSTIC DTCS...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🔍</span>
                  <span className="tracking-wide">START FULL VEHICLE SCAN</span>
                </>
              )}
            </button>

            {/* Quick Test Injector with all 26 Excel DTC codes */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-xs shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-900 font-bold flex items-center space-x-1.5">
                  <span>🧪</span>
                  <span>Fault Code Simulator (Excel 26 DTCs):</span>
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-50 font-mono font-bold px-1.5 py-0.5 rounded border border-blue-200">Mode 03</span>
              </div>

              {/* Quick Sensor Buttons */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
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
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-all ${
                      activeDTCs.includes(item.code)
                        ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    {item.label} {activeDTCs.includes(item.code) ? '✓ Active' : '+'}
                  </button>
                ))}
              </div>

              {/* All 26 DTC Dropdown */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center space-x-2">
                <span className="text-[11px] text-slate-600 font-semibold whitespace-nowrap">Choose Code:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) handleTriggerFault(e.target.value);
                  }}
                  value=""
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
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

            {/* 4 Main Action Cards (Matches Presentation Slide 8 in High-Contrast Colors) */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              {/* 1. Live Data (Blue) */}
              <div
                onClick={() => setCurrentScreen('live')}
                className="bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] text-white"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      Live Data
                    </h3>
                    <p className="text-xs text-blue-100 font-medium">
                      Real-time gauges & sensor dials
                    </p>
                  </div>
                </div>
                <span className="text-3xl font-light">›</span>
              </div>

              {/* 2. Faults (Red) */}
              <div
                onClick={() => setCurrentScreen('faults')}
                className="bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md shadow-rose-500/20 transition-all active:scale-[0.99] text-white"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center text-2xl">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">Faults</h3>
                    <p className="text-xs text-rose-100 font-medium">
                      {activeDTCs.length > 0
                        ? `${activeDTCs.length} active DTC error code(s)`
                        : 'No errors (Vehicle Normal)'}
                    </p>
                  </div>
                </div>
                <span className="text-3xl font-light">›</span>
              </div>

              {/* 3. History (Green) */}
              <div
                onClick={() => setCurrentScreen('history')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md shadow-emerald-500/20 transition-all active:scale-[0.99] text-white"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center text-2xl">
                    🕒
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">History</h3>
                    <p className="text-xs text-emerald-100 font-medium">
                      Past diagnostic logs in MongoDB
                    </p>
                  </div>
                </div>
                <span className="text-3xl font-light">›</span>
              </div>

              {/* 4. Garage / Register (Indigo) */}
              <div
                onClick={() => setCurrentScreen(currentUser ? 'garage' : 'auth')}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-md shadow-indigo-500/20 transition-all active:scale-[0.99] text-white"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center text-2xl">
                    🚘
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      My Garage
                    </h3>
                    <p className="text-xs text-indigo-100 font-medium">
                      Manage registered vehicles & driver profile
                    </p>
                  </div>
                </div>
                <span className="text-3xl font-light">›</span>
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
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1 hover:bg-slate-200 rounded-lg text-lg text-slate-700 transition-colors"
                >
                  ←
                </button>
                <h2 className="text-lg font-extrabold text-slate-900">Live Telemetry</h2>
              </div>
              <div className="flex bg-slate-200/80 border border-slate-300 rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setLiveViewMode('cluster')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    liveViewMode === 'cluster'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dials
                </button>
                <button
                  onClick={() => setLiveViewMode('grid')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    liveViewMode === 'grid'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  List
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

      {/* Bottom App Navigation Bar (Always visible for easy navigation) */}
      <div className="grid grid-cols-5 bg-white border-t border-slate-200 py-2.5 text-center text-[10px] text-slate-500 shadow-lg">
        <button
          onClick={() => setCurrentScreen('home')}
          className={`flex flex-col items-center transition-all ${
            currentScreen === 'home'
              ? 'text-blue-600 font-extrabold scale-105'
              : 'hover:text-slate-800 font-semibold'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentScreen('live')}
          className={`flex flex-col items-center transition-all ${
            currentScreen === 'live'
              ? 'text-blue-600 font-extrabold scale-105'
              : 'hover:text-slate-800 font-semibold'
          }`}
        >
          <span className="text-xl">📈</span>
          <span>Live Data</span>
        </button>
        <button
          onClick={() => setCurrentScreen('faults')}
          className={`flex flex-col items-center transition-all ${
            currentScreen === 'faults'
              ? 'text-rose-600 font-extrabold scale-105'
              : 'hover:text-slate-800 font-semibold'
          }`}
        >
          <span className="text-xl">⚠️</span>
          <span>Faults</span>
        </button>
        <button
          onClick={() => setCurrentScreen('history')}
          className={`flex flex-col items-center transition-all ${
            currentScreen === 'history'
              ? 'text-emerald-600 font-extrabold scale-105'
              : 'hover:text-slate-800 font-semibold'
          }`}
        >
          <span className="text-xl">🕒</span>
          <span>History</span>
        </button>
        <button
          onClick={() => setCurrentScreen('garage')}
          className={`flex flex-col items-center transition-all ${
            currentScreen === 'garage'
              ? 'text-indigo-600 font-extrabold scale-105'
              : 'hover:text-slate-800 font-semibold'
          }`}
        >
          <span className="text-xl">🚘</span>
          <span>Garage</span>
        </button>
      </div>
    </div>
  );
}
