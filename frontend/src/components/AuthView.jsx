import React, { useState } from 'react';
import { VEHICLES } from '../data/vehicleData';
import { registerUserAPI, loginUserAPI } from '../services/api';

export default function AuthView({ onAuthSuccess, onBack }) {
  const [mode, setMode] = useState('register'); // 'register' or 'login'

  // User form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Vehicle form state (for registration)
  const [vehicleBrand, setVehicleBrand] = useState('SUZUKI');
  const [vehicleModel, setVehicleModel] = useState('Wagon R');
  const [licensePlate, setLicensePlate] = useState('WP CAC-4589');
  const [year, setYear] = useState('2018');
  const [fuelType, setFuelType] = useState('Petrol / Hybrid');
  const [mileage, setMileage] = useState('68500');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract unique brands from our 28 vehicle database
  const brands = [...new Set(VEHICLES.map((v) => v.brand))];
  // Filter models for the selected brand
  const availableModels = VEHICLES.filter((v) => v.brand === vehicleBrand);

  const handleBrandChange = (brand) => {
    setVehicleBrand(brand);
    const models = VEHICLES.filter((v) => v.brand === brand);
    if (models.length > 0) {
      setVehicleModel(models[0].model);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          setErrorMsg('Please enter your Name, Email, and Password.');
          setLoading(false);
          return;
        }

        if (!licensePlate.trim()) {
          setErrorMsg('Please enter your vehicle license plate / registration number.');
          setLoading(false);
          return;
        }

        const res = await registerUserAPI({
          fullName,
          email,
          password,
          phone,
          vehicleBrand,
          vehicleModel,
          licensePlate,
          year: parseInt(year, 10) || 2018,
          fuelType,
          mileage: parseInt(mileage, 10) || 0,
        });

        if (res.success && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMsg(res.message || 'Registration failed');
        }
      } else {
        // Login Mode
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter your email and password.');
          setLoading(false);
          return;
        }

        const res = await loginUserAPI({ email, password });
        if (res.success && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMsg(res.message || 'Invalid email or password');
        }
      }
    } catch (err) {
      setErrorMsg('Network error. Check backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="text-center pt-2 pb-1">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-2xl shadow-xl shadow-sky-500/20 mb-2.5">
          🚗
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          OBD II Vehicle Diagnostic
        </h1>
        <p className="text-xs text-sky-400 font-medium mt-0.5">
          Real-Time Engine Fault Detection System
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Register your account & vehicle to enter the dashboard
        </p>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
          {mode === 'register' ? 'New User Registration' : 'Account Login'}
        </span>

        {/* Tab switch */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              mode === 'register'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`px-3 py-1 rounded-md font-semibold transition-all ${
              mode === 'login'
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Login
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl text-xs text-rose-300">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* ============================================================== */}
        {/* SECTION 1: USER DETAILS */}
        {/* ============================================================== */}
        <div className="bg-[#101b2d] border border-slate-800/80 rounded-2xl p-4 shadow space-y-3">
          <h3 className="text-xs font-bold uppercase text-sky-400 tracking-wider flex items-center space-x-1.5">
            <span>👤</span>
            <span>Driver / Owner Profile</span>
          </h3>

          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#071120] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. driver@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#071120] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#071120] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. 077 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#071120] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: VEHICLE REGISTRATION (Only in Register mode) */}
        {/* ============================================================== */}
        {mode === 'register' && (
          <div className="bg-[#101b2d] border border-slate-800/80 rounded-2xl p-4 shadow space-y-3">
            <h3 className="text-xs font-bold uppercase text-emerald-400 tracking-wider flex items-center space-x-1.5">
              <span>🚗</span>
              <span>Vehicle Registration (OBD-II Database)</span>
            </h3>

            {/* Brand & Model Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Brand (Excel DB)
                </label>
                <select
                  value={vehicleBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full bg-[#071120] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Model
                </label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-[#071120] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {availableModels.map((m) => (
                    <option key={m.model} value={m.model}>
                      {m.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* License Plate & Year */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Vehicle No / Plate
                </label>
                <input
                  type="text"
                  placeholder="e.g. WP CAC-4589"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-[#071120] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Year of Manufacture
                </label>
                <input
                  type="number"
                  placeholder="2018"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#071120] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Fuel Type & Current Mileage */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-[#071120] border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Petrol / Hybrid">Petrol / Hybrid</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Current Mileage (km)
                </label>
                <input
                  type="number"
                  placeholder="68500"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full bg-[#071120] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <span>Saving to MongoDB...</span>
          ) : mode === 'register' ? (
            <span>✓ Register Vehicle & Enter App</span>
          ) : (
            <span>Sign In & Enter Dashboard</span>
          )}
        </button>

        {/* Demo Bypass Button */}
        <button
          type="button"
          onClick={() => {
            const demoUser = {
              _id: 'demo_user',
              fullName: 'Kasun Perera',
              email: 'kasun@gmail.com',
              phone: '077 123 4567',
              vehicles: [
                {
                  _id: 'veh_demo',
                  brand: 'SUZUKI',
                  model: 'Wagon R',
                  licensePlate: 'WP CAC-4589',
                  year: 2018,
                  fuelType: 'Petrol / Hybrid',
                  mileage: 68500,
                  isPrimary: true,
                },
              ],
            };
            onAuthSuccess(demoUser);
          }}
          className="w-full py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-all"
        >
          ⚡ Skip & Enter as Demo Driver (Suzuki Wagon R) →
        </button>
      </form>
    </div>
  );
}

