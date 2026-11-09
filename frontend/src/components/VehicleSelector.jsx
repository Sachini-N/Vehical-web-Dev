import React, { useState } from 'react';
import { VEHICLES } from '../data/vehicleData';

export default function VehicleSelector({
  selectedVehicle,
  onSelectVehicle,
  onClose,
}) {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');

  const brands = ['ALL', ...new Set(VEHICLES.map((v) => v.brand))];

  let filtered = VEHICLES;
  if (selectedBrand !== 'ALL') {
    filtered = filtered.filter((v) => v.brand === selectedBrand);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Select Vehicle Model</h2>
          <p className="text-xs text-slate-500 font-medium">All 28 Supported Vehicles (Excel Database)</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 font-bold p-1 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search brand or model (e.g. Wagon R, Prius...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 focus:border-blue-500 text-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-medium shadow-2xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Brand Filter Chips */}
      <div className="flex overflow-x-auto custom-scroll space-x-1.5 pb-1">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedBrand === b
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Vehicles List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scroll pr-1">
        {filtered.map((v, i) => {
          const isSelected =
            selectedVehicle.brand === v.brand && selectedVehicle.model === v.model;

          return (
            <div
              key={i}
              onClick={() => {
                onSelectVehicle({
                  brand: v.brand,
                  model: v.model,
                  licensePlate: selectedVehicle.licensePlate || 'WP CAC-4589',
                  year: selectedVehicle.year || 2018,
                });
                onClose();
              }}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-400 text-blue-950 font-bold'
                  : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
              }`}
            >
              <div>
                <div className="text-sm font-extrabold">
                  {v.brand} {v.model}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {v.fuelType} • Sensors: {v.supportedSensors.join(', ')}
                </div>
              </div>
              {isSelected ? (
                <span className="text-blue-600 font-extrabold text-xs">✓ Active</span>
              ) : (
                <span className="text-slate-300 text-lg">›</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
