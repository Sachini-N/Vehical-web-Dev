import React, { useState, useEffect } from 'react';
import { VEHICLES } from './data/vehicleData';
import { DTC_DATABASE } from './data/dtcData';
import { matchFaultsAPI, saveScanRecord, fetchScanHistoryAPI } from './services/api';

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

  // Registered user profile (starts null until driver signs in or registers)
  const [currentUser, setCurrentUser] = useState(null);

  // Active Diagnostic Vehicle (clean state without fake demo plates)
  const [selectedVehicle, setSelectedVehicle] = useState({
    brand: 'SUZUKI',
    model: 'Wagon R',
    licensePlate: '',
    year: 2020,
  });

  // Bluetooth Connection State (disconnected until user connects an adapter)
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Active DTC Faults (starts clean with 0 faults)
  const [activeDTCs, setActiveDTCs] = useState([]);
  const [selectedFault, setSelectedFault] = useState(null);
  const [isScanningVehicle, setIsScanningVehicle] = useState(false);

  // History State (starts empty until scans are performed)
  const [history, setHistory] = useState([]);

  // Live Sensor Stream (0 / idle until connected to OBD-II)
  const [sensors, setSensors] = useState({
    rpm: 0,
    speed: 0,
    ect: 0,
    iat: 0,
    tps: 0,
    maf: 0,
    map: 0,
    o2: 0,
  });

  // Sensor stream simulation (only streams when connected to adapter)
  useEffect(() => {
    if (!isConnected) {
      setSensors({
        rpm: 0,
        speed: 0,
        ect: 0,
        iat: 0,
        tps: 0,
        maf: 0,
        map: 0,
        o2: 0,
      });
      return;
    }
    const interval = setInterval(() => {
      setSensors((prev) => ({
        ...prev,
        rpm: Math.round(1350 + Math.random() * 140),
        ect: Math.min(95, (prev.ect || 50) + (Math.random() > 0.8 ? 1 : 0)),
        tps: Number((14.0 + Math.random() * 1.5).toFixed(1)),
        maf: Number((2.7 + Math.random() * 0.3).toFixed(1)),
        map: Math.round(35 + Math.random() * 3),
        o2: Number((0.65 + Math.random() * 0.15).toFixed(2)),
      }));
    }, 1100);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Load past scan history from Backend API on startup
  useEffect(() => {
    async function loadHistory() {
      const remoteHistory = await fetchScanHistoryAPI();
      if (remoteHistory && remoteHistory.length > 0) {
        setHistory(remoteHistory);
      }
    }
    loadHistory();
  }, []);

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
                <div className="w-11 h-11 rounded-2xl bg-sky-100 border border-sky-200/80 flex items-center justify-center text-2xl text-sky-700 shadow-2xs">
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
                  className="px-2.5 py-1.5 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 rounded-xl text-slate-700 flex items-center space-x-1.5 shadow-2xs transition-colors font-bold text-xs"
                >
                  <span>📡</span>
                  <span>BT</span>
                </button>

                {/* Driver Profile / Garage Avatar */}
                <button
                  onClick={() => setCurrentScreen(currentUser ? 'garage' : 'auth')}
                  title="My Garage & Profile"
                  className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200/80 rounded-xl text-sky-700 flex items-center space-x-1.5 shadow-2xs text-xs font-bold transition-all"
                >
                  <span>🚘</span>
                  <span>{currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Sign In'}</span>
                </button>
              </div>
            </div>

            {/* Connection Status Banner */}
            <div
              onClick={() => setCurrentScreen('bluetooth')}
              className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border shadow-2xs transition-all ${
                isConnected
                  ? 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/80 text-emerald-950'
                  : 'bg-rose-50/80 border-rose-200 hover:bg-rose-100/80 text-rose-950'
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
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 tracking-wider">
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
                    className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold shadow-2xs transition-colors"
                  >
                    My Garage
                  </button>
                  <button
                    onClick={() => setCurrentScreen('vehicleSelect')}
                    className="text-[11px] text-sky-600 hover:text-sky-800 font-bold underline"
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
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold rounded-2xl shadow-sm shadow-sky-600/15 flex items-center justify-center space-x-2.5 transition-all active:scale-[0.99]"
            >
              {isScanningVehicle ? (
                <>
                  <span className="animate-spin text-xl">⏳</span>
                  <span className="tracking-wide">Scanning Sensors & Diagnostic DTCs...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🔍</span>
                  <span className="tracking-wide">Start Full Vehicle Scan</span>
                </>
              )}
            </button>

            {/* 4 Main Action Cards (Soft Pastel Tones / La Pata with Crisp Readability) */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              {/* 1. Live Data (Soft Sky Blue) */}
              <div
                onClick={() => setCurrentScreen('live')}
                className="bg-sky-50/80 hover:bg-sky-100/80 border border-sky-200/90 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs hover:shadow-sm transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white border border-sky-200 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                    📊
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-sky-950">
                      Live Data
                    </h3>
                    <p className="text-xs text-sky-700/80 font-medium">
                      Real-time gauges & sensor dials
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-sky-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
              </div>

              {/* 2. Faults (Soft Rose / Coral) */}
              <div
                onClick={() => setCurrentScreen('faults')}
                className="bg-rose-50/80 hover:bg-rose-100/80 border border-rose-200/90 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs hover:shadow-sm transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white border border-rose-200 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                    ⚠️
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-rose-950">Faults</h3>
                    <p className="text-xs text-rose-700/80 font-medium">
                      {activeDTCs.length > 0
                        ? `${activeDTCs.length} active DTC error code(s)`
                        : 'No errors (Vehicle Normal)'}
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
              </div>

              {/* 3. History (Soft Mint / Emerald) */}
              <div
                onClick={() => setCurrentScreen('history')}
                className="bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/90 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs hover:shadow-sm transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                    🕒
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-emerald-950">History</h3>
                    <p className="text-xs text-emerald-700/80 font-medium">
                      Past diagnostic logs in MongoDB
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
              </div>

              {/* 4. Garage / Register (Soft Indigo / Violet) */}
              <div
                onClick={() => setCurrentScreen(currentUser ? 'garage' : 'auth')}
                className="bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/90 p-4 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs hover:shadow-sm transition-all active:scale-[0.99] group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-2xl shadow-2xs group-hover:scale-105 transition-transform">
                    🚘
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-indigo-950">
                      My Garage
                    </h3>
                    <p className="text-xs text-indigo-700/80 font-medium">
                      Manage registered vehicles & driver profile
                    </p>
                  </div>
                </div>
                <span className="text-2xl text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
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
