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
  const [licensePlate, setLicensePlate] = useState('');
  const [year, setYear] = useState('');
  const [fuelType, setFuelType] = useState('Petrol / Hybrid');
  const [mileage, setMileage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract unique brands from our 28 vehicle database
  const brands = [...new Set(VEHICLES.map((v) => v.brand))];
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
          setErrorMsg('Please enter your Full Name, Email, and Password.');
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
      {/* Top Header */}
      <div className="flex items-center space-x-3 pb-2 border-b border-slate-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-slate-200 rounded-lg text-lg text-slate-700 transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-extrabold text-slate-900">
          {mode === 'register' ? 'Register Account & Vehicle' : 'Driver Login'}
        </h2>
      </div>

      <div className="text-center pt-1 pb-1">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-3xl shadow-md shadow-blue-500/20 mb-2">
          🚗
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          OBD-II Vehicle Diagnostic
        </h1>
        <p className="text-xs text-blue-600 font-bold mt-0.5">
          Real-Time Engine Fault Detection & Recommendation System
        </p>
      </div>

      {/* Switch Tab */}
      <div className="flex justify-between items-center bg-slate-200/80 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => {
            setMode('register');
            setErrorMsg('');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
            mode === 'register'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Register Driver & Vehicle
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setErrorMsg('');
          }}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all ${
            mode === 'login'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Login
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* SECTION 1: DRIVER DETAILS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <h3 className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center space-x-1.5">
            <span>👤</span>
            <span>Driver / Owner Profile</span>
          </h3>

          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kasun Perera"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. driver@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. 077 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* SECTION 2: VEHICLE REGISTRATION (Only in Register mode) */}
        {mode === 'register' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-extrabold uppercase text-emerald-800 tracking-wider flex items-center space-x-1.5">
              <span>🚗</span>
              <span>Vehicle Details (Excel 28 Vehicles)</span>
            </h3>

            {/* Brand & Model Dropdowns */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Brand
                </label>
                <select
                  value={vehicleBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Model
                </label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-2.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none"
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
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  License Plate
                </label>
                <input
                  type="text"
                  placeholder="e.g. WP CAC-4589"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold uppercase focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="2018"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Fuel Type
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-2.5 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                >
                  <option value="Petrol / Hybrid">Petrol / Hybrid</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Odometer (km)
                </label>
                <input
                  type="number"
                  placeholder="68500"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.99]"
        >
          {loading ? 'Please wait...' : mode === 'register' ? 'Register & Enter Dashboard' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
