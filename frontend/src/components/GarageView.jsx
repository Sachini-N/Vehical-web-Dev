import React, { useState } from 'react';
import { VEHICLES } from '../data/vehicleData';
import { addVehicleAPI } from '../services/api';

export default function GarageView({
  user,
  activeVehicle,
  onSelectActiveVehicle,
  onLogout,
  onBack,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  // New vehicle form state
  const [vehicleBrand, setVehicleBrand] = useState('TOYOTA');
  const [vehicleModel, setVehicleModel] = useState('Prius');
  const [licensePlate, setLicensePlate] = useState('');
  const [year, setYear] = useState('2019');
  const [fuelType, setFuelType] = useState('Petrol / Hybrid');
  const [mileage, setMileage] = useState('');

  const brands = [...new Set(VEHICLES.map((v) => v.brand))];
  const availableModels = VEHICLES.filter((v) => v.brand === vehicleBrand);

  const handleBrandChange = (brand) => {
    setVehicleBrand(brand);
    const models = VEHICLES.filter((v) => v.brand === brand);
    if (models.length > 0) {
      setVehicleModel(models[0].model);
    }
  };

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!licensePlate.trim()) {
      alert('Please enter a vehicle license plate number.');
      return;
    }

    const payload = {
      userId: user?._id,
      brand: vehicleBrand,
      model: vehicleModel,
      licensePlate: licensePlate.toUpperCase().trim(),
      year: parseInt(year, 10) || 2019,
      fuelType,
      mileage: parseInt(mileage, 10) || 0,
      isPrimary: false,
    };

    const res = await addVehicleAPI(payload);
    if (res.success && res.vehicles) {
      user.vehicles = res.vehicles;
      setShowAddForm(false);
      setLicensePlate('');
      alert('New vehicle registered successfully!');
    }
  };

  const vehicles = user?.vehicles || [
    {
      brand: activeVehicle.brand,
      model: activeVehicle.model,
      licensePlate: 'WP CAC-4589',
      year: 2018,
      fuelType: 'Petrol / Hybrid',
      mileage: 68500,
      isPrimary: true,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-800 rounded-lg text-lg text-slate-300 transition-colors"
          >
            ←
          </button>
          <h2 className="text-lg font-bold">My Garage & Profile</h2>
        </div>
        <button
          onClick={onLogout}
          className="text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-800/50"
        >
          Logout
        </button>
      </div>

      {/* Driver Profile Card */}
      <div className="bg-[#101b2d] border border-slate-800 rounded-2xl p-4 shadow flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
          {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'D'}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-base text-white">
            {user?.fullName || 'Registered Vehicle Owner'}
          </h3>
          <p className="text-xs text-slate-400">{user?.email || 'driver@car.lk'}</p>
          {user?.phone && (
            <p className="text-[11px] text-sky-400 mt-0.5">📞 {user.phone}</p>
          )}
        </div>
      </div>

      {/* Registered Vehicles Section */}
      <div>
        <div className="flex justify-between items-center mb-2.5">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
            Registered Vehicles ({vehicles.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center space-x-1"
          >
            <span>{showAddForm ? '✕ Cancel' : '+ Add Vehicle'}</span>
          </button>
        </div>

        {/* Add New Vehicle Accordion Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddVehicle}
            className="bg-[#0b1424] border border-sky-500/40 rounded-2xl p-4 mb-3 space-y-3 shadow-lg"
          >
            <h4 className="text-xs font-bold text-sky-300">
              Register Another Vehicle
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-300 block mb-1">
                  Brand
                </label>
                <select
                  value={vehicleBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full bg-[#101b2d] border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-300 block mb-1">
                  Model
                </label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-[#101b2d] border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  {availableModels.map((m) => (
                    <option key={m.model} value={m.model}>
                      {m.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-300 block mb-1">
                  License Plate
                </label>
                <input
                  type="text"
                  placeholder="e.g. WP-CAB-1234"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-[#101b2d] border border-slate-700 rounded-lg p-2 text-xs text-white font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-300 block mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#101b2d] border border-slate-700 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 font-bold text-xs text-white rounded-lg shadow"
            >
              Save Vehicle to Account
            </button>
          </form>
        )}

        {/* Vehicle Cards List */}
        <div className="space-y-2.5">
          {vehicles.map((v, idx) => {
            const isActive =
              activeVehicle.brand === v.brand &&
              activeVehicle.model === v.model;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-sky-950/40 border-sky-500/70 shadow-lg'
                    : 'bg-[#101b2d] border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                      {v.brand}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {v.model}
                    </h4>
                  </div>
                  {isActive ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ Active Scanner
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        onSelectActiveVehicle({
                          brand: v.brand,
                          model: v.model,
                          licensePlate: v.licensePlate,
                        })
                      }
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-sky-400 px-2.5 py-1 rounded-lg border border-slate-700"
                    >
                      Select Car
                    </button>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-[9px] text-slate-500 block">PLATE</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {v.licensePlate || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">YEAR</span>
                    <span className="font-semibold text-slate-200">
                      {v.year || 2018}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block">MILEAGE</span>
                    <span className="font-semibold text-slate-200">
                      {v.mileage ? `${v.mileage.toLocaleString()} km` : '68,500 km'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

