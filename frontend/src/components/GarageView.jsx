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
      _id: 'v1',
      brand: activeVehicle.brand,
      model: activeVehicle.model,
      licensePlate: activeVehicle.licensePlate || 'WP CAC-4589',
      year: activeVehicle.year || 2018,
      fuelType: 'Petrol / Hybrid',
      mileage: 68500,
      isPrimary: true,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-200 rounded-lg text-lg text-slate-700 transition-colors"
          >
            ←
          </button>
          <h2 className="text-lg font-extrabold text-slate-900">My Garage</h2>
        </div>
        <button
          onClick={onLogout}
          className="text-xs text-rose-600 hover:text-rose-800 font-bold"
        >
          Logout
        </button>
      </div>

      {/* Driver Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">{user?.fullName || 'Registered Driver'}</h3>
            <p className="text-xs text-slate-500 font-medium">{user?.email || 'driver@example.com'}</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
          Active Account
        </span>
      </div>

      {/* Vehicles List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
            Registered Vehicles ({vehicles.length})
          </h4>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs text-blue-600 hover:text-blue-800 font-bold"
          >
            {showAddForm ? '✕ Close Form' : '+ Add New Vehicle'}
          </button>
        </div>

        {/* Add Vehicle Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddVehicle}
            className="bg-white border border-blue-200 rounded-2xl p-4 shadow-sm space-y-3"
          >
            <h4 className="text-xs font-extrabold text-slate-900 uppercase">
              Register New Vehicle (Excel Database)
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Brand</label>
                <select
                  value={vehicleBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Model</label>
                <select
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-medium"
                >
                  {availableModels.map((m) => (
                    <option key={m.model} value={m.model}>{m.model}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">License Plate</label>
                <input
                  type="text"
                  placeholder="e.g. WP-CAA-1234"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900 font-mono font-bold uppercase"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Year</label>
                <input
                  type="number"
                  placeholder="2019"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
            >
              Save Vehicle to Garage
            </button>
          </form>
        )}

        {vehicles.map((v, i) => {
          const isSelected = activeVehicle.brand === v.brand && activeVehicle.model === v.model;

          return (
            <div
              key={i}
              className={`bg-white border rounded-2xl p-4 shadow-sm transition-all ${
                isSelected
                  ? 'border-blue-400 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-base text-slate-900">
                      {v.brand} {v.model}
                    </span>
                    {v.licensePlate && (
                      <span className="bg-amber-50 border border-amber-300 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        {v.licensePlate}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {v.year} • {v.fuelType || 'Petrol / Hybrid'} • {v.mileage || '68,500'} km
                  </p>
                </div>

                {isSelected ? (
                  <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-xs">
                    ✓ Active
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectActiveVehicle(v)}
                    className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs rounded-xl border border-slate-200"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
